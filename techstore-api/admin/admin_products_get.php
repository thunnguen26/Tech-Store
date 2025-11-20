<?php
// htdocs/techstore-api/admin/admin_products_get.php

// === HEADER (Quan trọng cho CORS) ===
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

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
    echo json_encode(["message" => "Lỗi kết nối CSDL"]);
    exit();
}

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    // === LẤY TẤT CẢ SẢN PHẨM (bao gồm draft và archived) ===
    $sql_products = "
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
        ORDER BY p.id DESC
    ";

    $result_products = $conn->query($sql_products);
    
    if (!$result_products) {
        throw new Exception("Lỗi query products: " . $conn->error);
    }
    
    $products = array();

    if ($result_products->num_rows > 0) {
        while($row = $result_products->fetch_assoc()) {
            $product_id = (int)$row['id'];
            
            // Giải mã JSON features
            if ($row['features']) {
                $row['features'] = json_decode($row['features'], true);
            } else {
                $row['features'] = [];
            }
            
            // === LẤY CÁC BIẾN THỂ ===
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
            $stmt_variants->bind_param("i", $product_id);
            $stmt_variants->execute();
            $result_variants = $stmt_variants->get_result();
            
            $variants = array();
            while($v_row = $result_variants->fetch_assoc()) {
                // Chuyển đổi kiểu dữ liệu - BỎ SỐ 0 Ở ĐẦU
                $v_row['id'] = (int)$v_row['id'];
                $v_row['product_id'] = (int)$v_row['product_id'];
                $v_row['price'] = (float)$v_row['price'];
                $v_row['original_price'] = $v_row['original_price'] ? (float)$v_row['original_price'] : null;
                $v_row['stock_quantity'] = (int)ltrim($v_row['stock_quantity'], '0') ?: 0; // BỎ SỐ 0 ĐẦU
                
                $variants[] = $v_row;
            }
            $stmt_variants->close();
            
            $row['variants'] = $variants;

            // === LẤY CÁC ẢNH ===
            $sql_images = "
                SELECT image_url 
                FROM ProductImages 
                WHERE product_id = ?
                ORDER BY id ASC
            ";
            
            $stmt_images = $conn->prepare($sql_images);
            $stmt_images->bind_param("i", $product_id);
            $stmt_images->execute();
            $result_images = $stmt_images->get_result();
            
            $images = array();
            while($i_row = $result_images->fetch_assoc()) {
                $images[] = $i_row['image_url'];
            }
            $stmt_images->close();
            
            $row['images'] = $images;

            // === LẤY RATING VÀ REVIEW COUNT (TỪ BẢNG REVIEWS) ===
            $sql_reviews = "
                SELECT 
                    COUNT(*) as review_count,
                    COALESCE(AVG(rating), 0) as avg_rating
                FROM Reviews 
                WHERE product_id = ?
            ";
            
            $stmt_reviews = $conn->prepare($sql_reviews);
            $stmt_reviews->bind_param("i", $product_id);
            $stmt_reviews->execute();
            $result_reviews = $stmt_reviews->get_result();
            $review_data = $result_reviews->fetch_assoc();
            $stmt_reviews->close();
            
            $row['rating'] = round((float)$review_data['avg_rating'], 1);
            $row['review_count'] = (int)$review_data['review_count'];

            // === LẤY CÁC REVIEWS (NẾU CẦN) ===
            $sql_reviews_list = "
                SELECT 
                    r.rating,
                    r.comment,
                    r.created_at,
                    CONCAT(u.first_name, ' ', u.last_name) AS user_name
                FROM Reviews r
                LEFT JOIN Users u ON r.user_id = u.id
                WHERE r.product_id = ?
                ORDER BY r.created_at DESC
                LIMIT 10
            ";
            
            $stmt_reviews_list = $conn->prepare($sql_reviews_list);
            $stmt_reviews_list->bind_param("i", $product_id);
            $stmt_reviews_list->execute();
            $result_reviews_list = $stmt_reviews_list->get_result();
            
            $reviews = array();
            while($r_row = $result_reviews_list->fetch_assoc()) {
                $r_row['rating'] = (int)$r_row['rating'];
                $reviews[] = $r_row;
            }
            $stmt_reviews_list->close();
            
            $row['reviews'] = $reviews;

            // Chuyển đổi kiểu dữ liệu
            $row['id'] = $product_id;
            $row['category_id'] = (int)$row['category_id'];

            $products[] = $row;
        }
    }

    http_response_code(200);
    echo json_encode($products);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "message" => "Lỗi server: " . $e->getMessage(),
        "file" => $e->getFile(),
        "line" => $e->getLine()
    ]);
}

$conn->close();
?>