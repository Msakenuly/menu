<?php
$servername = "127.0.0.1"; // Хост базы данных
$username = "root";        // Имя пользователя
$password = "1221";            // Пароль пользователя
$dbname = "image_gallery"; // Имя базы данных

// Подключение к базе данных
$conn = new mysqli($servername, $username, $password, $dbname);

// Проверка соединения
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Ошибка подключения: " . $conn->connect_error]));
}

$response = ["status" => "success", "message" => "Файлы успешно загружены!", "errors" => []];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_FILES['imageFile'])) {
        $fileCount = count($_FILES['imageFile']['name']);
        
        for ($i = 0; $i < $fileCount; $i++) {
            $filename = $_FILES['imageFile']['name'][$i];
            $filepath = 'uploads/' . basename($filename);
            
            // Перемещение загруженного файла в папку uploads
            if (move_uploaded_file($_FILES['imageFile']['tmp_name'][$i], $filepath)) {
                // Запись информации об изображении в базу данных
                $stmt = $conn->prepare("INSERT INTO images (filename, filepath) VALUES (?, ?)");
                $stmt->bind_param("ss", $filename, $filepath);
                if (!$stmt->execute()) {
                    $response['status'] = 'error';
                    $response['errors'][] = "Ошибка записи в базу данных: $filename";
                }
                $stmt->close();
            } else {
                $response['status'] = 'error';
                $response['errors'][] = "Ошибка загрузки файла: $filename";
            }
        }
    } else {
        $response['status'] = 'error';
        $response['message'] = 'Файлы не обнаружены.';
    }
}

$conn->close();
echo json_encode($response);
?>
