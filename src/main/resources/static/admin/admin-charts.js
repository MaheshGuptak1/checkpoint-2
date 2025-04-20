/**
 * Admin Dashboard Charts
 * This file contains functions to create and update charts for the admin dashboard
 * using Chart.js library
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts if they exist on the page
    if (document.getElementById('salesChart')) {
        initSalesChart();
    }
    
    if (document.getElementById('productsChart')) {
        initProductsChart();
    }
    
    if (document.getElementById('userActivityChart')) {
        initUserActivityChart();
    }
});

/**
 * Initialize the sales chart showing monthly sales data
 */
function initSalesChart() {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded. Please include Chart.js before admin-charts.js');
        return;
    }
    
    // Get the chart canvas
    const ctx = document.getElementById('salesChart').getContext('2d');
    
    // Sample data - Replace with actual API call in production
    fetchMonthlySalesData()
        .then(data => {
            // Create chart
            const salesChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Monthly Sales ($)',
                        data: data.values,
                        borderColor: '#4e73df',
                        backgroundColor: 'rgba(78, 115, 223, 0.05)',
                        pointBackgroundColor: '#4e73df',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#4e73df',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.3
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: '#fff',
                            titleColor: '#6e707e',
                            bodyColor: '#858796',
                            borderColor: '#dddfeb',
                            borderWidth: 1,
                            displayColors: false,
                            caretPadding: 10,
                            callbacks: {
                                label: function(context) {
                                    return '$' + context.parsed.y.toLocaleString();
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false,
                                drawBorder: false
                            }
                        },
                        y: {
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)',
                                zeroLineColor: 'rgba(0, 0, 0, 0.1)',
                                drawBorder: false
                            },
                            ticks: {
                                callback: function(value) {
                                    return '$' + value.toLocaleString();
                                },
                                beginAtZero: true
                            }
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error loading sales chart data:', error);
            document.getElementById('salesChart').parentNode.innerHTML = 
                '<div class="chart-error">Failed to load sales data</div>';
        });
}

/**
 * Initialize the products chart showing top selling products
 */
function initProductsChart() {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded. Please include Chart.js before admin-charts.js');
        return;
    }
    
    // Get the chart canvas
    const ctx = document.getElementById('productsChart').getContext('2d');
    
    // Sample data - Replace with actual API call in production
    fetchTopProductsData()
        .then(data => {
            // Create chart
            const productsChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: data.labels,
                    datasets: [{
                        data: data.values,
                        backgroundColor: [
                            '#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b'
                        ],
                        hoverBackgroundColor: [
                            '#2e59d9', '#17a673', '#2c9faf', '#dda20a', '#be2617'
                        ],
                        hoverBorderColor: 'rgba(234, 236, 244, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    responsive: true,
                    cutout: '70%',
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                boxWidth: 12,
                                padding: 15
                            }
                        },
                        tooltip: {
                            backgroundColor: '#fff',
                            titleColor: '#6e707e',
                            bodyColor: '#858796',
                            borderColor: '#dddfeb',
                            borderWidth: 1,
                            displayColors: false,
                            caretPadding: 10,
                            callbacks: {
                                label: function(context) {
                                    return context.label + ': ' + context.parsed + ' units';
                                }
                            }
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error loading products chart data:', error);
            document.getElementById('productsChart').parentNode.innerHTML = 
                '<div class="chart-error">Failed to load product data</div>';
        });
}

/**
 * Initialize the user activity chart showing new registrations
 */
function initUserActivityChart() {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded. Please include Chart.js before admin-charts.js');
        return;
    }
    
    // Get the chart canvas
    const ctx = document.getElementById('userActivityChart').getContext('2d');
    
    // Sample data - Replace with actual API call in production
    fetchUserActivityData()
        .then(data => {
            // Create chart
            const userActivityChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'New Users',
                        data: data.values,
                        backgroundColor: '#36b9cc',
                        hoverBackgroundColor: '#2c9faf',
                        borderColor: '#36b9cc',
                        borderWidth: 1
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: '#fff',
                            titleColor: '#6e707e',
                            bodyColor: '#858796',
                            borderColor: '#dddfeb',
                            borderWidth: 1,
                            displayColors: false,
                            caretPadding: 10
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false,
                                drawBorder: false
                            }
                        },
                        y: {
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)',
                                zeroLineColor: 'rgba(0, 0, 0, 0.1)',
                                drawBorder: false
                            },
                            ticks: {
                                beginAtZero: true
                            }
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error loading user activity chart data:', error);
            document.getElementById('userActivityChart').parentNode.innerHTML = 
                '<div class="chart-error">Failed to load user data</div>';
        });
}

/**
 * Fetch monthly sales data from the server
 * @returns {Promise<Object>} - Object containing labels and values for the chart
 */
function fetchMonthlySalesData() {
    // In a real application, this would be an API call
    // For demo purposes, we'll return sample data
    return new Promise((resolve) => {
        setTimeout(() => {
            const currentYear = new Date().getFullYear();
            resolve({
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                values: [5000, 7500, 10000, 8500, 12000, 15000, 13500, 14000, 16500, 15500, 18000, 21000]
            });
        }, 500);
    });
}

/**
 * Fetch top products data from the server
 * @returns {Promise<Object>} - Object containing labels and values for the chart
 */
function fetchTopProductsData() {
    // In a real application, this would be an API call
    // For demo purposes, we'll return sample data
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                labels: ['Smartphone', 'Laptop', 'Headphones', 'Tablet', 'Smartwatch'],
                values: [350, 275, 190, 150, 120]
            });
        }, 500);
    });
}

/**
 * Fetch user activity data from the server
 * @returns {Promise<Object>} - Object containing labels and values for the chart
 */
function fetchUserActivityData() {
    // In a real application, this would be an API call
    // For demo purposes, we'll return sample data
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                values: [42, 35, 56, 48, 60, 75]
            });
        }, 500);
    });
} 