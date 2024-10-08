<?php
////////////// Remove automatic redirect
remove_action( 'parse_request', 'WPE\FaustWP\Auth' . '\\handle_generate_endpoint' );
//////////////