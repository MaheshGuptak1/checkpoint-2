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
    
    // Event Listeners - Navigation
    homeLink.addEventListener('click', function(e) {
        e.preventDefault();
        showPage(homePage);
        updateActiveLink(homeLink);
    });
    
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
    
    loginLink.addEventListener('click', function(e) {
        e.preventDefault();
        showPage(loginPage);
        updateActiveLink(loginLink);
    });
    
    registerLink.addEventListener('click', function(e) {
        e.preventDefault();
        showPage(registerPage);
        updateActiveLink(registerLink);
    });
    
    logoutLink.addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });
    
    // Event Listeners - Forms
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        login();
    });
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        register();
    });
    
    goToRegister.addEventListener('click', function(e) {
        e.preventDefault();
        showPage(registerPage);
        updateActiveLink(registerLink);
    });
    
    goToLogin.addEventListener('click', function(e) {
        e.preventDefault();
        showPage(loginPage);
        updateActiveLink(loginLink);
    });
    
    // Event Listeners - Cart
    clearCartBtn.addEventListener('click', clearCart);
    checkoutBtn.addEventListener('click', function() {
        prepareCheckout();
        showPage(checkoutPage);
    });
    browseProductsLink.addEventListener('click', function(e) {
        e.preventDefault();
        loadProducts();
        showPage(productsPage);
        updateActiveLink(productsLink);
    });
    
    // Event Listeners - Checkout
    backToCartBtn.addEventListener('click', function() {
        showPage(cartPage);
        updateActiveLink(cartLink);
    });
    
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        processPayment();
    });
    
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
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.id) {
                // Successful login
                currentUser = data;
                localStorage.setItem('currentUser', JSON.stringify(data));
                
                // Update UI
                updateUIForLoggedInUser();
                
                // Load products
                loadProducts();
                showPage(productsPage);
                updateActiveLink(productsLink);
                
                // Reset form
                loginForm.reset();
            } else {
                alert('Invalid username or password');
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
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(message => {
            alert(message);
            if (message.includes('success')) {
                // Redirect to login page
                showPage(loginPage);
                updateActiveLink(loginLink);
                
                // Reset form
                registerForm.reset();
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
                        <input type="number" id="quantity-${product.id}" min="1" max="${product.stockQuantity}" value="1">
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
                const quantity = parseInt(document.getElementById(`quantity-${product.id}`).value);
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
        
        if (quantity < 1) {
            alert('Please select a valid quantity');
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
        if (!cartItemsArray || cartItemsArray.length === 0) {
            alert('Your cart is empty');
            showPage(cartPage);
            updateActiveLink(cartLink);
            return;
        }
        
        orderItems.innerHTML = '';
        let total = 0;
        
        cartItemsArray.forEach(item => {
            const itemTotal = item.productPrice * item.quantity;
            total += itemTotal;
            
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <div>${item.productName} x ${item.quantity}</div>
                <div>$${itemTotal.toFixed(2)}</div>
            `;
            
            orderItems.appendChild(orderItem);
        });
        
        orderTotal.textContent = `$${total.toFixed(2)}`;
    }
    
    function processPayment() {
        const cardName = document.getElementById('cardName').value;
        const cardNumber = document.getElementById('cardNumber').value;
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;
        
        if (!cardName || !cardNumber || !expiryDate || !cvv) {
            alert('Please fill in all payment details');
            return;
        }
        
        // Here you would normally validate the card details
        
        // Process checkout
        fetch(`/checkout/${currentUser.id}`, {
            method: 'POST'
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
                // Reset payment form
                paymentForm.reset();
                
                // Update cart count
                loadCartCount();
                
                // Show success message and redirect to products
                showPage(homePage);
                updateActiveLink(homeLink);
                
                // Update home page with success message
                homePage.innerHTML = `
                    <h1>Thank You for Your Order!</h1>
                    <p>Your order has been successfully placed.</p>
                    <div class="button-group" style="justify-content: center; margin-top: 20px;">
                        <button id="continueShopping">Continue Shopping</button>
                    </div>
                `;
                
                document.getElementById('continueShopping').addEventListener('click', function() {
                    loadProducts();
                    showPage(productsPage);
                    updateActiveLink(productsLink);
                });
            }
        })
        .catch(error => {
            console.error('Error processing payment:', error);
            alert('Error processing payment. Please try again.');
        });
    }
}); 