package com.pxp.SQLite.demo.repository;

import com.pxp.SQLite.demo.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByUserId(int userId);
    List<Order> findByStatus(String status);
} 