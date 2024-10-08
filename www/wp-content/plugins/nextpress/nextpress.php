<?php
/*
Plugin Name: NextPress
Description: Integração do Wordpress com Next, desenvolvido pela OKN.
Version: 1.0
Author: Ezequiel Nilo
*/

function init_() {
    if(function_exists('WPE\FaustWP\Settings\faustwp_get_setting')) {
        ////////////// Essas duas constantes devem existir configuradas no wp-config.php
        WPE\FaustWP\Settings\faustwp_update_setting('frontend_uri', WP_NEXTSITEURL);
        WPE\FaustWP\Settings\faustwp_update_setting('secret_key', WP_NEXTKEY);
        //////////////
    
        // Aqui fica as funcionalidades principais.
        require_once(__DIR__ . '/utilities/replace_functions.php');
        require_once(__DIR__ . '/revalidation.php');
        require_once(__DIR__ . '/redirect.php');
        require_once(__DIR__ . '/next_user.php');
    
        //// Aqui fica as integrações com outros plugins.
        // Essenciais:
        require_once(__DIR__ . '/preview.php');
        require_once(__DIR__ . '/integrations/yoast.php');
        require_once(__DIR__ . '/integrations/wpgraphql.php');
        require_once(__DIR__ . '/integrations/faust.php');
    
        // Opcionais:
        require_once(__DIR__ . '/integrations/contact_form.php');
        // require_once(__DIR__ . '/integrations/advanced_ads.php');

        // Outros.
        add_filter('use_block_editor_for_post', '__return_false');
    }
}

add_action('init', 'init_', 9999);

