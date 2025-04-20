package com.pxp.SQLite.demo.service;

import com.pxp.SQLite.demo.entity.OrderItem;
import com.pxp.SQLite.demo.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderItemService {

    @Autowired
    private OrderItemRepository orderItemRepository;

    // Get all order items for an order
    public List<OrderItem> getOrderItemsByOrderId(int orderId) {
        return orderItemRepository.findByOrderId(orderId);
    }

    // Get all order items
    public List<OrderItem> getAllOrderItems() {
        return orderItemRepository.findAll();
    }
} 