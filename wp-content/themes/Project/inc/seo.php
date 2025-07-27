<?php

// Исправление хлебных крошек в статьях
add_filter('wpseo_breadcrumb_links', 'yoast_seo_breadcrumbs_add_category');
function yoast_seo_breadcrumbs_add_category($links) {
    if (is_singular('post')) {
        // Получаем рубрики текущего поста
        $categories = get_the_category();
        
        if (!empty($categories)) {
            $primary_category = $categories[0]; // Берем первую рубрику
            
            // Вставляем рубрику перед постом
            array_splice($links, -1, 0, array(
                array(
                    'url' => get_category_link($primary_category),
                    'text' => $primary_category->name
                )
            ));
        }
    }
    return $links;
}

// Добавляет дополнительные поля вывода в YoastSEO через %%value%%
add_filter('wpseo_replacements', 'add_custom_yoast_variables');
function add_custom_yoast_variables($replacements) {
    global $post;
    // Для определенного типа записи
    if (is_singular('post_type') && $post) {
        $replacements['%%value%%'] = "";
    }

    return $replacements;
}

// Убираем теги prev, next в head
add_filter('wpseo_prev_rel_link', '__return_empty_string');
add_filter('wpseo_next_rel_link', '__return_empty_string');

// Убираем пагинацию с канонических страниц
add_filter('wpseo_canonical', 'override_pagination_canonical');
function override_pagination_canonical($canonical) {
    if (is_paged()) {
        global $wp;
        $current_url = home_url($wp->request);
        
        // Если это страница пагинации (/page/2/)
        if (preg_match('/\/page\/\d+/', $current_url)) {
            // Возвращаем URL без пагинации
            return preg_replace('/\/page\/\d+\/?$/', '/', $current_url);
        }
    }
    return str_replace('http://', 'https://', $canonical);
}

// Переводим все теги yoast на https

if(false) {
    add_filter('wpseo_opengraph_url', 'force_https_og_url');

    function force_https_og_url($url) {
        return str_replace('http://', 'https://', $url);
    }
}