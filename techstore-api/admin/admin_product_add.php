<?php
// htdocs/techstore-api/admin/admin_product_add.php

// === HEADER (Quan trọng cho CORS) ===
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type");

// Xử lý request OPTIONS
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
if ($conn->connect_error) { 
    http_response_code(500);
    echo json_encode(["message" => "Lỗi kết nối CSDL."]);
    exit(); 
}
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

// Thư mục lưu ảnh
$upload_dir = '../uploads/';
$base_url = 'http://localhost/techstore-api/uploads/';

try {
    // 1. KIỂM TRA DỮ LIỆU BẮT BUỘC
    if (
        !isset($_POST['name']) || empty($_POST['name']) ||
        !isset($_POST['category']) || empty($_POST['category']) ||
        !isset($_POST['brand']) || empty($_POST['brand']) ||
        !isset($_POST['variants']) || empty($_POST['variants'])
    ) {
        http_response_code(400);
        echo json_encode(["message" => "Thiếu thông tin bắt buộc (Tên, Danh mục, Thương hiệu, Phiên bản)."]);
        exit();
    }
    
    // 2. LẤY DỮ LIỆU SẢN PHẨM
    $name = $_POST['name'];
    $description = $_POST['description'] ?? '';
    $brand = $_POST['brand'];
    $model = $_POST['model'] ?? null;
    $category_slug = $_POST['category'];
    $status = $_POST['status'] ?? 'active';
    
    // 3. TẠO FEATURES JSON
    $specs_array = [];
    if (!empty($_POST['processor'])) $specs_array[] = "Bộ xử lý: " . $_POST['processor'];
    if (!empty($_POST['ram'])) $specs_array[] = "RAM: " . $_POST['ram'];
    if (!empty($_POST['storage'])) $specs_array[] = "Bộ nhớ: " . $_POST['storage'];
    if (!empty($_POST['screen'])) $specs_array[] = "Màn hình: " . $_POST['screen'];
    $features_json = json_encode($specs_array, JSON_UNESCAPED_UNICODE);

    // 4. PARSE VARIANTS JSON
    $variants_data = json_decode($_POST['variants'], true);
    if (!$variants_data || !is_array($variants_data) || count($variants_data) === 0) {
        http_response_code(400);
        echo json_encode(["message" => "Dữ liệu phiên bản không hợp lệ."]);
        exit();
    }

    // 5. VALIDATE VARIANTS
    foreach ($variants_data as $variant) {
        if (
            !isset($variant['color_name']) || empty($variant['color_name']) ||
            !isset($variant['size']) || empty($variant['size']) ||
            !isset($variant['price']) || $variant['price'] <= 0 ||
            !isset($variant['stock_quantity']) || $variant['stock_quantity'] < 0
        ) {
            http_response_code(400);
            echo json_encode(["message" => "Mỗi phiên bản phải có đầy đủ: Màu sắc, Dung lượng, Giá bán > 0, Tồn kho >= 0."]);
            exit();
        }
    }

    // 6. TÌM CATEGORY_ID
    $category_mapping = [
        'phone' => 'Điện thoại', 
        'laptop' => 'Laptop', 
        'tablet' => 'Máy tính bảng', 
        'accessory' => 'Phụ kiện'
    ];
    $category_name_full = $category_mapping[$category_slug] ?? null;
    $category_id = null;
    
    if ($category_name_full) {
        $stmt_get_cat_id = $conn->prepare("SELECT id FROM Categories WHERE name = ?");
        $stmt_get_cat_id->bind_param("s", $category_name_full);
        $stmt_get_cat_id->execute();
        $result_cat = $stmt_get_cat_id->get_result();
        if ($result_cat->num_rows > 0) { 
            $category_id = $result_cat->fetch_assoc()['id']; 
        }
        $stmt_get_cat_id->close();
    }
    
    if (!$category_id) { 
        throw new Exception("Danh mục '$category_slug' không hợp lệ."); 
    }

    // 7. XỬ LÝ FILE ẢNH
    $uploaded_image_urls = [];
    if (isset($_FILES['images'])) {
        $total_files = count($_FILES['images']['name']);
        for ($i = 0; $i < $total_files; $i++) {
            if ($_FILES['images']['error'][$i] === UPLOAD_ERR_OK) {
                $file_tmp_name = $_FILES['images']['tmp_name'][$i];
                $file_name = $_FILES['images']['name'][$i];
                $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
                
                // Kiểm tra định dạng file
                $allowed_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
                if (!in_array($file_ext, $allowed_extensions)) {
                    continue; // Bỏ qua file không hợp lệ
                }
                
                // Tạo tên file mới
                $new_file_name = uniqid('prod_', true) . '.' . $file_ext;
                $destination = $upload_dir . $new_file_name;

                if (move_uploaded_file($file_tmp_name, $destination)) {
                    $uploaded_image_urls[] = $base_url . $new_file_name;
                }
            }
        }
    }

    // 8. BẮT ĐẦU GIAO DỊCH
    $conn->begin_transaction();

    // 9. INSERT VÀO BẢNG PRODUCTS
    $base_image = $uploaded_image_urls[0] ?? null;
    
    $sql_product = "INSERT INTO Products (category_id, name, description, brand, model, features, base_image, status) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt_product = $conn->prepare($sql_product);
    $stmt_product->bind_param("isssssss", $category_id, $name, $description, $brand, $model, $features_json, $base_image, $status);
    $stmt_product->execute();
    $product_id = $conn->insert_id;
    $stmt_product->close();

    // 10. INSERT NHIỀU VARIANTS VÀO BẢNG PRODUCTVARIANTS
    $sql_variant = "INSERT INTO ProductVariants (product_id, size, color_name, color_hex, price, original_price, stock_quantity, sku) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt_variant = $conn->prepare($sql_variant);
    
    foreach ($variants_data as $variant) {
        $size = $variant['size'];
        $color_name = $variant['color_name'];
        $color_hex = $variant['color_hex'] ?? null;
        $price = floatval($variant['price']);
        $original_price = isset($variant['original_price']) && $variant['original_price'] > 0 
                         ? floatval($variant['original_price']) 
                         : null;
        $stock_quantity = intval($variant['stock_quantity']);
        $sku = !empty($variant['sku']) ? $variant['sku'] : null;
        
        $stmt_variant->bind_param(
            "isssddis", 
            $product_id, 
            $size, 
            $color_name, 
            $color_hex, 
            $price, 
            $original_price, 
            $stock_quantity, 
            $sku
        );
        $stmt_variant->execute();
    }
    $stmt_variant->close();
    
    // 11. INSERT VÀO BẢNG PRODUCTIMAGES
    if (count($uploaded_image_urls) > 0) {
        $sql_images = "INSERT INTO ProductImages (product_id, image_url) VALUES (?, ?)";
        $stmt_images = $conn->prepare($sql_images);
        
        foreach ($uploaded_image_urls as $image_url) {
            $stmt_images->bind_param("is", $product_id, $image_url);
            $stmt_images->execute();
        }
        $stmt_images->close();
    }

    // 12. HOÀN TẤT GIAO DỊCH
    $conn->commit();

    http_response_code(201); 
    echo json_encode([
        "message" => "Đã thêm sản phẩm thành công với " . count($variants_data) . " phiên bản!", 
        "product_id" => $product_id
    ]);

} catch (Exception $e) {
    $conn->rollback();
    http_response_code(500);
    echo json_encode(["message" => "Lỗi máy chủ: " . $e->getMessage()]);
}

$conn->close();
?>