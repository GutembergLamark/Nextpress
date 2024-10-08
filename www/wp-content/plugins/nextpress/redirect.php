<?php
////////////// Simple user redirect
function user_redirect() {
    if (!is_page('wp-admin')) {
        wp_redirect(site_url('/wp-admin'));
        exit;
    }
}
add_action('template_redirect', 'user_redirect');
//////////////

////////////// Admin button redirect
add_action( 'admin_bar_menu', 'customize_my_wp_admin_bar', 80 );
function customize_my_wp_admin_bar( $wp_admin_bar ) {
       $site_node = $wp_admin_bar->get_node('site-name');
       $site_node->href = WP_NEXTSITEURL;
       $wp_admin_bar->add_node($site_node);

}
//////////////