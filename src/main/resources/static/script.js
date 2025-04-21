document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements - Navigation
    const homeLink = document.getElementById('homeLink');
    const productsLink = document.getElementById('productsLink');
    const cartLink = document.getElementById('cartLink');
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const logoutLink = document.getElementById('logoutLink');
    
    // DOM Elements - Pages
    const homePage = document.getElementById('homePage');
    const productsPage = document.getElementById('productsPage');
    const cartPage = document.getElementById('cartPage');
    const loginPage = document.getElementById('loginPage');
    const registerPage = document.getElementById('registerPage');
    const checkoutPage = document.getElementById('checkoutPage');
    
    // DOM Elements - Login & Register
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const goToRegister = document.getElementById('goToRegister');
    const goToLogin = document.getElementById('goToLogin');
    
    // DOM Elements - Cart
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.getElementById('cartCount');
    const emptyCart = document.getElementById('emptyCart');
    const clearCartBtn = document.getElementById('clearCartBtn');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const browseProductsLink = document.getElementById('browseProductsLink');
    
    // DOM Elements - Checkout
    const orderItems = document.getElementById('orderItems');
    const orderTotal = document.getElementById('orderTotal');
    const paymentForm = document.getElementById('paymentForm');
    const backToCartBtn = document.getElementById('backToCartBtn');
    
    // Current user state
    let currentUser = null;
    let cartItemsArray = [];
    
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        updateUIForLoggedInUser();
    }
    
    // Event Listeners - Navigation - Only add if element exists
    if (homeLink) {
        homeLink.addEventListener('click', function(e) {
            e.preventDefault();
            showPage(homePage);
            updateActiveLink(homeLink);
        });
    }
    
    if (productsLink) {
        productsLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (!currentUser) {
                showPage(loginPage);
                updateActiveLink(loginLink);
                return;
            }
            loadProducts();
            showPage(productsPage);
            updateActiveLink(productsLink);
        });
    }
    
    if (cartLink) {
        cartLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (!currentUser) {
                showPage(loginPage);
                updateActiveLink(loginLink);
                return;
            }
            loadCartItems();
            showPage(cartPage);
            updateActiveLink(cartLink);
        });
    }
    
    if (loginLink) {
        loginLink.addEventListener('click', function(e) {
            e.preventDefault();
            showPage(loginPage);
            updateActiveLink(loginLink);
        });
    }
    
    if (registerLink) {
        registerLink.addEventListener('click', function(e) {
            e.preventDefault();
            showPage(registerPage);
            updateActiveLink(registerLink);
        });
    }
    
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // Event Listeners - Forms - Only add if element exists
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            login();
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            register();
        });
    }
    
    if (goToRegister) {
        goToRegister.addEventListener('click', function(e) {
            e.preventDefault();
            showPage(registerPage);
            updateActiveLink(registerLink);
        });
    }
    
    if (goToLogin) {
        goToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            showPage(loginPage);
            updateActiveLink(loginLink);
        });
    }
    
    // Event Listeners - Cart - Only add if element exists
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            prepareCheckout();
            showPage(checkoutPage);
        });
    }
    
    if (browseProductsLink) {
        browseProductsLink.addEventListener('click', function(e) {
            e.preventDefault();
            loadProducts();
            showPage(productsPage);
            updateActiveLink(productsLink);
        });
    }
    
    // Event Listeners - Checkout - Only add if element exists
    if (backToCartBtn) {
        backToCartBtn.addEventListener('click', function() {
            showPage(cartPage);
            updateActiveLink(cartLink);
        });
    }
    
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processPayment();
        });
    }
    
    // Add event listener for Razorpay payment button
    const payWithRazorpay = document.getElementById('payWithRazorpay');
    if (payWithRazorpay) {
        payWithRazorpay.addEventListener('click', function() {
            processPayment();
        });
    }
    
    // Functions - Navigation
    function showPage(page) {
        // Hide all pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(p => p.classList.add('hidden'));
        
        // Show the selected page
        page.classList.remove('hidden');
    }
    
    function updateActiveLink(link) {
        // Remove active class from all links
        const links = document.querySelectorAll('.nav-links a');
        links.forEach(l => l.classList.remove('active'));
        
        // Add active class to the selected link
        link.classList.add('active');
    }
    
    // Functions - Authentication
    function login() {
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        
        if (!username || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        const user = {
            username: username,
            password: password
        };
        
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(response => {
            return response.json().then(data => {
                // Return both the response status and data
                return { status: response.status, data: data };
            });
        })
        .then(result => {
            if (result.status === 200 && result.data.user) {
                // Successful login
                currentUser = result.data.user;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                // Update UI
                updateUIForLoggedInUser();
                
                // Load products
                loadProducts();
                showPage(productsPage);
                updateActiveLink(productsLink);
                
                // Reset form
                loginForm.reset();
            } else {
                // Login failed
                alert(result.data.message || 'Invalid username or password');
            }
        })
        .catch(error => {
            console.error('Error during login:', error);
            alert('Error during login. Please try again.');
        });
    }
    
    function register() {
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        
        if (!username || !email || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        const user = {
            username: username,
            email: email,
            password: password
        };
        
        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(response => {
            return response.json().then(data => {
                // Return both the response status and data
                return { status: response.status, data: data };
            });
        })
        .then(result => {
            if (result.status === 201 && result.data.user) {
                // Successful registration
                alert('Registration successful! Please login.');
                showPage(loginPage);
                document.getElementById('registerForm').reset();
            } else {
                // Registration failed
                alert(result.data.error || result.data.message || 'Registration failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error during registration:', error);
            alert('Error during registration. Please try again.');
        });
    }
    
    function logout() {
        currentUser = null;
        localStorage.removeItem('currentUser');
        
        // Update UI
        updateUIForLoggedOutUser();
        
        // Go to home page
        showPage(homePage);
        updateActiveLink(homeLink);
    }
    
    function updateUIForLoggedInUser() {
        // Update navigation links
        loginLink.classList.add('hidden');
        registerLink.classList.add('hidden');
        logoutLink.classList.remove('hidden');
        
        // Update home page content
        homePage.innerHTML = `
            <h1>Welcome, ${currentUser.username}!</h1>
            <p>Browse our products or check your cart.</p>
            <div class="button-group" style="justify-content: center; margin-top: 20px;">
                <button id="browseProductsBtn">Browse Products</button>
                <button id="viewCartBtn">View Cart</button>
            </div>
        `;
        
        // Add event listeners to the new buttons
        document.getElementById('browseProductsBtn').addEventListener('click', function() {
            loadProducts();
            showPage(productsPage);
            updateActiveLink(productsLink);
        });
        
        document.getElementById('viewCartBtn').addEventListener('click', function() {
            loadCartItems();
            showPage(cartPage);
            updateActiveLink(cartLink);
        });
        
        // Load cart count
        loadCartCount();
    }
    
    function updateUIForLoggedOutUser() {
        // Update navigation links
        loginLink.classList.remove('hidden');
        registerLink.classList.remove('hidden');
        logoutLink.classList.add('hidden');
        
        // Update home page content
        homePage.innerHTML = `
            <h1>Welcome to Our E-Commerce Store</h1>
            <p>Please login or register to start shopping.</p>
        `;
        
        // Reset cart count
        cartCount.textContent = '0';
    }
    
    // Functions - Products
    function loadProducts() {
        if (!currentUser) return;
        
        const productsList = document.getElementById('productsList');
        productsList.innerHTML = '<div class="loading">Loading products...</div>';
        
        fetch('/getallproducts')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(products => {
                displayProducts(products);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                productsList.innerHTML = '<div class="error">Error loading products. Please try again.</div>';
            });
    }
    
    function displayProducts(products) {
        const productsList = document.getElementById('productsList');
        
        if (!products || products.length === 0) {
            productsList.innerHTML = '<div class="empty">No products available.</div>';
            return;
        }
        
        productsList.innerHTML = '';
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            productCard.innerHTML = `
                <div class="product-info">
                    <div class="product-title">${product.name}</div>
                    <div class="product-description">${product.description}</div>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <div class="product-quantity">
                        <label for="quantity-${product.id}">Quantity:</label>
                        <input type="number" id="quantity-${product.id}" min="1" max="${product.stockQuantity}" placeholder="Quantity" required>
                    </div>
                    <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">
                        Add to Cart
                    </button>
                </div>
            `;
            
            productsList.appendChild(productCard);
            
            // Add event listener to the add to cart button
            const addToCartBtn = productCard.querySelector('.add-to-cart');
            addToCartBtn.addEventListener('click', function() {
                const quantityInput = document.getElementById(`quantity-${product.id}`);
                const quantity = parseInt(quantityInput.value);
                
                if (isNaN(quantity) || quantity < 1) {
                    alert('Please enter a valid quantity');
                    return;
                }
                
                addToCart(product.id, product.name, product.price, quantity);
            });
        });
    }
    
    // Functions - Cart
    function addToCart(productId, productName, productPrice, quantity) {
        if (!currentUser) {
            showPage(loginPage);
            updateActiveLink(loginLink);
            return;
        }
        
        if (isNaN(quantity) || quantity < 1) {
            alert('Please enter a valid quantity');
            return;
        }
        
        const cartItem = {
            userId: currentUser.id,
            productId: productId,
            productName: productName,
            productPrice: productPrice,
            quantity: quantity
        };
        
        fetch('/addtocart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cartItem)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(message => {
            alert(message);
            if (message.includes('success')) {
                // Update cart count
                loadCartCount();
                // Clear the quantity input
                const quantityInput = document.getElementById(`quantity-${productId}`);
                if (quantityInput) {
                    quantityInput.value = '';
                }
            }
        })
        .catch(error => {
            console.error('Error adding to cart:', error);
            alert('Error adding to cart. Please try again.');
        });
    }
    
    function loadCartItems() {
        if (!currentUser) return;
        
        fetch(`/getcartitems/${currentUser.id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(items => {
                cartItemsArray = items;
                displayCartItems(items);
            })
            .catch(error => {
                console.error('Error fetching cart items:', error);
                cartItems.innerHTML = '<tr><td colspan="5">Error loading cart items. Please try again.</td></tr>';
            });
    }
    
    function displayCartItems(items) {
        if (!items || items.length === 0) {
            cartItems.innerHTML = '';
            emptyCart.classList.remove('hidden');
            document.querySelector('.cart-container').classList.add('hidden');
            return;
        }
        
        emptyCart.classList.add('hidden');
        document.querySelector('.cart-container').classList.remove('hidden');
        
        cartItems.innerHTML = '';
        let total = 0;
        
        items.forEach(item => {
            const itemTotal = item.productPrice * item.quantity;
            total += itemTotal;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.productName}</td>
                <td>$${item.productPrice.toFixed(2)}</td>
                <td>
                    <div class="quantity-control">
                        <button class="quantity-decrease" data-id="${item.id}">-</button>
                        <input type="number" value="${item.quantity}" min="1" data-id="${item.id}" class="quantity-input">
                        <button class="quantity-increase" data-id="${item.id}">+</button>
                    </div>
                </td>
                <td>$${itemTotal.toFixed(2)}</td>
                <td>
                    <button class="remove-item" data-id="${item.id}">Remove</button>
                </td>
            `;
            
            cartItems.appendChild(row);
            
            // Add event listeners for quantity controls
            row.querySelector('.quantity-decrease').addEventListener('click', function() {
                const input = row.querySelector('.quantity-input');
                if (parseInt(input.value) > 1) {
                    input.value = parseInt(input.value) - 1;
                    updateCartItemQuantity(item.id, parseInt(input.value));
                }
            });
            
            row.querySelector('.quantity-increase').addEventListener('click', function() {
                const input = row.querySelector('.quantity-input');
                input.value = parseInt(input.value) + 1;
                updateCartItemQuantity(item.id, parseInt(input.value));
            });
            
            row.querySelector('.quantity-input').addEventListener('change', function() {
                updateCartItemQuantity(item.id, parseInt(this.value));
            });
            
            row.querySelector('.remove-item').addEventListener('click', function() {
                removeFromCart(item.id);
            });
        });
        
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }
    
    function updateCartItemQuantity(itemId, quantity) {
        if (quantity < 1) {
            alert('Quantity must be at least 1');
            loadCartItems(); // Reload to reset invalid input
            return;
        }
        
        const cartItem = {
            id: itemId,
            userId: currentUser.id,
            quantity: quantity
        };
        
        fetch('/updatecartitem', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cartItem)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(message => {
            if (message.includes('success')) {
                loadCartItems();
            } else {
                alert(message);
                loadCartItems();
            }
        })
        .catch(error => {
            console.error('Error updating cart item:', error);
            alert('Error updating cart item. Please try again.');
            loadCartItems();
        });
    }
    
    function removeFromCart(itemId) {
        if (!confirm('Are you sure you want to remove this item from your cart?')) {
            return;
        }
        
        fetch(`/removefromcart/${itemId}/${currentUser.id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(message => {
            if (message.includes('success')) {
                loadCartItems();
                loadCartCount();
            } else {
                alert(message);
            }
        })
        .catch(error => {
            console.error('Error removing from cart:', error);
            alert('Error removing item from cart. Please try again.');
        });
    }
    
    function clearCart() {
        if (!confirm('Are you sure you want to clear your cart?')) {
            return;
        }
        
        // Remove each item one by one
        const promises = cartItemsArray.map(item => {
            return fetch(`/removefromcart/${item.id}/${currentUser.id}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            });
        });
        
        Promise.all(promises)
            .then(() => {
                loadCartItems();
                loadCartCount();
                alert('Cart cleared successfully');
            })
            .catch(error => {
                console.error('Error clearing cart:', error);
                alert('Error clearing cart. Please try again.');
            });
    }
    
    function loadCartCount() {
        if (!currentUser) return;
        
        fetch(`/getcartitems/${currentUser.id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(items => {
                let count = 0;
                if (items && items.length > 0) {
                    count = items.reduce((total, item) => total + item.quantity, 0);
                }
                cartCount.textContent = count;
            })
            .catch(error => {
                console.error('Error fetching cart count:', error);
            });
    }
    
    // Functions - Checkout
    function prepareCheckout() {
        // Get cart items from the DOM table
        const cartItemsTable = document.getElementById('cartItems');
        
        if (!cartItemsTable || cartItemsTable.children.length === 0) {
            alert('Your cart is empty. Please add items to your cart before checkout.');
            return;
        }

        // Get total price from cart total text
        const cartTotalText = document.getElementById('cartTotal').textContent;
        const totalPrice = parseFloat(cartTotalText.replace('$', ''));
        
        // Update order items display
        const orderItemsContainer = document.getElementById('orderItems');
        orderItemsContainer.innerHTML = '';
        
        // Copy items from cart to order summary
        for (let i = 0; i < cartItemsTable.children.length; i++) {
            const row = cartItemsTable.children[i];
            const productName = row.cells[0].textContent;
            const price = row.cells[1].textContent;
            const quantity = row.querySelector('.quantity-input').value;
            const subtotal = row.cells[3].textContent;
            
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <span>${productName} (${quantity})</span>
                <span>${subtotal}</span>
            `;
            
            orderItemsContainer.appendChild(orderItem);
        }
        
        // Set order total
        document.getElementById('orderTotal').textContent = cartTotalText;
        
        // Show checkout page
        showPage(checkoutPage);
    }
    
    function calculateTotalPrice() {
        // Get total price from cart total text
        const cartTotalText = document.getElementById('cartTotal').textContent;
        return parseFloat(cartTotalText.replace('$', ''));
    }
    
    function processPayment() {
        const name = document.getElementById('customerName').value;
        const email = document.getElementById('customerEmail').value;
        const phone = document.getElementById('customerPhone').value;
        
        if (!name || !email || !phone) {
            alert('Please fill in all required fields');
            return;
        }
        
        const totalAmount = calculateTotalPrice(); // API expects amount in rupees, we'll convert to paise in the backend
        
        // Create order on backend
        fetch('/payment/create-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: totalAmount
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create order');
            }
            return response.json();
        })
        .then(data => {
            // Check if Razorpay is available
            if (typeof Razorpay === 'undefined') {
                throw new Error('Razorpay SDK not loaded. Check your internet connection.');
            }
            
            const options = {
                key: data.keyId,
                amount: data.amount,
                currency: data.currency || 'INR',
                name: 'E-Commerce Store',
                description: 'Purchase Payment',
                order_id: data.orderId,
                handler: function (response) {
                    verifyPayment(response);
                },
                prefill: {
                    name: name,
                    email: email,
                    contact: phone
                },
                theme: {
                    color: '#3395ff'
                }
            };
            
            const rzp = new Razorpay(options);
            rzp.open();
        })
        .catch(error => {
            console.error('Payment error:', error);
            alert('Payment initialization failed: ' + error.message);
        });
    }
    
    function verifyPayment(response) {
        fetch('/payment/verify-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Payment verification failed');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                // Handle successful payment
                completeOrder();
            } else {
                throw new Error(data.message || 'Payment verification failed');
            }
        })
        .catch(error => {
            console.error('Verification error:', error);
            alert('Payment verification failed: ' + error.message);
        });
    }
    
    function completeOrder() {
        if (!currentUser) {
            alert('Please log in to complete your order');
            showPage(loginPage);
            updateActiveLink(loginLink);
            return;
        }
    
        // Get cart items from DOM to create order items
        const cartItemsTable = document.getElementById('cartItems');
        const orderItems = [];

        for (let i = 0; i < cartItemsTable.children.length; i++) {
            const row = cartItemsTable.children[i];
            const productId = row.querySelector('.remove-item').getAttribute('data-id');
            const productName = row.cells[0].textContent;
            const productPrice = parseFloat(row.cells[1].textContent.replace('$', ''));
            const quantity = parseInt(row.querySelector('.quantity-input').value);
            const subtotal = parseFloat(row.cells[3].textContent.replace('$', ''));
            
            orderItems.push({
                productId: productId,
                productName: productName,
                productPrice: productPrice,
                quantity: quantity,
                subtotal: subtotal
            });
        }

        // Send order to backend
        fetch(`/checkout/${currentUser.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: orderItems,
                totalAmount: calculateTotalPrice()
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Order processing failed');
            }
            return response.text();
        })
        .then(data => {
            // Clear cart items on success
            clearCart();
            
            // Show success message
            alert('Order placed successfully! Thank you for your purchase.');
            
            // Go back to home page
            showPage(homePage);
            updateActiveLink(homeLink);
        })
        .catch(error => {
            console.error('Order processing error:', error);
            alert('Order processing failed: ' + error.message);
        });
    }
}); 