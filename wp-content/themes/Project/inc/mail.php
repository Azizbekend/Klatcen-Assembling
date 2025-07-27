<?php 

// Настройка SMTP для корректной работы почты

if(false) {
    add_action('phpmailer_init', 'setup_smtp');
    function setup_smtp($phpmailer) {
        // Настройки SMTP
        $smtp_host = 'mail.jino.ru'; // SMTP-сервер
        $smtp_port = 465; // Порт
        $smtp_username = 'noreply@from.ru'; // Логин
        $smtp_password = ''; // Пароль
        $smtp_secure = 'ssl'; // Шифрование (tls или ssl)
        $from_email = 'noreply@from.ru'; // Email отправителя
        $from_name = 'Название сайта'; // Имя отправителя

        // Настройка PHPMailer для SMTP
        $phpmailer->isSMTP();
        $phpmailer->Host = $smtp_host;
        $phpmailer->SMTPAuth = true;
        $phpmailer->Port = $smtp_port;
        $phpmailer->Username = $smtp_username;
        $phpmailer->Password = $smtp_password;
        $phpmailer->SMTPSecure = $smtp_secure;
        $phpmailer->From = $from_email;
        $phpmailer->FromName = $from_name;

        // Обработка ошибок SMTP
        $phpmailer->SMTPOptions = array(
            'ssl' => array(
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true,
            ),
        );

        // Проверка подключения к SMTP-серверу
        try {
            if (!$phpmailer->smtpConnect()) {
                throw new Exception('Не удалось подключиться к SMTP-серверу.');
            }
        } catch (Exception $e) {
            // Логирование ошибки
            error_log('SMTP Error: ' . $e->getMessage());

            // Отправка письма стандартным способом через wp_mail
            add_filter('wp_mail', function($args) use ($from_email, $from_name) {
                $args['headers'] = array(
                    'From: ' . $from_name . ' <' . $from_email . '>',
                    'Content-Type: text/html; charset=UTF-8',
                );
                return $args;
            });

            // Отключаем SMTP для текущего письма
            $phpmailer->isSMTP(false);
        }
    }

    // Убедимся, что письма отправляются с правильными заголовками
    add_filter('wp_mail_content_type', function() {
        return 'text/html; charset=UTF-8';
    });
}


add_action('wp_ajax_submit_form', 'handle_form_submission');
add_action('wp_ajax_nopriv_submit_form', 'handle_form_submission');

function handle_form_submission() {
    // Проверка nonce (рекомендуется)
    // if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'form_nonce')) {
    //     wp_send_json_error('Ошибка безопасности. Обновите страницу и попробуйте снова.');
    // }

    // Получение данных формы
    $form_data = array();
    $form_type = sanitize_text_field($_POST['form_type']);
    
    
    $email_to = "vladdikj@gmail.com";
    
    // Обработка разных типов форм
    switch ($form_type) {

            
        case 'another_form':

            // шаблон формы

            break;
            
        default: // simple
            
            $form_data = array(
                'Имя' => sanitize_text_field($_POST['name']),
                'Телефон' => sanitize_text_field($_POST['phone']),
                'Способ связи' => sanitize_text_field($_POST['type']),
                'Тип заявки' => 'Заявка с сайта'
            );

    }
    
    if(isset($_POST["page_id"]) && intval($_POST["page_id"])) {
        $page_id = $_POST["page_id"];
        
        $page_title = get_the_title($page_id);
        if($page_title) {
            $form_data['Страница'] = $page_title;
        }
    }
    
    // Валидация данных
    if ( empty($form_data['Имя']) || empty($form_data['Телефон'])) {
        wp_send_json_error('Заполните обязательные поля');
    }
    
    // Отправка email с красивым HTML-шаблоном
    $subject = 'С сайта отправили форму: ' . $form_data['Тип заявки'];
    $headers = array('Content-Type: text/html; charset=UTF-8');
    
    // Формирование HTML-письма
    $message = build_email_template($form_data);
    
    // Прикрепление файла
    $attachments = array();
    if (!empty($_FILES['file'])) {
        $attachments[] = $upload['file'];
    }
//     // Отправка
    $sent = wp_mail($email_to, $subject, $message, $headers, $attachments);
    
    if ($sent) {
        // Дополнительно сохраняем заявку в БД
        save_form_to_db($form_data);
        wp_send_json_success('Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
    } else {
        wp_send_json_error('Ошибка при отправке формы. Пожалуйста, попробуйте позже.');
    }
}

function build_email_template($data) {
    ob_start();
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Новая заявка с сайта</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .email-container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .email-header { background-color: #08365F; color: white; padding: 20px; text-align: center; }
            .email-body { padding: 20px; background-color: #f9f9f9; }
            .data-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .data-table th { background-color: #3498db; color: white; padding: 10px; text-align: left; }
            .data-table td { padding: 10px; border-bottom: 1px solid #ddd; }
            .data-table tr:nth-child(even) { background-color: #f2f2f2; }
            .email-footer { padding: 20px; text-align: center; font-size: 12px; color: #777; }
            .label { font-weight: bold; color: #2c3e50; }
            .value { color: #333; }
            a { color: #3498db; text-decoration: none; }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="email-header">
                <h1>Новая заявка с сайта</h1>
                <h2><?php echo esc_html($data['Тип заявки']); ?></h2>
            </div>
            
            <div class="email-body">
                <table class="data-table">
                    <tbody>
                        <?php foreach ($data as $key => $value): ?>
                            <?php if ($key !== 'Тип заявки'): ?>
                                <tr>
                                    <td class="label"><?php echo esc_html($key); ?></td>
                                    <td class="value"><?php echo is_array($value) ? esc_html(implode(', ', $value)) : $value; ?></td>
                                </tr>
                            <?php endif; ?>                            
                        <?php endforeach; ?>
                    </tbody>
                </table>
                
                <?php
                
                date_default_timezone_set("Europe/Moscow");
                $date = new DateTime();
                
                $timestamp = date('Y-m-d H:i:s');
                $date->setTimestamp(time());
                
                ?>
                
                <p><strong>Дата и время:</strong> <?php echo date('d.m.Y H:i'); ?></p>
                <p><strong>IP-адрес:</strong> <?php echo $_SERVER['REMOTE_ADDR']; ?></p>
            </div>
            
            <div class="email-footer">
                <p>Это письмо было отправлено с сайта <?php echo get_bloginfo('name'); ?></p>
                <p>&copy; <?php echo date('Y'); ?> Все права защищены</p>
            </div>
        </div>
    </body>
    </html>
    <?php
    return ob_get_clean();
}

function save_form_to_db($data) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'form_submissions';
    
    $wpdb->insert(
        $table_name,
        array(
            'form_type' => $data['Тип заявки'],
            'form_data' => json_encode($data, JSON_UNESCAPED_UNICODE),
            'ip_address' => $_SERVER['REMOTE_ADDR'],
            'created_at' => current_time('mysql')
        ),
        array('%s', '%s', '%s', '%s')
    );
}

function handle_file_upload($file_field = 'file') {
    if (empty($_FILES[$file_field]['name'])) {
        return false;
    }

    // Проверка на ошибки загрузки
    if ($_FILES[$file_field]['error'] !== UPLOAD_ERR_OK) {
        wp_send_json_error('Ошибка загрузки файла: ' . $_FILES[$file_field]['error']);
    }

    // Проверка размера файла (не более 5MB)
    $max_size = 5 * 1024 * 1024;
    if ($_FILES[$file_field]['size'] > $max_size) {
        wp_send_json_error('Файл слишком большой. Максимальный размер: 5MB');
    }

    // Проверка типа файла
    $allowed_types = array('jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx');
    $file_ext = strtolower(pathinfo($_FILES[$file_field]['name'], PATHINFO_EXTENSION));
    
    if (!in_array($file_ext, $allowed_types)) {
        wp_send_json_error('Недопустимый тип файла. Разрешены: ' . implode(', ', $allowed_types));
    }

    // Подготовка данных для загрузки
    $upload_overrides = array(
        'test_form' => false,
        'mimes' => array(
            'jpg|jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'pdf' => 'application/pdf',
            'doc' => 'application/msword',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
    );

    require_once(ABSPATH . 'wp-admin/includes/file.php');
    $upload = wp_handle_upload($_FILES[$file_field], $upload_overrides);

    if (isset($upload['error'])) {
        wp_send_json_error('Ошибка при обработке файла: ' . $upload['error']);
    }

    return $upload;
}