import { products } from "../data/products.js";
import { getSession, logout, getCart, saveCart } from "../utils/storage.js";

const cartItemsContainer = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");
const cartSummary = document.getElementById("cartSummary");
const totalAmountEl = document.getElementById("totalAmount");
const buyNowBtn = document.getElementById("buyNowBtn");
const orderPopup = document.getElementById("orderPopup");
const closePopupBtn = document.getElementById("closePopupBtn");

const session = getSession();
const authLink = document.getElementById("authLink");
const profileLink = document.getElementById("profileLink");

if (session) {
    profileLink.textContent = session.name;
    authLink.textContent = "Logout";
    authLink.href = "#";

    authLink.addEventListener("click", (e) => {
        e.preventDefault();
        logout();
        window.location.href = "login.html";
    });
} else {
    profileLink.textContent = "Profile";
    authLink.textContent = "Login";
    authLink.href = "login.html";
}

function updateCartCount() {
    const cartCountElement = document.getElementById("cartCount");
    if (cartCountElement) {
        const cart = getCart();
        const total = cart.reduce((sum, item) => sum + item.qty, 0);
        cartCountElement.textContent = total;
    }
}

function getProductById(id) {
    return products.find(p => p.id === id);
}

function renderCart() {
    const cart = getCart();
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        cartEmpty.style.display = "block";
        cartSummary.style.display = "none";
        return;
    }

    cartEmpty.style.display = "none";
    cartSummary.style.display = "block";

    let total = 0;

    cart.forEach(item => {
        const product = getProductById(item.id);
        if (!product) return;

        const subtotal = product.price * item.qty;
        total += subtotal;
        const stock = product.stock ?? 999;
        const canIncrease = item.qty < stock;

        const card = document.createElement("div");
        card.className = "cart-card";
        card.dataset.id = product.id;
        card.innerHTML = `
            <div class="cart-card-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="cart-card-info">
                <h3 class="cart-card-name">${product.name}</h3>
                <p class="cart-card-price">$${product.price}</p>
                <div class="cart-card-quantity">
                    <button type="button" class="quantity-btn minus-btn" aria-label="Decrease quantity">−</button>
                    <span class="quantity-value">${item.qty}</span>
                    <button type="button" class="quantity-btn plus-btn" ${!canIncrease ? "disabled" : ""} aria-label="Increase quantity">+</button>
                </div>
            </div>
            <div class="cart-card-subtotal">$${subtotal}</div>
        `;

        const minusBtn = card.querySelector(".minus-btn");
        const plusBtn = card.querySelector(".plus-btn");
        const qtyValue = card.querySelector(".quantity-value");
        const subtotalEl = card.querySelector(".cart-card-subtotal");

        minusBtn.addEventListener("click", () => {
            const cart = getCart();
            const cartItem = cart.find(c => c.id === product.id);
            if (!cartItem) return;

            if (cartItem.qty <= 1) {
                const newCart = cart.filter(c => c.id !== product.id);
                saveCart(newCart);
            } else {
                cartItem.qty--;
                saveCart(cart);
            }
            updateCartCount();
            renderCart();
        });

        plusBtn.addEventListener("click", () => {
            if (!canIncrease) return;
            const cart = getCart();
            const cartItem = cart.find(c => c.id === product.id);
            if (!cartItem || cartItem.qty >= stock) return;

            cartItem.qty++;
            saveCart(cart);
            updateCartCount();
            renderCart();
        });

        cartItemsContainer.appendChild(card);
    });

    totalAmountEl.textContent = `$${total}`;
}

buyNowBtn.addEventListener("click", () => {
    if (!session) {
        window.location.href = "login.html";
        return;
    }

    const cart = getCart();
    if (cart.length === 0) return;

    saveCart([]);
    updateCartCount();
    renderCart();

    orderPopup.classList.add("active");
    orderPopup.setAttribute("aria-hidden", "false");
});

closePopupBtn.addEventListener("click", () => {
    orderPopup.classList.remove("active");
    orderPopup.setAttribute("aria-hidden", "true");
});

orderPopup.addEventListener("click", (e) => {
    if (e.target === orderPopup) {
        orderPopup.classList.remove("active");
        orderPopup.setAttribute("aria-hidden", "true");
    }
});

renderCart();
updateCartCount();
