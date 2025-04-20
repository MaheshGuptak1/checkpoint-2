package com.pxp.SQLite.demo.service;

import com.pxp.SQLite.demo.entity.Product;
import com.pxp.SQLite.demo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public String createProduct(Product product) {
        try {
            productRepository.save(product);
            return "Product created successfully";
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(int id) {
        Optional<Product> productOptional = productRepository.findById(id);
        return productOptional.orElse(null);
    }

    public String updateProduct(Product product) {
        try {
            if (!productRepository.existsById(product.getId())) {
                return "Product not found";
            }
            productRepository.save(product);
            return "Product updated successfully";
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    public String deleteProduct(int id) {
        try {
            if (!productRepository.existsById(id)) {
                return "Product not found";
            }
            productRepository.deleteById(id);
            return "Product deleted successfully";
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }
} 