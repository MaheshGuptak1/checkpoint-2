document.addEventListener('DOMContentLoaded', function() {
    // Check if admin is logged in
    const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
    if (!adminUser.id) {
        window.location.href = 'index.html';
        return;
    }

    // Elements - Navigation
    const navLinks = document.querySelectorAll('.menu li');
    const pages = document.querySelectorAll('.page');
    const pageTitle = document.getElementById('page-title');
    
    // Elements - Dashboard
    const totalProductsEl = document.getElementById('totalProducts');
    const totalOrdersEl = document.getElementById('totalOrders');
    const totalCustomersEl = document.getElementById('totalCustomers');
    const totalRevenueEl = document.getElementById('totalRevenue');
    const recentOrdersList = document.getElementById('recent-orders-table');
    
    // Elements - Products
    const productsList = document.getElementById('productsList');
    const addProductBtn = document.getElementById('addProductBtn');
    const productModal = document.getElementById('productModal');
    const productFormTitle = document.getElementById('productFormTitle');
    const saveProductBtn = document.getElementById('saveProductBtn');
    const productFilter = document.getElementById('productFilter');
    
    // Elements - Users
    const usersList = document.getElementById('usersList');
    const userDetailsModal = document.getElementById('userDetailsModal');
    const userDetails = document.getElementById('userDetails');
    const userOrdersList = document.getElementById('userOrdersList');
    const userFilter = document.getElementById('userFilter');
    
    // Elements - Orders
    const ordersList = document.getElementById('ordersList');
    const orderDetailsModal = document.getElementById('orderDetailsModal');
    const orderDetails = document.getElementById('orderDetails');
    const orderItemsList = document.getElementById('orderItemsList');
    const orderStatusFilter = document.getElementById('orderStatusFilter');
    const orderStatus = document.getElementById('orderStatus');
    const updateStatusBtn = document.getElementById('updateStatusBtn');
    const deliveryDate = document.getElementById('deliveryDate');
    const updateDeliveryBtn = document.getElementById('updateDeliveryBtn');
    const orderTotal = document.getElementById('orderTotal');

    // Set admin name
    document.getElementById('adminName').textContent = adminUser.username || 'Admin';
    
    // Initialize
    initializeEventListeners();
    showPage('dashboard-page', 'Dashboard');
    loadDashboardData();
    
    function initializeEventListeners() {
        // Navigation
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                const pageId = this.getAttribute('data-page');
                showPage(pageId, this.textContent.trim());
                updateActiveLink(this);
            });
        });
        
        // Logout
        document.getElementById('logoutBtn').addEventListener('click', logout);
        
        // Modal close buttons
        document.querySelectorAll('.close, .close-modal').forEach(btn => {
            btn.addEventListener('click', function() {
                const modal = this.closest('.modal');
                if (modal) modal.style.display = 'none';
            });
        });
        
        // Products
        if (addProductBtn) {
            addProductBtn.addEventListener('click', function() {
                productFormTitle.textContent = 'Add New Product';
                document.getElementById('productId').value = '';
                document.getElementById('productName').value = '';
                document.getElementById('productDescription').value = '';
                document.getElementById('productPrice').value = '';
                document.getElementById('productStock').value = '';
                productModal.style.display = 'block';
            });
        }
        
        if (saveProductBtn) {
            saveProductBtn.addEventListener('click', saveProduct);
        }
        
        if (productFilter) {
            productFilter.addEventListener('change', function() {
                loadProducts(this.value);
            });
        }
        
        // Orders
        if (orderStatusFilter) {
            orderStatusFilter.addEventListener('change', function() {
                loadOrders(this.value);
            });
        }
        
        if (updateStatusBtn) {
            updateStatusBtn.addEventListener('click', updateOrderStatus);
        }
        
        if (updateDeliveryBtn) {
            updateDeliveryBtn.addEventListener('click', updateDeliveryDate);
        }
        
        // Users
        if (userFilter) {
            userFilter.addEventListener('change', function() {
                loadUsers(this.value);
            });
        }
        
        // Close modals when clicking outside
        window.addEventListener('click', function(event) {
            document.querySelectorAll('.modal').forEach(modal => {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
    }
    
    function logout() {
        localStorage.removeItem('adminUser');
        window.location.href = 'index.html';
    }
    
    function showPage(pageId, title) {
        console.log('Showing page:', pageId);
        // Hide all pages
        pages.forEach(page => page.classList.remove('active'));
        
        // Show the selected page
        const activePage = document.getElementById(pageId);
        if (activePage) {
            activePage.classList.add('active');
            
            // Set page title
            if (pageTitle) pageTitle.textContent = title;
            
            // Load data based on the page
            if (pageId === 'dashboard-page') {
                loadDashboardData();
            } else if (pageId === 'products-page') {
                loadProducts();
            } else if (pageId === 'customers-page') {
                loadUsers();
            } else if (pageId === 'orders-page') {
                loadOrders();
            }
        } else {
            console.error('Page not found:', pageId);
        }
    }
    
    function updateActiveLink(link) {
        // Remove active class from all links
        navLinks.forEach(navLink => navLink.classList.remove('active'));
        
        // Add active class to the clicked link
        link.classList.add('active');
    }
    
    // Functions - Dashboard
    function loadDashboardData() {
        // Show loading indicators
        totalProductsEl.textContent = 'Loading...';
        totalOrdersEl.textContent = 'Loading...';
        totalCustomersEl.textContent = 'Loading...';
        totalRevenueEl.textContent = 'Loading...';
        
        // Load summary data
        fetch('/admin/dashboard/summary')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                console.log("Dashboard data:", data);
                // Update dashboard counts with real data
                totalProductsEl.textContent = data.totalProducts || '0';
                totalOrdersEl.textContent = data.totalOrders || '0';
                totalCustomersEl.textContent = data.totalCustomers || '0';
                
                // Format revenue with 2 decimal places
                const revenue = parseFloat(data.totalRevenue) || 0;
                totalRevenueEl.textContent = '$' + revenue.toFixed(2);
            })
            .catch(error => {
                console.error('Error loading dashboard data:', error);
                // Set default values on error
                totalProductsEl.textContent = '0';
                totalOrdersEl.textContent = '0';
                totalCustomersEl.textContent = '0';
                totalRevenueEl.textContent = '$0.00';
            });
        
        // Load recent orders
        recentOrdersList.innerHTML = '<tr><td colspan="6">Loading orders...</td></tr>';
        
        fetch('/admin/orders')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(orders => {
                console.log("Recent orders:", orders);
                // Display recent orders (limited to the most recent 5)
                if (orders && orders.length > 0) {
                    // Sort by date (newest first) and take first 5
                    const recentOrders = orders
                        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
                        .slice(0, 5);
                    displayRecentOrders(recentOrders);
                } else {
                    recentOrdersList.innerHTML = '<tr><td colspan="6">No orders found</td></tr>';
                }
            })
            .catch(error => {
                console.error('Error loading recent orders:', error);
                recentOrdersList.innerHTML = '<tr><td colspan="6">Error loading orders</td></tr>';
            });
    }
    
    function displayRecentOrders(orders) {
        recentOrdersList.innerHTML = '';
        
        if (!orders || orders.length === 0) {
            recentOrdersList.innerHTML = '<tr><td colspan="6">No recent orders found</td></tr>';
            return;
        }
        
        orders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.userName || 'N/A'}</td>
                <td>${new Date(order.orderDate).toLocaleDateString()}</td>
                <td>$${order.totalAmount.toFixed(2)}</td>
                <td><span class="status-badge ${order.status.toLowerCase()}">${order.status}</span></td>
                <td><button class="view-btn" data-id="${order.id}">View</button></td>
            `;
            recentOrdersList.appendChild(row);
            
            // Add event listener to view button
            row.querySelector('.view-btn').addEventListener('click', function() {
                // Show orders page and then view the order
                showPage('orders-page', 'Orders');
                updateActiveLink(document.querySelector('.menu li[data-page="orders-page"]'));
                viewOrderDetails(order.id);
            });
        });
    }
    
    // Functions - Products
    function loadProducts(filter = '') {
        // Show loading indicator
        productsList.innerHTML = '<tr><td colspan="6">Loading products...</td></tr>';
        
        let url = '/getallproducts';
        if (filter) {
            url += `?filter=${encodeURIComponent(filter)}`;
        }
        
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(products => {
                console.log("Loaded products:", products);
                displayProducts(products);
            })
            .catch(error => {
                console.error('Error loading products:', error);
                productsList.innerHTML = '<tr><td colspan="6">Error loading products. Please try again later.</td></tr>';
            });
    }
    
    function displayProducts(products) {
        productsList.innerHTML = '';
        
        if (!products || products.length === 0) {
            productsList.innerHTML = '<tr><td colspan="6">No products found</td></tr>';
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
            
            // Add event listeners
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
    function loadUsers(filter = '') {
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
        userDetails.innerHTML = '<p>Loading user details...</p>';
        userOrdersList.innerHTML = '<tr><td colspan="5">Loading order history...</td></tr>';
        userDetailsModal.style.display = 'block';
        
        fetch(`/admin/users/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch user details: ${response.status}`);
                }
                return response.json();
            })
            .then(user => {
                // Display basic user details
                userDetails.innerHTML = `
                    <p><strong>ID:</strong> ${user.id}</p>
                    <p><strong>Username:</strong> ${user.username || 'Not available'}</p>
                    <p><strong>Email:</strong> ${user.email || 'Not available'}</p>
                `;
                
                // Get user orders
                return fetch(`/admin/orders/user/${userId}`);
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch user orders: ${response.status}`);
                }
                return response.json();
            })
            .then(orders => {
                displayUserOrders(orders);
            })
            .catch(error => {
                console.error('Error loading user details:', error);
                userDetails.innerHTML = `<p class="error-message">Error loading user details: ${error.message}</p>`;
                userOrdersList.innerHTML = '<tr><td colspan="5">Could not load order history</td></tr>';
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
            .then(data => {
                // Format dates properly
                const orderDate = data.orderDate ? new Date(data.orderDate + 'T00:00:00') : null;
                const expectedDeliveryDate = data.expectedDeliveryDate ? new Date(data.expectedDeliveryDate + 'T00:00:00') : null;
                
                const formattedOrderDate = orderDate ? orderDate.toLocaleDateString() : 'Not set';
                const formattedDeliveryDate = expectedDeliveryDate ? expectedDeliveryDate.toLocaleDateString() : 'Not set';
                
                // Update order details display
                orderDetails.innerHTML = `
                    <div class="detail-row">
                        <span class="detail-label">Order ID:</span>
                        <span class="detail-value">${data.id}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Customer:</span>
                        <span class="detail-value">${data.userName || 'Not available'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">${data.userEmail || 'Not available'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Order Date:</span>
                        <span class="detail-value">${formattedOrderDate}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Expected Delivery:</span>
                        <span class="detail-value">${formattedDeliveryDate}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Status:</span>
                        <span class="detail-value status-badge ${data.status.toLowerCase()}">${data.status}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Invoice Number:</span>
                        <span class="detail-value">${data.invoiceNumber || 'Not available'}</span>
                    </div>
                `;
                
                // Set the current value for the status dropdown and delivery date
                document.getElementById('orderStatus').value = data.status;
                if (data.expectedDeliveryDate) {
                    // Format is already YYYY-MM-DD from the backend
                    document.getElementById('deliveryDate').value = data.expectedDeliveryDate;
                } else {
                    document.getElementById('deliveryDate').value = '';
                }
                
                // Update order total
                orderTotal.textContent = `$${data.totalAmount.toFixed(2)}`;
                
                // Display order items
                displayOrderItems(data.orderItems || []);
                
                // Store order ID for status update
                document.getElementById('updateStatusBtn').dataset.orderId = data.id;
                document.getElementById('updateDeliveryBtn').dataset.orderId = data.id;
            })
            .catch(error => {
                console.error('Error loading order details:', error);
                orderDetails.innerHTML = '<p class="error-message">Error loading order details. Please try again.</p>';
                orderItemsList.innerHTML = '<tr><td colspan="4">Error loading items</td></tr>';
            });
    }
    
    function displayOrderItems(items) {
        orderItemsList.innerHTML = '';
        
        if (!items || items.length === 0) {
            orderItemsList.innerHTML = '<tr><td colspan="4">No items in this order</td></tr>';
            return;
        }
        
        let total = 0;
        
        items.forEach(item => {
            const subtotal = item.subTotal || (item.productPrice * item.quantity);
            total += subtotal;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.productName}</td>
                <td>$${item.productPrice.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>$${subtotal.toFixed(2)}</td>
            `;
            orderItemsList.appendChild(row);
        });
        
        // Update the total if needed
        if (Math.abs(total - parseFloat(orderTotal.textContent.replace('$', ''))) > 0.01) {
            console.warn('Order total mismatch between items total and order total');
        }
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