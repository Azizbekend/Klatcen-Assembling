<?php 

// Реализация функционала "Показать ещё" для постов

add_action('wp_ajax_load_more_content', 'load_more_content');
add_action('wp_ajax_nopriv_load_more_content', 'load_more_content');

function load_more_content() {
    check_ajax_referer('load_more_nonce', 'security');
    
    $post_type = sanitize_text_field($_POST['post_type'] ?? 'post');
    $category = sanitize_text_field($_POST['category'] ?? '');
    $page = intval($_POST['page'] ?? 1);
    $sort = isset($_POST['sort']) ? sanitize_text_field($_POST['sort']) : 'newest';
    $posts_per_page = intval($_POST['posts_per_page'] ?? get_option('posts_per_page'));
    
    $args = array(
        'post_type'      => $post_type,
        'post_status'    => 'publish',
        'posts_per_page' => $posts_per_page,
        'paged'          => $page,
    );
    
    
    // Добавляем категорию только для обычных постов
    if ($post_type === 'post' && !empty($category)) {
        $args['category_name'] = $category;
    }
    
    // Добавляем категорию только для обычных постов
    
    // Добавляем сортировку
    switch ($sort) {
        case 'oldest':
            $args['orderby'] = 'date';
            $args['order'] = 'ASC';
            break;
            
        case 'popular':
            $args['meta_key'] = 'post_views';
            $args['orderby'] = 'meta_value_num';
            $args['order'] = 'DESC';
            break;
            
        case 'newest':
        default:
            if ($post_type === 'doctor') {
                $args['orderby'] = 'title';
                $args['order'] = 'ASC';
            } else {
                $args['orderby'] = 'date';
                $args['order'] = 'DESC';
            }
    }
    
    $query = new WP_Query($args);
    
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            
            if ($post_type === 'post_type') {
                // Шаблон для любого типа данных
                ?>
                <?php
            } else {
                // Шаблон для обычных постов
                ?>

                <?php the_post_thumbnail_url('medium'); ?>
                <?php the_permalink(); ?>
                <?php echo wp_trim_words(get_the_excerpt(), 20); ?>
                <?php echo get_the_date('d.m.Y'); ?>
            
            <?php }
        }
        wp_reset_postdata();
    } else {
        echo 'no_posts';
    }
    
    wp_die();
}

// Локализация скрипта
add_action('wp_enqueue_scripts', 'register_loadmore_scripts');
function register_loadmore_scripts() {
    // Регистрируем только на нужных страницах
    if (is_category() || is_archive("post_type")) {
        wp_enqueue_script(
            'load-more',
            get_template_directory_uri() . '/assets/js/load-more.js',
            array(),
            null,
            true
        );
        
        wp_localize_script('load-more', 'site_loadmore', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce'   => wp_create_nonce('load_more_nonce')
        ));
    }
}

// Увеличиваем количество выводимых страниц в пагинации
add_filter('number_of_pagination_links', function() {
    return 5;
});