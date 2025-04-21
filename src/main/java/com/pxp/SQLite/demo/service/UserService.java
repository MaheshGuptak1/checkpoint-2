package com.pxp.SQLite.demo.service;

import com.pxp.SQLite.demo.entity.User;
import com.pxp.SQLite.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
            
            // Check if email already exists
            User existingEmail = userRepository.findByEmail(user.getEmail());
            if (existingEmail != null) {
                return "Email already exists";
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
    
    // For admin panel
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public User getUserById(int id) {
        Optional<User> userOptional = userRepository.findById(id);
        return userOptional.orElse(null);
    }
    
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    public String updateUser(User user) {
        try {
            if (!userRepository.existsById(user.getId())) {
                return "User not found";
            }
            userRepository.save(user);
            return "User updated successfully";
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }
    
    public String deleteUser(int id) {
        try {
            if (!userRepository.existsById(id)) {
                return "User not found";
            }
            userRepository.deleteById(id);
            return "User deleted successfully";
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }
} 