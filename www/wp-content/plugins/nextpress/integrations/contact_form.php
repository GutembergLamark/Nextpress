<?php
// Liberar rotas do plugin Contact Form 7
if(class_exists('WPCF7_REST_Controller')) {
	add_action('rest_api_init', function () {
		$extraController = new WPCF7_REST_Controller;
		register_rest_route( WPCF7_REST_Controller::route_namespace,
			'/contact-forms',
			array(
				array(
					'methods' => WP_REST_Server::READABLE,
					'callback' => array( $extraController, 'get_contact_forms' ),
					'permission_callback' => '__return_true',
				),
			)
		);
		register_rest_route( WPCF7_REST_Controller::route_namespace,
			'/contact-forms/(?P<id>\d+)',
			array(
				array(
					'methods' => WP_REST_Server::READABLE,
					'callback' => array( $extraController, 'get_contact_form' ),
					'permission_callback' => '__return_true',
				),
			)
		);
	}, 9, 0);

    ////////////// Get form raw HTML.
    function get_raw_form($request) {
        $data = $request->get_json_params();
        $form_id;
        if(isset($data['id'])) {
            $form_id = $data['id'];
        }
        if(!$form_id) {
            return new WP_Error('no_form_id', 'Form ID not found.', array('status' => 401));
        }
        $ContactForm = WPCF7_ContactForm::get_instance($form_id);
        $form_fields = $ContactForm->scan_form_tags();

        return $form_fields;
    }
    add_action('rest_api_init', function() {
        register_rest_route('nextpress/v1', '/contact-form', array('methods' => 'POST', 'callback' => 'get_raw_form'));
    });
}