<?php

function theme_assets() {
  // CSS
  wp_enqueue_style('main-css', get_template_directory_uri() . '/assets/css/style.min.css', array(), filemtime(get_template_directory() . '/assets/css/style.min.css'));
  
  // JS
  wp_enqueue_script('vendor-script', get_template_directory_uri() . '/assets/js/vendors.min.js', array(), filemtime(get_template_directory() . '/assets/js/vendors.min.js'), true);
  wp_enqueue_script('main-script', get_template_directory_uri() . '/assets/js/app.min.js', array(), filemtime(get_template_directory() . '/assets/js/app.min.js'), true);

}
add_action('wp_enqueue_scripts', 'theme_assets');