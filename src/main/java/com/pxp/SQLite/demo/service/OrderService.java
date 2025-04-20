package com.pxp.SQLite.demo.service;

import com.pxp.SQLite.demo.entity.CartItem;
import com.pxp.SQLite.demo.entity.Order;
import com.pxp.SQLite.demo.entity.OrderItem;
import com.pxp.SQLite.demo.entity.User;
import com.pxp.SQLite.demo.repository.CartItemRepository;
import com.pxp.SQLite.demo.repository.OrderItemRepository;
import com.pxp.SQLite.demo.repository.OrderRepository;
import com.pxp.SQLite.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    // Create an order from checked out cart items
    public Order createOrderFromCart(int userId) {
        // Get the user
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            return null;
        }
        User user = userOptional.get();

        // Get checked out cart items
        List<CartItem> checkedOutItems = cartItemRepository.findByUserIdAndCheckedOut(userId, true);
        if (checkedOutItems.isEmpty()) {
            return null;
        }

        // Calculate total amount
        double totalAmount = 0;
        for (CartItem item : checkedOutItems) {
            totalAmount += item.getProductPrice() * item.getQuantity();
        }

        // Create order
        Order order = new Order();
        order.setUserId(userId);
        order.setUserName(user.getUsername());
        order.setUserEmail(user.getEmail());
        order.setTotalAmount(totalAmount);
        order.setOrderDate(LocalDate.now());
        order.setExpectedDeliveryDate(LocalDate.now().plusDays(7)); // Default delivery in 7 days
        order.setStatus("Ordered");
        order.setInvoiceNumber("INV-" + UUID.randomUUID().toString().substring(0, 8));

        Order savedOrder = orderRepository.save(order);

        // Create order items
        for (CartItem cartItem : checkedOutItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrderId(savedOrder.getId());
            orderItem.setProductId(cartItem.getProductId());
            orderItem.setProductName(cartItem.getProductName());
            orderItem.setProductPrice(cartItem.getProductPrice());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setSubTotal(cartItem.getProductPrice() * cartItem.getQuantity());
            orderItemRepository.save(orderItem);
        }

        return savedOrder;
    }

    // Get all orders
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // Get order by id
    public Order getOrderById(int id) {
        Optional<Order> orderOptional = orderRepository.findById(id);
        return orderOptional.orElse(null);
    }

    // Get orders by user id
    public List<Order> getOrdersByUserId(int userId) {
        return orderRepository.findByUserId(userId);
    }

    // Get orders by status
    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status);
    }

    // Update order status
    public String updateOrderStatus(int orderId, String status) {
        try {
            Optional<Order> orderOptional = orderRepository.findById(orderId);
            if (!orderOptional.isPresent()) {
                return "Order not found";
            }

            Order order = orderOptional.get();
            order.setStatus(status);
            orderRepository.save(order);
            
            return "Order status updated successfully";
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    // Update expected delivery date
    public String updateExpectedDeliveryDate(int orderId, LocalDate expectedDeliveryDate) {
        try {
            Optional<Order> orderOptional = orderRepository.findById(orderId);
            if (!orderOptional.isPresent()) {
                return "Order not found";
            }

            Order order = orderOptional.get();
            order.setExpectedDeliveryDate(expectedDeliveryDate);
            orderRepository.save(order);
            
            return "Expected delivery date updated successfully";
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }
} 