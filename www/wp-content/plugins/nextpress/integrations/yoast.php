<?php
////////////// Yoast front-end adjust
function replace_json_ld_urls( $data ) {
    if (isset($data[2]['potentialAction'])){
        unset($data[2]['potentialAction']);
    }
    $dataReplaced = $data;
    recursive_replace($dataReplaced);
    return $dataReplaced;
}
add_filter('wpseo_schema_graph', 'replace_json_ld_urls');

function prefix_filter_canonical_example( $canonical ) {
    return replace_url($canonical);
}
add_filter( 'wpseo_canonical', 'prefix_filter_canonical_example' );
add_filter( 'wpseo_opengraph_url', 'prefix_filter_canonical_example' );

function rewrite_page_link($permalink, $post, $leavename) {
    if($permalink) {
        $permalink = replace_url($permalink);
    }
    return $permalink;
}
add_filter('post_type_link', 'rewrite_page_link', 10, 3);

function gutemberg_post_preview_fix($response, $post)
{
    $response->data['link'] = replace_url($response->data['link']);
    $response->data['permalink_template'] = replace_url($response->data['link']);
    return $response;
}
add_filter('rest_prepare_post', 'gutemberg_post_preview_fix', 10, 2);

function filter_edit_post_link($url, $post_id, $context) {
    $url = rtrim(replace_url($url), '/');
    return $url;
}
add_filter('get_edit_post_link', 'filter_edit_post_link', 10, 3);
add_filter('rest_prepare_page', 'gutemberg_post_preview_fix', 10, 2);

function change_site_url( $url ) {
    if(is_admin()) {
        return $url;
    }

    $canonical = WPE\FaustWP\Settings\faustwp_get_setting('frontend_uri');
    if ( (defined( 'GRAPHQL_REQUEST' ) && GRAPHQL_REQUEST) || strpos( $_SERVER['REQUEST_URI'], 'sitemap') ) {
        $url = replace_url($url);
    }

    return $url;
}
add_filter( 'site_url', 'change_site_url' );
add_filter( 'home_url', 'change_site_url' );

function remove_trailingslash( $url ) {
    if ( substr( $url, -1 ) == '/' && strlen( $url ) > 1 ) {
        return untrailingslashit( $url );
    }
    return $url;
}
add_filter( 'user_trailingslashit', 'remove_trailingslash' );

//////////////

function custom_sitemap_entry( $url, $type, $object ) {
    $url['loc'] = replace_url($url['loc']);
    return $url;
}    
add_filter( 'wpseo_sitemap_entry', 'custom_sitemap_entry', 10, 3 );

////////////// WpGraphQL Yoast
add_action( 'graphql_register_types', function() {
	register_graphql_field( 'PostTypeSEO', 'author', [
		'type' => 'String',
		'description' => __('Autor da postagem', 'your-textdomain' ),
		'resolve' => function( $post, $args, $context, $info ) {
            $post_ = get_post($post->ID);
            $author_metadata = get_the_author_meta('display_name', $post_->post_author);
            return $author_metadata;
		}
	]);
} );