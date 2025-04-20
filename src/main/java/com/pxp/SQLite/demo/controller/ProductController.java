package com.pxp.SQLite.demo.controller;

import com.pxp.SQLite.demo.entity.Product;
import com.pxp.SQLite.demo.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ProductController {

    @Autowired
    private ProductService productService;

    @RequestMapping(value = "createproduct", method = RequestMethod.POST)
    public String createProduct(@RequestBody Product product) {
        return productService.createProduct(product);
    }

    @RequestMapping(value = "getallproducts", method = RequestMethod.GET)
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @RequestMapping(value = "getproduct/{id}", method = RequestMethod.GET)
    public Product getProductById(@PathVariable int id) {
        return productService.getProductById(id);
    }

    @RequestMapping(value = "updateproduct", method = RequestMethod.PUT)
    public String updateProduct(@RequestBody Product product) {
        return productService.updateProduct(product);
    }

    @RequestMapping(value = "deleteproduct/{id}", method = RequestMethod.DELETE)
    public String deleteProduct(@PathVariable int id) {
        return productService.deleteProduct(id);
    }
} 