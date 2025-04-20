package com.pxp.SQLite.demo.repository;

import com.pxp.SQLite.demo.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Integer> {
    Admin findByUsername(String username);
    Admin findByUsernameAndPassword(String username, String password);
} 