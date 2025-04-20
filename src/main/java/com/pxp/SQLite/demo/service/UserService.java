package com.pxp.SQLite.demo.service;

import com.pxp.SQLite.demo.entity.User;
import com.pxp.SQLite.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public String register(User user) {
        try {
            // Check if username already exists
            User existingUser = userRepository.findByUsername(user.getUsername());
            if (existingUser != null) {
                return "Username already exists";
            }
            userRepository.save(user);
            return "User registered successfully";
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    public User login(User user) {
        return userRepository.findByUsernameAndPassword(user.getUsername(), user.getPassword());
    }
} 