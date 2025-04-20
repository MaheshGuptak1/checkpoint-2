document.addEventListener('DOMContentLoaded', function() {
    // Check if admin is logged in
    const storedAdmin = localStorage.getItem('adminUser');
    if (!storedAdmin) {
        window.location.href = 'index.html';
        return;
    }
    
    const adminUser = JSON.parse(storedAdmin);
    document.getElementById('adminName').textContent = adminUser.username;
    
    // DOM Elements - Navigation
    const dashboardLink = document.getElementById('dashboardLink');
    const productsLink = document.getElementById('productsLink');
    const usersLink = document.getElementById('usersLink');
    const ordersLink = document.getElementById('ordersLink');
    const logoutLink = document.getElementById('logoutLink');
    
    // DOM Elements - Pages
    const pageTitle = document.getElementById('pageTitle');
    const dashboardPage = document.getElementById('dashboardPage');
    const productsPage = document.getElementById('productsPage');
    const usersPage = document.getElementById('usersPage');
    const ordersPage = document.getElementById('ordersPage');
    
    // DOM Elements - Dashboard
    const totalUsers = document.getElementById('totalUsers');
    const totalProducts = document.getElementById('totalProducts');
    const totalOrders = document.getElementById('totalOrders');
    const totalRevenue = document.getElementById('totalRevenue');
    const recentOrdersList = document.getElementById('recentOrdersList');
    
    // DOM Elements - Products
    const productsList = document.getElementById('productsList');
    const addProductBtn = document.getElementById('addProductBtn');
    const productModal = document.getElementById('productModal');
    const productForm = document.getElementById('productForm');
    const productFormTitle = document.getElementById('productFormTitle');
    const saveProductBtn = document.getElementById('saveProductBtn');
    const cancelProductBtn = document.getElementById('cancelProductBtn');
    
    // DOM Elements - Users
    const usersList = document.getElementById('usersList');
    const userDetailsModal = document.getElementById('userDetailsModal');
    const userDetails = document.getElementById('userDetails');
    const userOrdersList = document.getElementById('userOrdersList');
    
    // DOM Elements - Orders
    const ordersList = document.getElementById('ordersList');
    const orderStatusFilter = document.getElementById('orderStatusFilter');
    const orderDetailsModal = document.getElementById('orderDetailsModal');
    const orderDetails = document.getElementById('orderDetails');
    const orderItemsList = document.getElementById('orderItemsList');
    const orderTotal = document.getElementById('orderTotal');
    const orderStatus = document.getElementById('orderStatus');
    const updateStatusBtn = document.getElementById('updateStatusBtn');
    const deliveryDate = document.getElementById('deliveryDate');
    const updateDeliveryBtn = document.getElementById('updateDeliveryBtn');
    
    // Close buttons for modals
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.style.display = 'none';
        });
    });
    
    // Event Listeners - Navigation
    dashboardLink.addEventListener('click', function(e) {
        e.preventDefault();
        showPage(dashboardPage, 'Dashboard');
        loadDashboardData();
        updateActiveLink(dashboardLink);
    });
    
    productsLink.addEventListener('click', function(e) {
        e.preventDefault();
        showPage(productsPage, 'Products');
        loadProducts();
        updateActiveLink(productsLink);
    });
    
    usersLink.addEventListener('click', function(e) {
        e.preventDefault();
        showPage(usersPage, 'Users');
        loadUsers();
        updateActiveLink(usersLink);
    });
    
    ordersLink.addEventListener('click', function(e) {
        e.preventDefault();
        showPage(ordersPage, 'Orders');
        loadOrders();
        updateActiveLink(ordersLink);
    });
    
    logoutLink.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('adminUser');
        window.location.href = 'index.html';
    });
    
    // Event Listeners - Products
    addProductBtn.addEventListener('click', function() {
        productFormTitle.textContent = 'Add New Product';
        productForm.reset();
        document.getElementById('productId').value = '';
        productModal.style.display = 'block';
    });
    
    cancelProductBtn.addEventListener('click', function() {
        productModal.style.display = 'none';
    });
    
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveProduct();
    });
    
    // Event Listeners - Orders
    orderStatusFilter.addEventListener('change', function() {
        loadOrders(this.value);
    });
    
    updateStatusBtn.addEventListener('click', function() {
        updateOrderStatus();
    });
    
    updateDeliveryBtn.addEventListener('click', function() {
        updateDeliveryDate();
    });
    
    // Load initial data
    loadDashboardData();
    
    // Functions - Navigation
    function showPage(page, title) {
        // Hide all pages
        dashboardPage.classList.add('hidden');
        productsPage.classList.add('hidden');
        usersPage.classList.add('hidden');
        ordersPage.classList.add('hidden');
        
        // Show selected page
        page.classList.remove('hidden');
        pageTitle.textContent = title;
    }
    
    function updateActiveLink(link) {
        // Remove active class from all links
        dashboardLink.classList.remove('active');
        productsLink.classList.remove('active');
        usersLink.classList.remove('active');
        ordersLink.classList.remove('active');
        
        // Add active class to selected link
        link.classList.add('active');
    }
    
    // Functions - Dashboard
    function loadDashboardData() {
        // Load counts and statistics
        Promise.all([
            fetch('/admin/users').then(response => response.json()),
            fetch('/getallproducts').then(response => response.json()),
            fetch('/admin/orders').then(response => response.json())
        ])
        .then(([users, products, orders]) => {
            // Update counts
            totalUsers.textContent = users.length;
            totalProducts.textContent = products.length;
            totalOrders.textContent = orders.length;
            
            // Calculate total revenue
            const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
            totalRevenue.textContent = '$' + revenue.toFixed(2);
            
            // Display recent orders (last 5)
            const recentOrders = orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)).slice(0, 5);
            displayRecentOrders(recentOrders);
        })
        .catch(error => {
            console.error('Error loading dashboard data:', error);
        });
    }
    
    function displayRecentOrders(orders) {
        recentOrdersList.innerHTML = '';
        
        if (orders.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="5">No orders found</td>';
            recentOrdersList.appendChild(row);
            return;
        }
        
        orders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.userName}</td>
                <td>${new Date(order.orderDate).toLocaleDateString()}</td>
                <td>$${order.totalAmount.toFixed(2)}</td>
                <td><span class="status-badge ${order.status.toLowerCase()}">${order.status}</span></td>
            `;
            recentOrdersList.appendChild(row);
        });
    }
    
    // Functions - Products
    function loadProducts() {
        // Show loading indicator
        productsList.innerHTML = '<tr><td colspan="6">Loading products...</td></tr>';
        
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
                console.error('Error loading products:', error);
                productsList.innerHTML = '<tr><td colspan="6">Error loading products. Please try again later.</td></tr>';
            });
    }
    
    function displayProducts(products) {
        productsList.innerHTML = '';
        
        if (products.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="6">No products found</td>';
            productsList.appendChild(row);
            return;
        }
        
        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.description}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>${product.stockQuantity}</td>
                <td>
                    <button class="edit-btn" data-id="${product.id}">Edit</button>
                    <button class="delete-btn" data-id="${product.id}">Delete</button>
                </td>
            `;
            productsList.appendChild(row);
            
            // Add event listeners for buttons
            row.querySelector('.edit-btn').addEventListener('click', function() {
                editProduct(product);
            });
            
            row.querySelector('.delete-btn').addEventListener('click', function() {
                deleteProduct(product.id);
            });
        });
    }
    
    function editProduct(product) {
        productFormTitle.textContent = 'Edit Product';
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStock').value = product.stockQuantity;
        productModal.style.display = 'block';
    }
    
    function saveProduct() {
        // Get form values
        const id = document.getElementById('productId').value;
        const name = document.getElementById('productName').value;
        const description = document.getElementById('productDescription').value;
        const price = parseFloat(document.getElementById('productPrice').value);
        const stockQuantity = parseInt(document.getElementById('productStock').value);
        
        // Validate form
        if (!name || !description || isNaN(price) || isNaN(stockQuantity)) {
            showFormError('Please fill in all fields with valid values');
            return;
        }
        
        if (price <= 0) {
            showFormError('Price must be greater than zero');
            return;
        }
        
        if (stockQuantity < 0) {
            showFormError('Stock quantity cannot be negative');
            return;
        }
        
        // Clear previous error
        clearFormError();
        
        const product = {
            name: name,
            description: description,
            price: price,
            stockQuantity: stockQuantity
        };
        
        // If id exists, it's an update
        if (id) {
            product.id = parseInt(id);
        }
        
        // Use correct API URLs based on the actual backend endpoints
        let url, method;
        if (id) {
            url = '/updateproduct';
            method = 'PUT';
        } else {
            url = '/createproduct';
            method = 'POST';
        }
        
        console.log("Saving product:", product, "to URL:", url, "with method:", method);
        
        // Save the product
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.status);
            }
            return response.text(); // The API returns text, not JSON
        })
        .then(message => {
            console.log("Server response:", message);
            // Close the modal and refresh the products list
            productModal.style.display = 'none';
            showNotification(id ? 'Product updated successfully' : 'Product added successfully');
            loadProducts();
        })
        .catch(error => {
            console.error('Error saving product:', error);
            showFormError('Error saving product. Please try again.');
        });
    }
    
    function showFormError(message) {
        const errorElement = document.getElementById('productFormError') || createFormErrorElement();
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    function clearFormError() {
        const errorElement = document.getElementById('productFormError');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }
    
    function createFormErrorElement() {
        const errorElement = document.createElement('div');
        errorElement.id = 'productFormError';
        errorElement.className = 'error-message';
        errorElement.style.display = 'none';
        
        // Insert after the product form title
        const formTitle = document.getElementById('productFormTitle');
        formTitle.parentNode.insertBefore(errorElement, formTitle.nextSibling);
        
        return errorElement;
    }
    
    function showNotification(message) {
        // Create notification if it doesn't exist
        let notification = document.getElementById('adminNotification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'adminNotification';
            notification.className = 'admin-notification';
            document.body.appendChild(notification);
        }
        
        // Set message and show
        notification.textContent = message;
        notification.classList.add('show');
        
        // Hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    function deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            fetch(`/deleteproduct/${productId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(message => {
                alert(message);
                loadProducts();
            })
            .catch(error => {
                console.error('Error deleting product:', error);
                alert('Error deleting product. Please try again.');
            });
        }
    }
    
    // Functions - Users
    function loadUsers() {
        fetch('/admin/users')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(users => {
                displayUsers(users);
            })
            .catch(error => {
                console.error('Error loading users:', error);
                usersList.innerHTML = '<tr><td colspan="4">Error loading users</td></tr>';
            });
    }
    
    function displayUsers(users) {
        usersList.innerHTML = '';
        
        if (users.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="4">No users found</td>';
            usersList.appendChild(row);
            return;
        }
        
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>
                    <button class="view-btn" data-id="${user.id}">View Details</button>
                </td>
            `;
            usersList.appendChild(row);
            
            // Add event listener for view button
            row.querySelector('.view-btn').addEventListener('click', function() {
                viewUserDetails(user.id);
            });
        });
    }
    
    function viewUserDetails(userId) {
        // Get user details
        fetch(`/admin/users/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(user => {
                userDetails.innerHTML = `
                    <p><strong>ID:</strong> ${user.id}</p>
                    <p><strong>Username:</strong> ${user.username}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                `;
                
                // Get user orders
                return fetch(`/admin/orders/user/${userId}`);
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(orders => {
                displayUserOrders(orders);
                userDetailsModal.style.display = 'block';
            })
            .catch(error => {
                console.error('Error loading user details:', error);
                alert('Error loading user details. Please try again.');
            });
    }
    
    function displayUserOrders(orders) {
        userOrdersList.innerHTML = '';
        
        if (orders.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="5">No orders found</td>';
            userOrdersList.appendChild(row);
            return;
        }
        
        orders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${new Date(order.orderDate).toLocaleDateString()}</td>
                <td>$${order.totalAmount.toFixed(2)}</td>
                <td><span class="status-badge ${order.status.toLowerCase()}">${order.status}</span></td>
                <td>
                    <button class="view-btn" data-id="${order.id}">View</button>
                </td>
            `;
            userOrdersList.appendChild(row);
            
            // Add event listener for view button
            row.querySelector('.view-btn').addEventListener('click', function() {
                userDetailsModal.style.display = 'none';
                viewOrderDetails(order.id);
            });
        });
    }
    
    // Functions - Orders
    function loadOrders(status = '') {
        let url = '/admin/orders';
        if (status) {
            url = `/admin/orders/status/${status}`;
        }
        
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(orders => {
                displayOrders(orders);
            })
            .catch(error => {
                console.error('Error loading orders:', error);
                ordersList.innerHTML = '<tr><td colspan="8">Error loading orders</td></tr>';
            });
    }
    
    function displayOrders(orders) {
        ordersList.innerHTML = '';
        
        if (orders.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="8">No orders found</td>';
            ordersList.appendChild(row);
            return;
        }
        
        orders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.userName}</td>
                <td>${new Date(order.orderDate).toLocaleDateString()}</td>
                <td>${new Date(order.expectedDeliveryDate).toLocaleDateString()}</td>
                <td>$${order.totalAmount.toFixed(2)}</td>
                <td><span class="status-badge ${order.status.toLowerCase()}">${order.status}</span></td>
                <td>${order.invoiceNumber}</td>
                <td>
                    <button class="view-btn" data-id="${order.id}">View Details</button>
                </td>
            `;
            ordersList.appendChild(row);
            
            // Add event listener for view button
            row.querySelector('.view-btn').addEventListener('click', function() {
                viewOrderDetails(order.id);
            });
        });
    }
    
    function viewOrderDetails(orderId) {
        // Show loading in modal
        orderDetails.innerHTML = '<p>Loading order details...</p>';
        orderItemsList.innerHTML = '<tr><td colspan="4">Loading items...</td></tr>';
        orderDetailsModal.style.display = 'block';
        
        // Fetch order details
        fetch(`/admin/orders/${orderId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(order => {
                // Format and display order details
                const formattedOrderDate = new Date(order.orderDate).toLocaleDateString();
                const formattedDeliveryDate = order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'Not set';
                
                orderDetails.innerHTML = `
                    <div class="detail-row">
                        <span class="detail-label">Order ID:</span>
                        <span class="detail-value">${order.id}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Customer:</span>
                        <span class="detail-value">${order.userName}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">${order.userEmail || 'Not available'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Order Date:</span>
                        <span class="detail-value">${formattedOrderDate}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Delivery Date:</span>
                        <span class="detail-value">${formattedDeliveryDate}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Status:</span>
                        <span class="detail-value status-badge ${order.status.toLowerCase()}">${order.status}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Shipping Address:</span>
                        <span class="detail-value">${order.shippingAddress || 'Not available'}</span>
                    </div>
                `;
                
                // Set the current value for the status dropdown and delivery date
                document.getElementById('orderStatus').value = order.status;
                if (order.deliveryDate) {
                    // Convert date to YYYY-MM-DD format for input[type=date]
                    const dateObj = new Date(order.deliveryDate);
                    const year = dateObj.getFullYear();
                    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                    const day = String(dateObj.getDate()).padStart(2, '0');
                    document.getElementById('deliveryDate').value = `${year}-${month}-${day}`;
                } else {
                    document.getElementById('deliveryDate').value = '';
                }
                
                // Update order total
                orderTotal.textContent = `$${order.totalAmount.toFixed(2)}`;
                
                // Display order items
                displayOrderItems(order.orderItems || []);
                
                // Store order ID for status update
                document.getElementById('updateStatusBtn').dataset.orderId = order.id;
                document.getElementById('updateDeliveryBtn').dataset.orderId = order.id;
            })
            .catch(error => {
                console.error('Error loading order details:', error);
                orderDetails.innerHTML = '<p class="error-message">Error loading order details. Please try again.</p>';
                orderItemsList.innerHTML = '<tr><td colspan="4">Error loading items</td></tr>';
            });
    }
    
    function displayOrderItems(items) {
        orderItemsList.innerHTML = '';
        let total = 0;
        
        items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.productName}</td>
                <td>$${item.productPrice.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>$${item.subTotal.toFixed(2)}</td>
            `;
            orderItemsList.appendChild(row);
            total += item.subTotal;
        });
        
        orderTotal.textContent = '$' + total.toFixed(2);
    }
    
    function updateOrderStatus() {
        const orderId = updateStatusBtn.dataset.orderId;
        const status = orderStatus.value;
        
        fetch(`/admin/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(status)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(message => {
            alert(message);
            // Update status in the UI
            const statusSpan = orderDetails.querySelector('.status-badge');
            statusSpan.className = `status-badge ${status.toLowerCase()}`;
            statusSpan.textContent = status;
            
            // Reload orders list
            loadOrders(orderStatusFilter.value);
        })
        .catch(error => {
            console.error('Error updating order status:', error);
            alert('Error updating order status. Please try again.');
        });
    }
    
    function updateDeliveryDate() {
        const orderId = updateDeliveryBtn.dataset.orderId;
        const date = deliveryDate.value;
        
        if (!date) {
            alert('Please select a date');
            return;
        }
        
        fetch(`/admin/orders/${orderId}/delivery-date`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(date)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(message => {
            alert(message);
            // Update delivery date in the UI
            const deliveryInfo = orderDetails.querySelectorAll('p')[3];
            deliveryInfo.innerHTML = `<strong>Expected Delivery:</strong> ${new Date(date).toLocaleDateString()}`;
            
            // Reload orders list
            loadOrders(orderStatusFilter.value);
        })
        .catch(error => {
            console.error('Error updating delivery date:', error);
            alert('Error updating delivery date. Please try again.');
        });
    }
}); 