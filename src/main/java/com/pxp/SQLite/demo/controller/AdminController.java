package com.pxp.SQLite.demo.controller;

import com.pxp.SQLite.demo.entity.Admin;
import com.pxp.SQLite.demo.entity.Order;
import com.pxp.SQLite.demo.entity.OrderItem;
import com.pxp.SQLite.demo.entity.User;
import com.pxp.SQLite.demo.service.AdminService;
import com.pxp.SQLite.demo.service.OrderItemService;
import com.pxp.SQLite.demo.service.OrderService;
import com.pxp.SQLite.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

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

    // Admin login
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public Admin login(@RequestBody Admin admin) {
        return adminService.login(admin);
    }

    // Get all users
    @RequestMapping(value = "/users", method = RequestMethod.GET)
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Get all orders
    @RequestMapping(value = "/orders", method = RequestMethod.GET)
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
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