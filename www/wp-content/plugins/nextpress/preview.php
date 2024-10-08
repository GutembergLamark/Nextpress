<?php
function custom_preview_changes_link($link) {
    $post_id = get_the_ID();
    $status = get_post_status($post_id);
    $draftUrl = rtrim(WP_NEXTSITEURL, '/') . "/essentials/draft";

    $args = array(
        "key" => hash_hmac('sha256', "preview-post", WP_NEXTKEY),
        "toggle" => 1
    );

    if($status == 'publish') {
        $permalink = get_permalink($post_id);
        $args['redirect'] = $permalink;
        return add_query_arg($args, $draftUrl);
    } else {
        $sample_permalink = get_sample_permalink($post_id);
        preg_match('/%([a-z0-9]+)%/', $sample_permalink[0], $matches);
        if (isset($matches[1])) {
            $sample = str_replace("%" . $matches[1] . "%", $post_id, $sample_permalink[0]);
            $args['redirect'] = $sample;
            return add_query_arg($args, $draftUrl);
        }
    }
}

add_filter('preview_post_link', 'custom_preview_changes_link');
