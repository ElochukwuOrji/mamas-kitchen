const menuItems = [
    {
        id: 1,
        name: "Jollof Rice",
        description: "Spicy Nigeria rice cooked with tomatoes, peppers and aromatic spices.",
        price: 3000,
        image: "images/jollof-rice.jpg"
    },
    {
        id: 2,
        name: "Moi Moi",
        description: "Delicious steamed bean pudding made from blended peeled beans, peppers, and spices.",
        price: 1000,
        image: "images/moi-moi.jpg"
    },
    {
        id: 3,
        name: "Egusi Soup",
        description: "A rich melon seed soup with assorted meat, fish, and vegetables.",
        price: 2500,
        image: "images/egusi-soup.jpg"
    },
    {
        id: 4,
        name: "Pounded Yam",
        description: "Smooth, stretchy yam served with your choice of soup.",
        price: 1500,
        image: "images/pounded-yam.jpg"
    },
    {
        id: 5,
        name: "Suya",
        description: "Spicy grilled meat skewers, seasoned with traditional spices.",
        price: 2000,
        image: "images/suya.jpg"
    },
    {
        id: 6,
        name: "Pepper Soup",
        description: "Spicy aromatic soup made with fish or meat and local spices.",
        price: 2800,
        image: "images/pepper-soup.jpg"
    }
]

// Cart array to store selected items
let cart = [];

//DOM elements
const menuContainer = document.getElementById('menu-container');
const orderItemsContainer = document.getElementById('order-items');
const totalPriceElement = document.getElementById('total-price');
const submitOrderBtn = document.getElementById('submit-order');
const printOrderBtn = document.getElementById('print-order');
const successModal = document.getElementById('success-modal');
const orderIdElement = document.getElementById('order-id');

document.addEventListener('DOMContentLoaded', function() {
    displayMenuItems();
    updateOrderDisplay();
    setupEventListeners();
});

// Function to display menu items
function displayMenuItems() {
    menuContainer.innerHTML = '';

    menuItems.forEach(item => {
        const menuItemElement = document.createElement('div');
        menuItemElement.className = 'menu-item';

        menuItemElement.innerHTML = `
        <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/300x200/e67e22/ffffff?text=${encodeURIComponent(item.name)}'">
        <div class="item-info">
            <h3>${item.name}</h3>
            <p class="item-description">${item.description}</p>
            <div class="item-price">₦${item.price.toLocaleString()}</div>
            <button class="btn btn-add" onclick="addToCart(${item.id})" style="border-radius: 5px; cursor: pointer; hover-color: #e67e22; background-color: #f39c12; color: white; padding: 10px 15px; border: none; transition: background-color 0.3s;">
                Add to Plate
            </button>        
        </div>

        `;

        menuContainer.appendChild(menuItemElement);
    });
}

// Function to add item to cart
function addToCart(itemId) {
    const item = menuItems.find(menuItem => menuItem.id === itemId);

    if (!item) {
        console.log('Item not found:', itemId);
        return;
    }

    // Check if item is already in the cart
    const existingItem = cart.find(cartItem => cartItem.id === itemId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    updateOrderDisplay();

    // Add visual feedback to button
    const button = event.target;
    const originalText = button.textContent;
    const originalColor = button.style.backgroundColor;

    button.textContent = 'Added!';
    button.style.backgroundColor = '#28a745';
    button.disabled = true;

    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = originalColor;
        button.disabled = false;
    }, 1000);
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateOrderDisplay();
}

// Update quantity of item in cart
function updateQuantity(itemId, change) {
    const item = cart.find(cartItem => cartItem.id === itemId);

    if (item) {
        item.quantity += change;

        // Remove item if quantity is zero
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            updateOrderDisplay();
        }
    }
}

// Update the order display
function updateOrderDisplay() {
    const emptyCartMessage = orderItemsContainer.querySelector('.empty-cart');

    if (cart.length === 0) {
        // Show empty cart message
        if (!emptyCartMessage) {
            orderItemsContainer.innerHTML = '<p class="empty-cart">Your plate is empty. Add some delicious meals!</p>';
        }
        submitOrderBtn.disabled = true;
        printOrderBtn.disabled = true;
    } else {
        // Clear container and show cart items
        orderItemsContainer.innerHTML = '';

        cart.forEach(item => {
            const orderItemElement = document.createElement('div');
            orderIdElement.className = 'order-item';

            orderItemElement.innerHTML = `
            <div class="order-item-info">
            <h4 class="order-item-name">${item.name}</h4>
            <p class="order-item-price">₦${item.price.toLocaleString()}</p>
            </div>
            <div class="order-item-controls">
            <div class="quantity-controls">
            <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
            <span class="quantity">${item.quantity}</span>
            <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
            <div class="item-total">₦${(item.price * item.quantity).toLocaleString()}</div>
            `;
            orderItemsContainer.appendChild(orderItemElement);
        });
        submitOrderBtn.disabled = false;
        printOrderBtn.disabled = false;
    }
    updateTotal();
}

// Calculate and update the total
function updateTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPriceElement.textContent = total.toLocaleString();
}

// Setup event listeners
function setupEventListeners() {
    submitOrderBtn.addEventListener('click', submitOrder);
    printOrderBtn.addEventListener('click', printOrder);

    //Modal close button
    const closeModel = document.querySelector('.close');
    closeModel.addEventListener('click', closeSuccessModal);

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === successModal) {
            closeSuccessModal();
        }
    });
}

// Function to submit order
function submitOrder() {
    // Validate cart has items
    if (cart.length === 0) {
        alert('Please add at least one item to your plate before submitting.');
        return;
    }

    // Show loading state
    showLoading();

    // Simulate order processing delay
    setTimeout(() => {
        // Generate a random order ID
        const orderId = 'MK' + Math.random().toString(36).substr(2, 6).toUpperCase();
        orderIdElement.textContent = orderId;

        // Hide loading state and show success modal
        hideLoading();
        successModal.style.display = 'block';

        // Clear cart after showing success
        setTimeout(() => {
            cart = [];
            updateOrderDisplay();
        }, 1500);

    }, 2000); // 2 seconds delay to simulate order processing
}

// Print order function
function printOrder() {
    if (cart.length === 0) {
        alert('Your plate is empty. Add some items before printing.');
        return;
    }

    // Create print content
    let printContent = `
    <div class="print-content">
    <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #e67e22; margin-bottom: 10px;">🍽️ Mama's Kitchen</h1>
    <p style="color: #666;">Order Summary</p>
    <hr style="border: 1px solid #e67e22; margin: 20px 0;">
    </div>

    <div style="margin-buttom: 30px;">
    `;    

    cart.forEach(item => {
        printContent += `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-buttom: 15px; padding: 10px; border-bottom: 1px solid #eee;">
        <div style="flex: 1;">
        <h4 style="margin: 0; color: #333;">${item.name}</h4>
        <p style="margin: 0; color: #e67e22; font-weight: bold;">₦${item.price.toLocaleString()} x ${item.quantity}</p>
        </div>
        <div style="text-align: right; font-weight: bold; color: #e67e22;">
        ₦${(item.price * item.quantity).toLocaleString()}
        </div>
        </div>        
        `;
    });

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    printContent += `
    </div>

    <hr style="border: 2px solid #e67e22; margin: 20px 0;">
    <div style="text-align: right; font-size: 24px; font-weight: bold; color: #e67e22; margin-bottom: 30px;">
    Total: ₦${total.toLocaleString()}
    </div>

    <div style="text-align: center; color: #666; font-size: 14px; line-height: 1.6;">
    <p><strong>Thank you for choosing Mama's Kitchen!</strong></p>
    <p>Order Date: ${new Date().toLocaleDateString()}</p>
    <p>Estimated Preparation Time: 10-15 minutes</p>
    <p style="margin-top: 20px; font-style: italic;">Enjoy your delicious meal! 🍽️</p>
    </div>

    </div>
    `;

    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Order Summary - Mama's Kitchen</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    margin: 0;
                    background: white; 
                }
                
                .print-content {
                    max-width: 600px;
                    margin: 0 auto;
                }
                
                @media print {
                    body { margin: 0; }
                    .print-content { margin: 0; }
                }
            </style>
        </head>
        <body>
            ${printContent}
            <script>
                window.onload = function() {
                    window.print();
                    window.onafterprint = function() {
                        window.close();
                    }
                } 
            </script>
        </body>
        </html>                   
    `);

    printWindow.document.close();
}

// Close success model
function closeSuccessModal() {
    successModal.style.display = 'none';
}

// Show loading animation for submit button
function showLoading() {
    submitOrderBtn.innerHTML = '<span style="margin-right: 8px;">⏳</span> Processing Order...';
    submitOrderBtn.disabled = true;
    submitOrderBtn.style.opacity = '0.7';
}

// Hide loading animation for submit button
function hideLoading() {
    submitOrderBtn.innerHTML = 'Submit Order';
    submitOrderBtn.disabled = false;
    submitOrderBtn.style.opacity = '1';    
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('mamasKitchenCart', JSON.stringify(cart));
}

// Load cart from LocalStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('mamasKitchenCart');
    if (savedCard) {
        cart = JSON.parse(savedCart);
        updateOrderDisplay();
    }
}

// Auto-save cart whenever it changes
function autoSaveCart() {
    saveCartToStorage();
}

