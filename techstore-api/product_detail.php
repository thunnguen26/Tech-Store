<?php
// htdocs/techstore-api/product_detail.php

// === HEADER (Quan trọng cho CORS) ===
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// === KẾT NỐI CSDL ===
$servername = "localhost";
$username = "root";
$password = ""; 
$dbname = "techstore";

$conn = new mysqli($servername, $username, $password, $dbname);
$conn->set_charset("utf8mb4");
if ($conn->connect_error) { die("Connection failed"); }

// === XỬ LÝ LOGIC ===

if (!isset($_GET['id']) || empty($_GET['id'])) {
    http_response_code(400); 
    echo json_encode(array("message" => "Thiếu ID sản phẩm."));
    exit();
}
$product_id = intval($_GET['id']);

$response = null;

// 1. Lấy thông tin sản phẩm chính
$sql_product = "
    SELECT 
        p.id, p.name, p.description, p.brand, p.features, p.base_image, p.status,
        c.name AS category_name
    FROM Products p
    LEFT JOIN Categories c ON p.category_id = c.id
    WHERE p.id = ? AND p.status = 'active'
";
$stmt = $conn->prepare($sql_product);
$stmt->bind_param("i", $product_id);
$stmt->execute();
$result_product = $stmt->get_result();

if ($result_product->num_rows > 0) {
    $response = $result_product->fetch_assoc();

    // 2. Lấy các biến thể
    $sql_variants = "SELECT * FROM ProductVariants WHERE product_id = $product_id";
    $result_variants = $conn->query($sql_variants);
    $variants = array();
    if ($result_variants->num_rows > 0) {
        while($v_row = $result_variants->fetch_assoc()) {
            $variants[] = $v_row;
        }
    }
    $response['variants'] = $variants;

    // 3. Lấy các ảnh gallery
    $sql_images = "SELECT image_url FROM ProductImages WHERE product_id = $product_id";
    $result_images = $conn->query($sql_images);
    $images = array();
    if ($result_images->num_rows > 0) {
        while($i_row = $result_images->fetch_assoc()) {
            $images[] = $i_row['image_url'];
        }
    }
    $response['images'] = $images;

    // === 4. SỬA LỖI: LẤY ĐÁNH GIÁ (REVIEWS) ===
    $sql_reviews = "
        SELECT 
            r.rating, 
            r.comment, 
            r.created_at, 
            CONCAT(u.first_name, ' ', u.last_name) AS user_name
        FROM Reviews r
        JOIN Users u ON r.user_id = u.id
        WHERE r.product_id = ?
        ORDER BY r.created_at DESC
    ";
    $stmt_reviews = $conn->prepare($sql_reviews);
    $stmt_reviews->bind_param("i", $product_id);
    $stmt_reviews->execute();
    $result_reviews = $stmt_reviews->get_result();
    
    $reviews = array();
    $total_rating = 0;
    
    if ($result_reviews->num_rows > 0) {
        while($r_row = $result_reviews->fetch_assoc()) {
            $reviews[] = $r_row;
            $total_rating += $r_row['rating'];
        }
    }
    
    $response['reviews'] = $reviews;
    $response['review_count'] = count($reviews);
    $response['rating'] = (count($reviews) > 0) ? ($total_rating / count($reviews)) : 0;
    
    $stmt_reviews->close();
    // === KẾT THÚC SỬA LỖI ===

    http_response_code(200);
    echo json_encode($response);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "Không tìm thấy sản phẩm."));
}

$stmt->close();
$conn->close();
?>