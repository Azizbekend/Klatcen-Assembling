<?php

add_action('wp_enqueue_scripts', 'site_scripts');
function site_scripts()
{
    wp_enqueue_style('style', get_template_directory_uri() . '/assets/css/style.min.css');
    wp_enqueue_script('vendor-script', get_template_directory_uri() . '/assets/js/vendors.min.js', 'null', true);
    wp_enqueue_script('script', get_template_directory_uri() . '/assets/js/app.min.js', array("vendor"), 'null', true);
}


add_theme_support('post-thumbnails');
add_theme_support('title-tag');
add_theme_support('custom-logo');


// Общий шаблон
add_action('acf/init', 'my_acf_op_init');
function my_acf_op_init()
{

    // Check function exists.
    if (function_exists('acf_add_options_page')) {

        // Add parent.
        $parent = acf_add_options_page(array(
            'page_title'  => __('Сайт'),
            'menu_title'  => __('Сайт'),
            'redirect'    => true,
            'icon_url' => 'dashicons-list-view',
            'position' => '2.1',
        ));

        // Add sub pages.
        $contacts = acf_add_options_page(array(
            'page_title'  => __('Контактная информация'),
            'menu_title'  => __('Контакты'),
            'parent_slug' => $parent['menu_slug'],

        ));
    }
}
