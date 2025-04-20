package com.pxp.SQLite.demo.repository;

import com.pxp.SQLite.demo.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    List<CartItem> findByUserIdAndCheckedOut(int userId, boolean checkedOut);
    CartItem findByUserIdAndProductIdAndCheckedOut(int userId, int productId, boolean checkedOut);
} 