package com.pxp.SQLite.demo.controller;

import com.pxp.SQLite.demo.entity.User;
import com.pxp.SQLite.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @RequestMapping(value = "register", method = RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> register(@RequestBody User user) {
        String result = userService.register(user);
        Map<String, Object> response = new HashMap<>();
        
        if (result.equals("User registered successfully")) {
            response.put("message", "User registered successfully");
            response.put("user", user);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } else if (result.equals("Email already exists")) {
            response.put("error", "Email already exists");
            return new ResponseEntity<>(response, HttpStatus.CONFLICT);
        } else if (result.equals("Username already exists")) {
            response.put("error", "Username already exists");
            return new ResponseEntity<>(response, HttpStatus.CONFLICT);
        } else {
            response.put("error", "Registration failed: " + result);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "login", method = RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> login(@RequestBody User user) {
        User loggedInUser = userService.login(user);
        Map<String, Object> response = new HashMap<>();
        
        if (loggedInUser != null) {
            response.put("user", loggedInUser);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            response.put("error", "Invalid username or password");
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }
    }
} 