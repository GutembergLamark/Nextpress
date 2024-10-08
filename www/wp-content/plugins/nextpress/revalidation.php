<?php
////////////// On demand revalidation
function callRevalidationPost($post_id) {
    $post_type = get_post_type($post_id);
    $page_id = $post_id;

    $post = get_post($page_id);
    $front_page_id = get_option('page_on_front');

    if($post != null && get_page_uri($page_id)){
        $pageUrl = replace_url(get_permalink($page_id));

        if(get_post_status($page_id) != 'publish' && function_exists("get_sample_permalink")) {
            $sample_permalink = get_sample_permalink($page_id);
            $custom_permalink_template = $sample_permalink[0];
            $slug = $sample_permalink[1];
            $pageUrl = replace_url(preg_replace_callback('/%(.*?)%/', function($matches) use ($slug) {
                return $slug;
            }, $custom_permalink_template));
        }

        $parsedUrl = parse_url($pageUrl);
        $pageUri = '/';
        if(isset($parsedUrl['path'])) {
            $pageUri = ltrim(rtrim($parsedUrl['path'], '/'), '/');
        }
        if(stripos($pageUri, '__trashed') !== false) {
            $pageUri = str_replace('__trashed', '', $pageUri);
        }
        if($pageUri != '') {
            callOnDemandRevalidation('/' . (intval($front_page_id) != intval($page_id) ? $pageUri : ''));
        } else if(intval($front_page_id) == intval($page_id)) {
            callOnDemandRevalidation('/');
        }
        if($post_type) callOnDemandRevalidation($post_type);
        if($post_type == 'post') {
            $categories = get_the_category($post_id);
            $tags = get_the_tags($post_id);
            $author_id = get_post_field('post_author', $post_id);
            $author_slug = get_the_author_meta('user_nicename', $author_id);
            $last_editor_id = get_post_meta($post_id, '_edit_last', true);
            $last_editor_slug = get_the_author_meta('user_nicename', $last_editor_id);

            foreach($categories as $category) {
                callOnDemandRevalidation($post_type . '(category: ' . $category->slug . ')' );
            }
            foreach($tags as $tag) {
                callOnDemandRevalidation($post_type . '(tag: ' . $tag->slug . ')' );
            }
            if(isset($author_slug)) {
                callOnDemandRevalidation($post_type . '(author: ' . $author_slug . ')' );
            }
            if(isset($last_editor_slug)) {
                callOnDemandRevalidation($post_type . '(author: ' .   $last_editor_slug . ')' );
            }
        }
        if ($post_type == 'ficha-tecnica') {
            $ficha_marca_terms = get_the_terms($post_id, 'ficha-marca');
        
            if ($ficha_marca_terms && !is_wp_error($ficha_marca_terms)) {
                foreach ($ficha_marca_terms as $term) {
                    callOnDemandRevalidation($post_type . '(marca: ' . $term->slug . ')');
                }
            }
        }
        return;
    } 
}
function callRevalidationACF(){
    $type = false;
    if(isset($_GET['page'])) {
        $type = $_GET['page'];
    }
    if($type) {
        callOnDemandRevalidation($type);
        return;
    }
}
function callRevalidationMenu($menu_id) {
    $menu = wp_get_nav_menu_object($menu_id);
    $name = $menu->name;
    callOnDemandRevalidation($name);
}
function callRevalidationOptionsAndYoast($option_name) {
    if(str_contains($option_name, 'wpseo')) {
        callOnDemandRevalidation($option_name);
    }
}
add_action('acf/save_post', 'callRevalidationACF');
add_action('save_post', 'callRevalidationPost');
add_action('wp_update_nav_menu', 'callRevalidationMenu');
add_action('updated_option', 'callRevalidationOptionsAndYoast');

function callRevalidationTerm($term_id)
{
    $term = get_term($term_id);

    $termUrl = '/';

    if (isset($term)) {
        $termUrl = get_term_link($term->term_id);
        callOnDemandRevalidation($term->taxonomy);
    }

    if (isset($termUrl) && !empty($termUrl)) {
        $parsedUrl = parse_url($termUrl);

        if (isset($parsedUrl['path'])) {
            $termUri = ltrim(rtrim($parsedUrl['path'], '/'), '/');
            callOnDemandRevalidation('/' . $termUri);
        }
    }

    return;
}
add_action('edit_terms', 'callRevalidationTerm');
add_action('create_term', 'callRevalidationTerm');
add_action('deleted_term_taxonomy', 'callRevalidationTerm');

function callRevalidationUser($user_id)
{
    $user = get_userdata($user_id);

    if ($user) {
        $userUrl = get_author_posts_url($user->ID);

        if ($userUrl) {
            $parsedUrl = parse_url(rtrim(replace_url($userUrl), '/'));

            if (isset($parsedUrl['path'])) {
                $userUri = ltrim(rtrim($parsedUrl['path'], '/'), '/');
                callOnDemandRevalidation('/' . $userUri);
            }
        }
    }

    return;
}
add_action('profile_update', 'callRevalidationUser');
add_action('user_register', 'callRevalidationUser');
add_action('delete_user', 'callRevalidationUser');
//////////////

////////////// On demand revalidation global function.
function callOnDemandRevalidation($tag = '/') {
   $curl = curl_init();
   curl_setopt_array($curl, array(
      CURLOPT_URL => rtrim(WP_NEXTSITEURL, '/') . '/essentials/revalidate',
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => "",
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 0,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => 'POST',
      CURLOPT_POSTFIELDS => json_encode(array(
         'tag' => $tag
      )),
      CURLOPT_HTTPHEADER => array(
         'Content-Type: application/json',
         'authorization: ' . WP_NEXTKEY,
         'User-Agent: Wordpress/1.0.0'
      ),
   ));

    $data = curl_exec($curl);
    $http_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);

    $response = json_decode($data);

    curl_close($curl);
}
//////////////
