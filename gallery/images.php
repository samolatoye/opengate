<?php 
/*header('Content-Type: application/json');

$dir = __DIR__ . '/uploads/';
$baseUrl = '/uploads/';

if (!is_dir($dir)) {
    echo json_encode([]);
    exit;
}

$files = scandir($dir);
$images = [];

foreach ($files as $file) {
    if (preg_match('/\.(jpg|jpeg|png|gif)$/i', $file)) {
        $images[] = $baseUrl . $file;
    }
}

echo json_encode($images);*/

header('Content-Type: application/json');

$dir = __DIR__ . '/uploads/';
$baseUrl = '/opengate/gallery/uploads/';  // ✅ important change

if (!is_dir($dir)) {
    echo json_encode([]);
    exit;
}

$files = scandir($dir);
$images = [];

foreach ($files as $file) {
    $filePath = $dir . $file;
    if (is_file($filePath) && preg_match('/\.(jpg|jpeg|png|gif)$/i', $file)) {
        $images[] = $baseUrl . $file;
    }
}

echo json_encode($images);
