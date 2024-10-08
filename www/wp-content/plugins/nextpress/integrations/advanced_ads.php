<?php
if(is_plugin_active('advanced-ads/advanced-ads.php')) {
    ////////////// Get form raw HTML.
    function get_iframe_ad($request) {
        header('Content-Type: text/html; charset=UTF-8');
        header('Cache-Control: public, max-age=3600');
        header("CDN-Cache-Control: public, max-age=3600");

        $group = $request->get_param("group");
        $ad = $request->get_param("ad");
        $ad_id;
        $isGroup = false;

        if(isset($ad)) {
            $ad_id = intval($ad);
        }
        if(isset($group)) {
            $ad_id = intval($group);
            $isGroup = true;
        }

        if(!$ad_id) {
            return new WP_Error('no_ad_id', 'Ads ID not found.', array('status' => 401));
        }

        ob_start();
        wp_head();

        ?>
            <base target="_blank">
            <style>
                body {
                    width: 100vw;
                    margin: 0;
                    position: relative;
                    height: fit-content;
                }

                html {
                    height: fit-content;
                    overflow: hidden;
                }

                body * {
                    min-width: 100vw;
                    max-width: 100vw;
                    height: auto;
                }

                .ad {
                    width: 100vw;
                    height: auto;
                }
            </style>
            <script>
                document.addEventListener('DOMContentLoaded', () => {
                    window.addEventListener('resize', () => window.parent.postMessage({location: window.location.href, height: document.querySelector('body').offsetHeight}, '*'));
                    window.parent.postMessage({location: window.location.href, height: document.querySelector('body').offsetHeight}, '*');
                })
            </script>
        <?php

        ?>
            <div class="ad">
        <?php

        if($isGroup) {
            the_ad_group($ad_id);
        } else {
            the_ad($ad_id);
        }

        ?>
            </div>
        <?php

        wp_footer();
        ob_end_flush();

        exit;
    }
    add_action('rest_api_init', function() {
        register_rest_route('nextpress/v1', '/ads', array('methods' => 'GET', 'callback' => 'get_iframe_ad'));
    });
}
