<?php
// Simple replace function
function replace_url($url) {
    if(stripos($url, rtrim(WP_SITEURL, '/')) === 0) {
        $posUrl = str_replace(rtrim(WP_SITEURL, '/'), '', $url);
        $nextUrl = rtrim(WP_NEXTSITEURL, '/');
        if($nextUrl[strlen($nextUrl) - 1] == '/') $nextUrl = substr_replace($nextUrl, '', strlen($nextUrl) - 1, 1);
        if(!empty($posUrl)){
            if($posUrl[0] != '/') $posUrl = '/' . $posUrl;
        }
        $newUrl = $nextUrl . $posUrl;
    } else $newUrl = $url;
    return $newUrl;
}

function recursive_replace(&$data) {
    foreach($data as &$value) {
        if(is_array($value)) {
            recursive_replace($value);
        } elseif (is_object($value)) {
            recursive_replace($value);
        } elseif (is_string($value)) {
            $value = replace_url($value);
        }
    }
}
