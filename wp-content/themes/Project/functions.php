<?php

include "inc/enqueue-assets.php";
include "inc/theme-setup.php";

// Разделение строк через Enter
function enterWrap($string)
{
    return $array = preg_split("/\r\n|\n|\r/", $string);
}

// Функция подсчета просмотров в постах
add_action('wp_head', 'track_post_views');
function track_post_views($post_id)
{
    if (!is_single()) return;
    if (empty($post_id)) {
        global $post;
        $post_id = $post->ID;
    }
    $count = get_post_meta($post_id, 'post_views', true);
    $count = $count ? $count : 0;
    update_post_meta($post_id, 'post_views', $count + 1);
}

// Функция вывода просмотров в постах
function get_post_views()
{
    global $post;
    $views = get_post_meta($post->ID, 'post_views', true);
    return $views ? number_format($views) : '0';
}



/**
 * Шорткод для вывода блока статьи с ACF полями
 * Использование: [your_shortcode]
 */

add_shortcode('your_shortcode', 'your_shortcode_shortcode');
function your_shortcode_shortcode($atts)
{
    global $post;
    // Атрибуты шорткода
    $atts = shortcode_atts([
        'class' => '' // Дополнительные классы
    ], $atts);

    // Получаем ID поста
    $post_id = $post->ID;

    // Проверяем существование поста
    if (!$post_id || !get_post($post_id)) {
        return '<div class="error">Статья не найдена</div>';
    }

    // Пример получения ACF полей (замените на свои)
    $field = get_field('field_name', $post_id);

    // Формируем HTML
    ob_start(); // Начинаем буферизацию вывода
?>

    <!-- Шаблон для вывода шорткода -->

<?php
    return ob_get_clean(); // Возвращаем буферизированный вывод
}


/**
 * Функция для расчета времени прочтения статьи
 */

function calculate_reading_time($post_id)
{
    $cache_key = 'reading_time_' . $post_id;
    $reading_time = get_transient($cache_key);

    if (false === $reading_time) {
        $content = get_the_content($post_id);
        $content = strip_shortcodes($content);
        $content = strip_tags($content);

        // Удаляем пунктуацию и специальные символы
        $content = preg_replace('/[[:punct:]]+/u', ' ', $content);

        // Считаем слова (учитываем русские и английские слова)
        preg_match_all('/[\p{L}\p{N}]+/u', $content, $matches);
        $word_count = count($matches[0]);

        $reading_time = max(1, ceil($word_count / 200)); // минимум 1 минута
        set_transient($cache_key, $reading_time, 12 * HOUR_IN_SECONDS);
    }

    return $reading_time;
}
