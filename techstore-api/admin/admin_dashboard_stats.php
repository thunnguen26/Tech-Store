<?php
// htdocs/techstore-api/admin/admin_dashboard_stats.php

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
if ($conn->connect_error) { 
    http_response_code(500);
    echo json_encode(["message" => "Lỗi kết nối CSDL."]);
    exit(); 
}
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

// === XỬ LÝ LOGIC ===
try {
    $response = [
        'kpi' => [],
        'revenueChart' => [],
        'ordersChart' => [],
        'topProducts' => []
    ];

    // === 1. LẤY DỮ LIỆU KPI CARDS ===
    // Tổng doanh thu (chỉ tính đơn đã giao 'completed')
    $result_revenue = $conn->query("SELECT SUM(total_amount) as totalRevenue FROM Orders WHERE status = 'completed'");
    $totalRevenue = $result_revenue->fetch_assoc()['totalRevenue'] ?? 0;
    
    // Tổng đơn hàng (tất cả trạng thái)
    $result_orders = $conn->query("SELECT COUNT(id) as totalOrders FROM Orders");
    $totalOrders = $result_orders->fetch_assoc()['totalOrders'] ?? 0;
    
    // Tổng sản phẩm (chỉ đang bán 'active')
    $result_products = $conn->query("SELECT COUNT(id) as totalProducts FROM Products WHERE status = 'active'");
    $totalProducts = $result_products->fetch_assoc()['totalProducts'] ?? 0;
    
    // Tổng khách hàng
    $result_customers = $conn->query("SELECT COUNT(id) as totalCustomers FROM Users");
    $totalCustomers = $result_customers->fetch_assoc()['totalCustomers'] ?? 0;

    $response['kpi'] = [
        'totalRevenue' => (float)$totalRevenue,
        'revenueChange' => 14.5, // Tạm thời
        'totalOrders' => (int)$totalOrders,
        'ordersChange' => 8.2, // Tạm thời
        'totalProducts' => (int)$totalProducts,
        'totalCustomers' => (int)$totalCustomers,
        'customerChange' => 15.3 // Tạm thời
    ];

    // === 2. LẤY DỮ LIỆU BIỂU ĐỒ DOANH THU (12 THÁNG) ===
    $sql_revenue_chart = "
        SELECT 
            DATE_FORMAT(created_at, '%Y-%m') as month, 
            SUM(total_amount) as revenue
        FROM Orders
        WHERE status = 'completed' AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY month ASC
    ";
    $result_revenue_chart = $conn->query($sql_revenue_chart);
    while($row = $result_revenue_chart->fetch_assoc()) {
        $row['revenue'] = (float)$row['revenue'];
        $response['revenueChart'][] = $row;
    }

    // === 3. LẤY DỮ LIỆU BIỂU ĐỒ ĐƠN HÀNG (7 NGÀY) ===
    $sql_orders_chart = "
        SELECT 
            DATE_FORMAT(created_at, '%Y-%m-%d') as day, 
            COUNT(id) as orders
        FROM Orders
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')
        ORDER BY day ASC
    ";
    $result_orders_chart = $conn->query($sql_orders_chart);
    while($row = $result_orders_chart->fetch_assoc()) {
        $row['orders'] = (int)$row['orders'];
        $response['ordersChart'][] = $row;
    }

    // === 4. LẤY TOP 5 SẢN PHẨM BÁN CHẠY ===
    $sql_top_products = "
        SELECT 
            p.name, 
            SUM(oi.quantity) as sold, 
            SUM(oi.quantity * oi.price_at_purchase) as revenue
        FROM Products p
        JOIN ProductVariants pv ON p.id = pv.product_id
        JOIN OrderItems oi ON pv.id = oi.variant_id
        JOIN Orders o ON oi.order_id = o.id
        WHERE o.status = 'completed'
        GROUP BY p.id
        ORDER BY revenue DESC
        LIMIT 5
    ";
    $result_top_products = $conn->query($sql_top_products);
    while($row = $result_top_products->fetch_assoc()) {
        $row['sold'] = (int)$row['sold'];
        $row['revenue'] = (float)$row['revenue'];
        $response['topProducts'][] = $row;
    }
    
    // Trả về
    http_response_code(200);
    echo json_encode($response);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("message" => "Lỗi máy chủ: " . $e->getMessage()));
}

$conn->close();
?>