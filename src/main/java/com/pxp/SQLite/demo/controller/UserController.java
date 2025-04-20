package com.pxp.SQLite.demo.controller;

import com.pxp.SQLite.demo.entity.User;
import com.pxp.SQLite.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @RequestMapping(value = "register", method = RequestMethod.POST)
    public String register(@RequestBody User user) {
        return userService.register(user);
    }

    @RequestMapping(value = "login", method = RequestMethod.POST)
    public User login(@RequestBody User user) {
        return userService.login(user);
    }
} 