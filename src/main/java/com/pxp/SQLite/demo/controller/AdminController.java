package com.pxp.SQLite.demo.controller;

import com.pxp.SQLite.demo.entity.Admin;
import com.pxp.SQLite.demo.entity.Order;
import com.pxp.SQLite.demo.entity.OrderItem;
import com.pxp.SQLite.demo.entity.User;
import com.pxp.SQLite.demo.entity.Product;
import com.pxp.SQLite.demo.service.AdminService;
import com.pxp.SQLite.demo.service.OrderItemService;
import com.pxp.SQLite.demo.service.OrderService;
import com.pxp.SQLite.demo.service.UserService;
import com.pxp.SQLite.demo.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private UserService userService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderItemService orderItemService;
    
    @Autowired
    private ProductService productService;

    // Dashboard summary endpoint
    @GetMapping("/dashboard/summary")
    public ResponseEntity<Map<String, Object>> getDashboardSummary() {
        try {
            List<User> users = userService.getAllUsers();
            List<Product> products = productService.getAllProducts();
            List<Order> orders = orderService.getAllOrders();
            
            // Calculate total revenue
            double totalRevenue = 0;
            for (Order order : orders) {
                totalRevenue += order.getTotalAmount();
            }
            
            Map<String, Object> summary = new HashMap<>();
            summary.put("totalCustomers", users.size());
            summary.put("totalProducts", products.size());
            summary.put("totalOrders", orders.size());
            summary.put("totalRevenue", totalRevenue);
            
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to retrieve dashboard summary: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Admin login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Admin admin) {
        try {
            Admin foundAdmin = adminService.login(admin);
            
            if (foundAdmin != null) {
                // Successful login
                return ResponseEntity.ok(foundAdmin);
            } else {
                // Invalid credentials
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid username or password"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An error occurred during login: " + e.getMessage()));
        }
    }

    // Get all users
    @RequestMapping(value = "/users", method = RequestMethod.GET)
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Get single user by ID
    @RequestMapping(value = "/users/{userId}", method = RequestMethod.GET)
    public ResponseEntity<?> getUserById(@PathVariable int userId) {
        User user = userService.getUserById(userId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    // Get all orders
    @RequestMapping(value = "/orders", method = RequestMethod.GET)
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    // Get a single order with its items
    @RequestMapping(value = "/orders/{orderId}", method = RequestMethod.GET)
    public ResponseEntity<?> getOrderById(@PathVariable int orderId) {
        Order order = orderService.getOrderById(orderId);
        if (order == null) {
            return ResponseEntity.notFound().build();
        }
        
        List<OrderItem> orderItems = orderItemService.getOrderItemsByOrderId(orderId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", order.getId());
        response.put("userId", order.getUserId());
        response.put("userName", order.getUserName());
        response.put("userEmail", order.getUserEmail());
        response.put("totalAmount", order.getTotalAmount());
        response.put("orderDate", order.getOrderDate());
        response.put("expectedDeliveryDate", order.getExpectedDeliveryDate());
        response.put("status", order.getStatus());
        response.put("invoiceNumber", order.getInvoiceNumber());
        response.put("orderItems", orderItems);
        
        return ResponseEntity.ok(response);
    }

    // Get orders by user ID
    @RequestMapping(value = "/orders/user/{userId}", method = RequestMethod.GET)
    public List<Order> getOrdersByUserId(@PathVariable int userId) {
        return orderService.getOrdersByUserId(userId);
    }

    // Get orders by status
    @RequestMapping(value = "/orders/status/{status}", method = RequestMethod.GET)
    public List<Order> getOrdersByStatus(@PathVariable String status) {
        return orderService.getOrdersByStatus(status);
    }

    // Get order items for an order
    @RequestMapping(value = "/orderitems/{orderId}", method = RequestMethod.GET)
    public List<OrderItem> getOrderItemsByOrderId(@PathVariable int orderId) {
        return orderItemService.getOrderItemsByOrderId(orderId);
    }

    // Update order status
    @RequestMapping(value = "/orders/{orderId}/status", method = RequestMethod.PUT)
    public String updateOrderStatus(@PathVariable int orderId, @RequestBody String status) {
        return orderService.updateOrderStatus(orderId, status);
    }

    // Update expected delivery date
    @RequestMapping(value = "/orders/{orderId}/delivery-date", method = RequestMethod.PUT)
    public String updateExpectedDeliveryDate(
            @PathVariable int orderId, 
            @RequestBody @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate expectedDeliveryDate) {
        return orderService.updateExpectedDeliveryDate(orderId, expectedDeliveryDate);
    }
} 