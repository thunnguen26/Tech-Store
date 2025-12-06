<?php
// htdocs/techstore-api/products.php

header("Access-Control-Allow-Origin: http://localhost:3000");
// Báo cho trình duyệt biết đây là dữ liệu JSON
header("Content-Type: application/json; charset=UTF-8");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "techstore";

$conn = new mysqli($servername, $username, $password, $dbname);

$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

try {
    // 1. Lấy tất cả sản phẩm gốc (Products) và tên danh mục (Categories)
    $sql_products = "
        SELECT 
            p.id, 
            p.name, 
            p.description, 
            p.brand,
            p.features, 
            p.base_image,
            c.name AS category_name
        FROM Products p
        LEFT JOIN Categories c ON p.category_id = c.id
        WHERE p.status = 'active'
    ";
    $result_products = $conn->query($sql_products);

    $products_list = array();

    if ($result_products->num_rows > 0) {
        //  Lặp qua từng sản phẩm gốc
        while($product_row = $result_products->fetch_assoc()) {
            $product_id = $product_row['id'];
            
            // Lấy tất cả Biến thể (Variants) của sản phẩm này
            $sql_variants = "
                SELECT * FROM ProductVariants 
                WHERE product_id = $product_id
            ";
            $result_variants = $conn->query($sql_variants);
            $variants = array();
            if ($result_variants->num_rows > 0) {
                while($variant_row = $result_variants->fetch_assoc()) {
                    // Chuyển giá sang kiểu số
                    $variant_row['price'] = (float)$variant_row['price'];
                    $variant_row['original_price'] = (float)$variant_row['original_price'];
                    $variants[] = $variant_row;
                }
            }
            
            // Lấy tất cả Ảnh (Images) của sản phẩm này
            $sql_images = "
                SELECT image_url FROM ProductImages 
                WHERE product_id = $product_id
            ";
            $result_images = $conn->query($sql_images);
            $images = array();
            if ($result_images->num_rows > 0) {
                while($image_row = $result_images->fetch_assoc()) {
                    $images[] = $image_row['image_url'];
                }
            }

            // Lấy Đánh giá (Reviews) của sản phẩm này
            $sql_reviews = "
                SELECT AVG(rating) AS average_rating, COUNT(id) AS review_count 
                FROM Reviews 
                WHERE product_id = $product_id
            ";
            $result_reviews = $conn->query($sql_reviews);
            $review_data = $result_reviews->fetch_assoc();

            // Gom tất cả dữ liệu lại
            $product_data = $product_row;
            $product_data['variants'] = $variants;
            $product_data['images'] = $images;
            $product_data['rating'] = (float)$review_data['average_rating'] ?? 0;
            $product_data['review_count'] = (int)$review_data['review_count'] ?? 0;
            
            // Thêm vào danh sách tổng
            $products_list[] = $product_data;
        }
    }
    
    // Trả về mảng JSON chứa tất cả sản phẩm
    echo json_encode($products_list);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("message" => "Lỗi máy chủ: " . $e->getMessage()));
}

$conn->close();
?>