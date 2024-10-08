<?php
////////////// Filter that gets the latest revision.
function get_preview_id_by_post_id($post_id) {
    $post = get_post($post_id);

    // If the post is already a revision or not published, return the post_id directly
    if(isset($post->post_type)) {
        if ($post->post_type === 'revision' || $post->post_status !== 'publish') {
            return $post_id;
        }
    }

    $revisions = wp_get_post_revisions($post_id);

    $preview_revisions = array_filter($revisions, function($revision) {
        return $revision->post_status === 'auto-draft' || $revision->post_status === 'inherit';
    });

    if (!empty($preview_revisions)) {
        usort($preview_revisions, function($a, $b) {
            return strtotime($b->post_date_gmt) - strtotime($a->post_date_gmt);
        });
        return $preview_revisions[0]->ID;
    }

    return null;
}

////////////// Register dynamic modules type and query.
function get_dynamic_modules($request) {
    $key = $request->get_header('authorization');
    if($key != WP_NEXTKEY) {
        return new WP_Error('no_next_key', 'Not authorized', array('status' => 401));
    }
    $data = $request->get_json_params();
    if(!isset($data['uri']) && !isset($data['id'])) {
        return new WP_Error('no_uri', 'You must specify an URI or ID', array('status' => 404));
    }
    if(!isset($data['field'])) {
        return new WP_Error('no_field', 'You must specify a field', array('status' => 404));
    }
    
    $uri = isset($data['uri']) ? $data['uri'] : false;
    $field = $data['field'];
    $locale = $data['locale'];
    $id = isset($data['id']) ? intval($data['id']) : false;
    $draft = isset($data['draft']) && $data['draft'] === true; 

    $front_page_id = get_option('page_on_front');
    $page_id = url_to_postid($uri);

    if($uri == '/') $page_id = $front_page_id;
    if($id) $page_id = $id;
    if ($locale != '') $page_id = apply_filters('wpml_object_id', $page_id, 'page', TRUE, $locale);

    if ($draft) {
        // Fetch the draft version of the field]
        $page_id = get_preview_id_by_post_id($page_id);
        $modules = get_field($field, $page_id, array('load_value' => true));
    } else {
        // Fetch the published version (default behavior)
        $modules = get_field($field, $page_id);
    }
    
    return array('modules' => $modules, '_id' => $page_id, 'post_type' => get_post_type($page_id)); 
}
add_action('rest_api_init', function() {
    register_rest_route('nextpress/v1', '/modules', array('methods' => 'POST', 'callback' => 'get_dynamic_modules'));
});
//////////////

////////////// WPGraphQL make menus public
add_filter( 'graphql_data_is_private', function( $is_private, $model_name, $data, $visibility, $owner, $current_user ) {
	if ( 'MenuObject' === $model_name || 'MenuItemObject' === $model_name ) {
		return false;
	}
	return $is_private;
}, 10, 6 );
//////////////

////////////// WPGraphQL make preview objects public
add_filter( 'graphql_object_visibility', __NAMESPACE__ . '\change_graphql_visibility', 10, 5 );
function change_graphql_visibility( $visibility, $model_name, $data, $owner, $current_user ) {
    if($model_name == 'PostObject') {
        $visibility = 'public';
    }

    return $visibility;
}


