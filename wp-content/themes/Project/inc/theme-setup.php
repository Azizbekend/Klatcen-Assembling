<?php

remove_action('wp_head',             'print_emoji_detection_script', 7 );
remove_action('admin_print_scripts', 'print_emoji_detection_script' );
remove_action('wp_print_styles',     'print_emoji_styles' );
remove_action('admin_print_styles',  'print_emoji_styles' );

remove_action('wp_head', 'wp_resource_hints', 2 ); //remove dns-prefetch
remove_action('wp_head', 'wp_generator'); //remove meta name="generator"
remove_action('wp_head', 'wlwmanifest_link'); //remove wlwmanifest
remove_action('wp_head', 'rsd_link'); // remove EditURI
remove_action('wp_head', 'rel_canonical'); //remove canonical
remove_action('wp_head', 'wp_shortlink_wp_head', 10); //remove shortlink
remove_action('wp_head', 'wp_oembed_add_discovery_links'); //remove alternate

// Отключить комментарии
add_action("admin_menu", "remove_menus");
function remove_menus() {
    remove_menu_page("edit-comments.php");        # Комментарии
}

// Переименовать посты
add_action('admin_menu', 'rename_posts_menu_label');
function rename_posts_menu_label() {
    global $menu;
    global $submenu;

    // Меняем название в основном меню
    $menu[5][0] = 'Новости'; // Новое название

    // Меняем название в подменю
    $submenu['edit.php'][5][0] = 'Все новости'; // Все записи
    $submenu['edit.php'][10][0] = 'Добавить новость'; // Добавить новую
    $submenu['edit.php'][16][0] = 'Метки новостей'; // Метки
}

// Изменить иконку постов
add_action('admin_head', 'change_posts_menu_icon');
function change_posts_menu_icon() {
    echo '
    <style>
        #menu-posts div.wp-menu-image::before {
            content: "\f321"; /* Иконка из Dashicons */
        }
    </style>
    ';
}

// Предзагрузка шрифтов
add_action('wp_head', 'preload_all_fonts', 1);
function preload_all_fonts() {
    $fonts_dir = get_theme_file_path('/assets/fonts/');
    $fonts_url = get_theme_file_uri('/assets/fonts/');
    
    if (file_exists($fonts_dir)) {
        $font_files = scandir($fonts_dir);
        $allowed_extensions = array('woff2', 'woff', 'ttf');
        
        foreach ($font_files as $font_file) {
            $file_ext = pathinfo($font_file, PATHINFO_EXTENSION);
            
            if (in_array($file_ext, $allowed_extensions)) {
                $font_url = esc_url($fonts_url . $font_file);
                $font_type = "font/{$file_ext}";
                
                echo '<link rel="preload" href="' . $font_url . '" as="font" type="' . $font_type . '" crossorigin>' . "\n";
            }
        }
    }
}


// Включить меню
add_action( 'after_setup_theme', function(){
  register_nav_menus( [
    'header_menu' => 'Главное меню',
    'footer_menu' => 'Меню в подвале'
  ] );
} );

// Меню ACF
if(false) {
  add_action('acf/init', 'my_acf_op_init');
  function my_acf_op_init() {

      if( function_exists('acf_add_options_page') ) {

          $parent = acf_add_options_page(array(
              'page_title'  => __('Информация'),
              'menu_title'  => __('Информация'),
              'redirect'    => true,
              'icon_url' => 'dashicons-list-view',
              'position' => '2.1',
          ));

          $contacts = acf_add_options_page(array(
              'page_title'  => __('Контактная информация'),
              'menu_title'  => __('Контакты'),
              'parent_slug' => $parent['menu_slug'],
              
          ));

          $other = acf_add_options_page(array(
              'page_title'  => __('Другое'),
              'menu_title'  => __('Другое'),
              'parent_slug' => $parent['menu_slug'],
          ));
      }
  }
}


// Изменение пагинации сайта
function custom_posts_pagination($query = false) {
    global $wp_query;
    $max_num_pages = $wp_query->max_num_pages;
    
    if($query) {
         $max_num_pages = $query->max_num_pages;
    }
    
    $big = 999999999; // Уникальное число для замены
    
    $args = array(
        'base'      => str_replace($big, '%#%', esc_url(get_pagenum_link($big))),
        'format'    => '?paged=%#%',
        'current'   => max(1, get_query_var('paged')),
        'total'     => $max_num_pages,
        'type'      => 'array',
        'prev_text' => '<span class="_swiper-prev"></span>',
        'next_text' => '<span class="_swiper-next"></span>',
        'mid_size'  => 2, // Сколько страниц показывать вокруг текущей
        'end_size'  => 1, // Сколько страниц показывать в начале/конце
    );
    
    $links = paginate_links($args);
    
    if ($links) {
        echo '<nav class="custom-pagination" aria-label="' . esc_attr__('Навигация по страницам', 'textdomain') . '">';
          echo '<div class="custom-pagination__list">';
          
            foreach ($links as $link) {
                $class = strpos($link, 'current') !== false ? ' active' : '';
                $link = str_replace('page-numbers', 'custom-pagination__link', $link);
                echo '<div class="custom-pagination__item' . $class . '">' . $link . '</div>';
            }
          
          echo '</div>';
        echo '</nav>';
    }
}
// Убираем пагинацию при AJAX-запросе
add_filter('redirect_canonical', 'disable_redirect_for_loadmore');
function disable_redirect_for_loadmore($redirect_url) {
    if (isset($_POST['action']) && $_POST['action'] === 'load_more_posts') {
        return false;
    }
    return $redirect_url;
}


/*

$menu_location = 'header_menu'; // Укажите ваш location
$locations = get_nav_menu_locations();
$menu = isset($locations[$menu_location]) ? wp_get_nav_menu_object($locations[$menu_location]) : null;
$menu_items = $menu ? wp_get_nav_menu_items($menu->term_id) : array();

// Строим иерархическое меню
$menu_tree = build_menu_tree($menu_items);


<?php foreach ($menu_tree as $item) : ?>
    <?php if (empty($item->children)) : ?>
        <a href="<?php echo esc_url($item->url); ?>" class=""><?php echo esc_html($item->title); ?></a>
    <?php else : ?>
        <a data-open="menu_<?php echo $item->object_id; ?>:1" href="<?php echo esc_url($item->url); ?>" class=""><?php echo esc_html($item->title); ?></a>
        <?php foreach ($item->children as $child) : ?>
            <a href="<?php echo esc_url($child->url); ?>" class="">
                <?php echo esc_html($child->title); ?>
            </a>
        <?php endforeach; ?>
    <?php endif; ?>
<?php endforeach; ?>

*/

// Функция для построения дерева меню
function build_menu_tree(array $elements, $parent_id = 0) {
    $branch = array();
    
    foreach ($elements as $element) {
        if ($element->menu_item_parent == $parent_id) {
            $children = build_menu_tree($elements, $element->ID);
            if ($children) {
                $element->children = $children;
            }
            $branch[] = $element;
        }
    }
    
    return $branch;
}