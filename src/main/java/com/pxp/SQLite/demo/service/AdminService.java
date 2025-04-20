package com.pxp.SQLite.demo.service;

import com.pxp.SQLite.demo.entity.Admin;
import com.pxp.SQLite.demo.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @PostConstruct
    public void init() {
        // Create default admin if none exists
        if (adminRepository.count() == 0) {
            Admin admin = new Admin();
            admin.setUsername("admin");
            admin.setPassword("admin123");
            admin.setEmail("admin@example.com");
            adminRepository.save(admin);
        }
    }

    public Admin login(Admin admin) {
        return adminRepository.findByUsernameAndPassword(admin.getUsername(), admin.getPassword());
    }

    public Admin getAdminByUsername(String username) {
        return adminRepository.findByUsername(username);
    }

    public String updateAdmin(Admin admin) {
        try {
            if (!adminRepository.existsById(admin.getId())) {
                return "Admin not found";
            }
            adminRepository.save(admin);
            return "Admin updated successfully";
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }
} 