<?php
$servername = "127.0.0.1"; // Хост базы данных
$username = "root";        // Имя пользователя
$password = "1221";            // Пароль пользователя
$dbname = "image_gallery"; // Имя базы данных

// Подключение к базе данных
$conn = new mysqli($servername, $username, $password, $dbname);

// Проверка соединения
if ($conn->connect_error) {
    die("Ошибка подключения: " . $conn->connect_error);
}

$sql = "SELECT filepath FROM images";
$result = $conn->query($sql);

$images = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $images[] = $row;
    }
}

echo json_encode($images);

$conn->close();
?>
