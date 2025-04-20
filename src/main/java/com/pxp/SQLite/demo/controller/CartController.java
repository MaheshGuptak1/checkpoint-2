package com.pxp.SQLite.demo.controller;

import com.pxp.SQLite.demo.entity.CartItem;
import com.pxp.SQLite.demo.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CartController {

    @Autowired
    private CartService cartService;

    @RequestMapping(value = "addtocart", method = RequestMethod.POST)
    public String addToCart(@RequestBody CartItem cartItem) {
        return cartService.addToCart(cartItem);
    }

    @RequestMapping(value = "getcartitems/{userId}", method = RequestMethod.GET)
    public List<CartItem> getCartItems(@PathVariable int userId) {
        return cartService.getCartItems(userId);
    }

    @RequestMapping(value = "updatecartitem", method = RequestMethod.PUT)
    public String updateCartItem(@RequestBody CartItem cartItem) {
        return cartService.updateCartItem(cartItem);
    }

    @RequestMapping(value = "removefromcart/{itemId}/{userId}", method = RequestMethod.DELETE)
    public String removeFromCart(@PathVariable int itemId, @PathVariable int userId) {
        return cartService.removeFromCart(itemId, userId);
    }

    @RequestMapping(value = "checkout/{userId}", method = RequestMethod.POST)
    public String checkout(@PathVariable int userId) {
        return cartService.checkout(userId);
    }
} 