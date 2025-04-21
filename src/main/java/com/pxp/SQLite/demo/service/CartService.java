package com.pxp.SQLite.demo.service;

import com.pxp.SQLite.demo.entity.CartItem;
import com.pxp.SQLite.demo.entity.Product;
import com.pxp.SQLite.demo.entity.Order;
import com.pxp.SQLite.demo.repository.CartItemRepository;
import com.pxp.SQLite.demo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class CartService {
    
    private static final Logger logger = LoggerFactory.getLogger(CartService.class);

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private OrderService orderService;

    public String addToCart(CartItem cartItem) {
        try {
            logger.info("Adding to cart: userId={}, productId={}, quantity={}", 
                cartItem.getUserId(), cartItem.getProductId(), cartItem.getQuantity());
            
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
            
            // Check if product already in cart for this specific user
            CartItem existingItem = cartItemRepository.findByUserIdAndProductIdAndCheckedOut(
                cartItem.getUserId(), cartItem.getProductId(), false);
                
            if (existingItem != null) {
                logger.info("Found existing cart item: id={}, userId={}, productId={}, currentQuantity={}", 
                    existingItem.getId(), existingItem.getUserId(), existingItem.getProductId(), existingItem.getQuantity());
                
                // Update quantity instead of creating new item
                existingItem.setQuantity(existingItem.getQuantity() + cartItem.getQuantity());
                cartItemRepository.save(existingItem);
                
                logger.info("Updated cart item quantity to: {}", existingItem.getQuantity());
            } else {
                // Set product details
                cartItem.setProductName(product.getName());
                cartItem.setProductPrice(product.getPrice());
                cartItem.setCheckedOut(false);
                cartItemRepository.save(cartItem);
                
                logger.info("Created new cart item: id={}, userId={}, productId={}, quantity={}", 
                    cartItem.getId(), cartItem.getUserId(), cartItem.getProductId(), cartItem.getQuantity());
            }
            
            return "Item added to cart successfully";
        } catch (Exception e) {
            logger.error("Error adding to cart: {}", e.getMessage(), e);
            return "Error: " + e.getMessage();
        }
    }

    public List<CartItem> getCartItems(int userId) {
        logger.info("Getting cart items for userId: {}", userId);
        List<CartItem> items = cartItemRepository.findByUserIdAndCheckedOut(userId, false);
        logger.info("Found {} items in cart for userId: {}", items.size(), userId);
        return items;
    }

    public String updateCartItem(CartItem cartItem) {
        try {
            logger.info("Updating cart item: id={}, userId={}, quantity={}", 
                cartItem.getId(), cartItem.getUserId(), cartItem.getQuantity());
                
            Optional<CartItem> itemOptional = cartItemRepository.findById(cartItem.getId());
            if (!itemOptional.isPresent()) {
                logger.warn("Cart item not found: id={}", cartItem.getId());
                return "Cart item not found";
            }
            
            CartItem existingItem = itemOptional.get();
            
            // Make sure we're updating the right user's cart
            if (existingItem.getUserId() != cartItem.getUserId()) {
                logger.warn("Unauthorized update attempt: itemUserId={}, requestUserId={}", 
                    existingItem.getUserId(), cartItem.getUserId());
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
            
            logger.info("Cart item updated successfully: id={}, newQuantity={}", 
                existingItem.getId(), existingItem.getQuantity());
                
            return "Cart item updated successfully";
        } catch (Exception e) {
            logger.error("Error updating cart item: {}", e.getMessage(), e);
            return "Error: " + e.getMessage();
        }
    }
    
    public String removeFromCart(int itemId, int userId) {
        try {
            logger.info("Removing item from cart: itemId={}, userId={}", itemId, userId);
            
            Optional<CartItem> itemOptional = cartItemRepository.findById(itemId);
            if (!itemOptional.isPresent()) {
                logger.warn("Cart item not found: id={}", itemId);
                return "Cart item not found";
            }
            
            CartItem existingItem = itemOptional.get();
            
            // Make sure we're removing from the right user's cart
            if (existingItem.getUserId() != userId) {
                logger.warn("Unauthorized removal attempt: itemUserId={}, requestUserId={}", 
                    existingItem.getUserId(), userId);
                return "Unauthorized to remove this cart item";
            }
            
            cartItemRepository.deleteById(itemId);
            logger.info("Item removed successfully: id={}, userId={}, productId={}", 
                itemId, userId, existingItem.getProductId());
            return "Item removed from cart successfully";
        } catch (Exception e) {
            logger.error("Error removing from cart: {}", e.getMessage(), e);
            return "Error: " + e.getMessage();
        }
    }
    
    public String checkout(int userId) {
        try {
            logger.info("Processing checkout for userId: {}", userId);
            
            List<CartItem> cartItems = cartItemRepository.findByUserIdAndCheckedOut(userId, false);
            
            if (cartItems.isEmpty()) {
                logger.warn("Checkout attempted with empty cart: userId={}", userId);
                return "Cart is empty";
            }
            
            logger.info("Found {} items to checkout for userId: {}", cartItems.size(), userId);
            
            // Check stock and update product quantities
            for (CartItem item : cartItems) {
                Optional<Product> productOptional = productRepository.findById(item.getProductId());
                if (!productOptional.isPresent()) {
                    logger.warn("Product not found during checkout: productId={}, productName={}", 
                        item.getProductId(), item.getProductName());
                    return "Product " + item.getProductName() + " is no longer available";
                }
                
                Product product = productOptional.get();
                
                if (product.getStockQuantity() < item.getQuantity()) {
                    logger.warn("Insufficient stock during checkout: productId={}, requested={}, available={}", 
                        product.getId(), item.getQuantity(), product.getStockQuantity());
                    return "Not enough stock available for " + product.getName();
                }
                
                // Reduce stock
                int oldStock = product.getStockQuantity();
                product.setStockQuantity(oldStock - item.getQuantity());
                productRepository.save(product);
                logger.info("Updated product stock: productId={}, oldStock={}, newStock={}", 
                    product.getId(), oldStock, product.getStockQuantity());
                
                // Mark item as checked out
                item.setCheckedOut(true);
                cartItemRepository.save(item);
                logger.info("Marked cart item as checked out: id={}", item.getId());
            }
            
            // Create order from checked out items
            Order order = orderService.createOrderFromCart(userId);
            if (order == null) {
                logger.error("Failed to create order for userId: {}", userId);
                return "Error creating order";
            }
            
            logger.info("Checkout completed successfully: userId={}, orderId={}, invoiceNumber={}", 
                userId, order.getId(), order.getInvoiceNumber());
            return "Checkout completed successfully. Order #" + order.getId() + " created with invoice number " + order.getInvoiceNumber();
        } catch (Exception e) {
            logger.error("Error during checkout: {}", e.getMessage(), e);
            return "Error: " + e.getMessage();
        }
    }
} 