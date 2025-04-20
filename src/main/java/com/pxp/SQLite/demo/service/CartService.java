package com.pxp.SQLite.demo.service;

import com.pxp.SQLite.demo.entity.CartItem;
import com.pxp.SQLite.demo.entity.Product;
import com.pxp.SQLite.demo.repository.CartItemRepository;
import com.pxp.SQLite.demo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    public String addToCart(CartItem cartItem) {
        try {
            // Check if product exists
            Optional<Product> productOptional = productRepository.findById(cartItem.getProductId());
            if (!productOptional.isPresent()) {
                return "Product not found";
            }
            
            Product product = productOptional.get();
            
            // Check if there's enough stock
            if (product.getStockQuantity() < cartItem.getQuantity()) {
                return "Not enough stock available";
            }
            
            // Check if product already in cart
            CartItem existingItem = cartItemRepository.findByUserIdAndProductIdAndCheckedOut(
                cartItem.getUserId(), cartItem.getProductId(), false);
                
            if (existingItem != null) {
                // Update quantity instead of creating new item
                existingItem.setQuantity(existingItem.getQuantity() + cartItem.getQuantity());
                cartItemRepository.save(existingItem);
            } else {
                // Set product details
                cartItem.setProductName(product.getName());
                cartItem.setProductPrice(product.getPrice());
                cartItem.setCheckedOut(false);
                cartItemRepository.save(cartItem);
            }
            
            return "Item added to cart successfully";
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    public List<CartItem> getCartItems(int userId) {
        return cartItemRepository.findByUserIdAndCheckedOut(userId, false);
    }

    public String updateCartItem(CartItem cartItem) {
        try {
            Optional<CartItem> itemOptional = cartItemRepository.findById(cartItem.getId());
            if (!itemOptional.isPresent()) {
                return "Cart item not found";
            }
            
            CartItem existingItem = itemOptional.get();
            
            // Make sure we're updating the right user's cart
            if (existingItem.getUserId() != cartItem.getUserId()) {
                return "Unauthorized to update this cart item";
            }
            
            // Check if there's enough stock
            Optional<Product> productOptional = productRepository.findById(existingItem.getProductId());
            if (productOptional.isPresent()) {
                Product product = productOptional.get();
                if (product.getStockQuantity() < cartItem.getQuantity()) {
                    return "Not enough stock available";
                }
            }
            
            // Update only the quantity
            existingItem.setQuantity(cartItem.getQuantity());
            cartItemRepository.save(existingItem);
            
            return "Cart item updated successfully";
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }
    
    public String removeFromCart(int itemId, int userId) {
        try {
            Optional<CartItem> itemOptional = cartItemRepository.findById(itemId);
            if (!itemOptional.isPresent()) {
                return "Cart item not found";
            }
            
            CartItem existingItem = itemOptional.get();
            
            // Make sure we're removing from the right user's cart
            if (existingItem.getUserId() != userId) {
                return "Unauthorized to remove this cart item";
            }
            
            cartItemRepository.deleteById(itemId);
            return "Item removed from cart successfully";
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }
    
    public String checkout(int userId) {
        try {
            List<CartItem> cartItems = cartItemRepository.findByUserIdAndCheckedOut(userId, false);
            
            if (cartItems.isEmpty()) {
                return "Cart is empty";
            }
            
            // Check stock and update product quantities
            for (CartItem item : cartItems) {
                Optional<Product> productOptional = productRepository.findById(item.getProductId());
                if (!productOptional.isPresent()) {
                    return "Product " + item.getProductName() + " is no longer available";
                }
                
                Product product = productOptional.get();
                
                if (product.getStockQuantity() < item.getQuantity()) {
                    return "Not enough stock available for " + product.getName();
                }
                
                // Reduce stock
                product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
                productRepository.save(product);
                
                // Mark item as checked out
                item.setCheckedOut(true);
                cartItemRepository.save(item);
            }
            
            return "Checkout completed successfully";
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }
} 