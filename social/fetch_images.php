<?php
$host = '3306';
$db = 'gallery';
$user = 'root';
$pass = '';
try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "Подключение к базе данных успешно!<br>";

    $stmt = $pdo->query("SELECT * FROM images");
    $images = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($images);
} catch (PDOException $e) {
    echo "Ошибка подключения: " . $e->getMessage();
}
?>