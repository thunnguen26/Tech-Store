<?php
// htdocs/techstore-api/admin/admin_product_get_details.php

// BẬT HIỂN THỊ LỖI ĐỂ DEBUG
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

// === HEADER (Quan trọng cho CORS) ===
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// XỬ LÝ PREFLIGHT REQUEST
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// CHỈ CHO PHÉP GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["message" => "Chỉ cho phép GET request"]);
    exit();
}

// === KẾT NỐI CSDL ===
$servername = "localhost";
$username = "root";
$password = ""; 
$dbname = "techstore";

$conn = new mysqli($servername, $username, $password, $dbname);
$conn->set_charset("utf8mb4");

if ($conn->connect_error) { 
    http_response_code(500);
    echo json_encode(["message" => "Lỗi kết nối CSDL: " . $conn->connect_error]);
    exit(); 
}

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

// === XỬ LÝ LOGIC ===

if (!isset($_GET['id']) || empty($_GET['id'])) {
    http_response_code(400); 
    echo json_encode(["message" => "Thiếu ID sản phẩm."]);
    $conn->close();
    exit();
}

$product_id = intval($_GET['id']);

if ($product_id <= 0) {
    http_response_code(400);
    echo json_encode(["message" => "ID sản phẩm không hợp lệ."]);
    $conn->close();
    exit();
}

try {
    $response = [
        'product' => null,
        'variants' => [],
        'images' => []
    ];

    // 1. Lấy thông tin sản phẩm chính (Bảng Products)
    $sql_product = "
        SELECT 
            p.id,
            p.name,
            p.description,
            p.brand,
            p.model,
            p.category_id,
            p.features,
            p.base_image,
            p.status,
            c.name AS category_name
        FROM Products p
        LEFT JOIN Categories c ON p.category_id = c.id
        WHERE p.id = ?
    ";
    
    $stmt_product = $conn->prepare($sql_product);
    
    if (!$stmt_product) {
        throw new Exception("Lỗi prepare statement: " . $conn->error);
    }
    
    $stmt_product->bind_param("i", $product_id);
    $stmt_product->execute();
    $result_product = $stmt_product->get_result();

    if ($result_product->num_rows == 0) {
        http_response_code(404);
        echo json_encode(["message" => "Không tìm thấy sản phẩm với ID: " . $product_id]);
        $stmt_product->close();
        $conn->close();
        exit();
    }
    
    $product_data = $result_product->fetch_assoc();
    
    // Giải mã JSON features (nếu có) - XỬ LÝ AN TOÀN
    if (!empty($product_data['features'])) {
        $decoded = json_decode($product_data['features'], true);
        if (json_last_error() === JSON_ERROR_NONE) {
            $product_data['features'] = $decoded;
        } else {
            // Nếu không decode được, trả về object rỗng
            $product_data['features'] = [];
            error_log("JSON decode error for product {$product_id}: " . json_last_error_msg());
        }
    } else {
        $product_data['features'] = [];
    }
    
    $response['product'] = $product_data;
    $stmt_product->close();

    // 2. Lấy TẤT CẢ biến thể (Bảng ProductVariants)
    $sql_variants = "
        SELECT 
            id,
            product_id,
            size,
            color_name,
            color_hex,
            price,
            original_price,
            sku,
            stock_quantity
        FROM ProductVariants 
        WHERE product_id = ?
        ORDER BY id ASC
    ";
    
    $stmt_variants = $conn->prepare($sql_variants);
    
    if (!$stmt_variants) {
        throw new Exception("Lỗi prepare variants statement: " . $conn->error);
    }
    
    $stmt_variants->bind_param("i", $product_id);
    $stmt_variants->execute();
    $result_variants = $stmt_variants->get_result();
    
    while($v_row = $result_variants->fetch_assoc()) {
        // Chuyển đổi kiểu dữ liệu - BỎ SỐ 0 Ở ĐẦU
        $v_row['id'] = (int)$v_row['id'];
        $v_row['product_id'] = (int)$v_row['product_id'];
        $v_row['price'] = (float)$v_row['price'];
        $v_row['original_price'] = $v_row['original_price'] ? (float)$v_row['original_price'] : null;
        $v_row['stock_quantity'] = (int)ltrim($v_row['stock_quantity'], '0') ?: 0; // BỎ SỐ 0 ĐẦU
        
        $response['variants'][] = $v_row;
    }
    $stmt_variants->close();

    // 3. Lấy TẤT CẢ ảnh (Bảng ProductImages)
    $sql_images = "
        SELECT image_url 
        FROM ProductImages 
        WHERE product_id = ?
        ORDER BY id ASC
    ";
    
    $stmt_images = $conn->prepare($sql_images);
    
    if (!$stmt_images) {
        throw new Exception("Lỗi prepare images statement: " . $conn->error);
    }
    
    $stmt_images->bind_param("i", $product_id);
    $stmt_images->execute();
    $result_images = $stmt_images->get_result();
    
    while($i_row = $result_images->fetch_assoc()) {
        $response['images'][] = $i_row['image_url'];
    }
    $stmt_images->close();
    
    // Trả về response
    http_response_code(200);
    echo json_encode($response);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "message" => "Lỗi máy chủ: " . $e->getMessage(),
        "file" => $e->getFile(),
        "line" => $e->getLine()
    ]);
}

$conn->close();
?>