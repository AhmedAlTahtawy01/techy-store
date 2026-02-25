import { products } from "../data/products.js";
import { getSession, logout, getCart, saveCart } from "../utils/storage.js";

const session = getSession();
const authLink = document.getElementById("authLink");

if (session) {
    authLink.textContent = "Logout";
    authLink.href = "#";

    authLink.addEventListener("click", (e) => {
        e.preventDefault();
        logout();
        window.location.href = "pages/login.html";
    });
}
else {
    authLink.textContent = "Login";
    authLink.href = "pages/login.html";
}

const productsContainer = document.getElementById("productsContainer");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const priceFilter = document.getElementById("priceFilter");


function renderProducts(list) {
    productsContainer.innerHTML = "";

    if (list.length === 0) {
        productsContainer.innerHTML =
            `<p class="text-center">No products found</p>`;
        return;
    }

    list.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <img 
                src="${product.image}"
                alt="${product.name}">

            <h3>${product.name}</h3>
            <p class="price">$${product.price}</p>
            
            <div class="actions">
                <a 
                    href="pages/product.html?id=${product.id}" 
                    class="details-btn btn-secondary">
                    Details
                </a>
                
                <button 
                    class="card-btn add-card-btn" 
                    data-id="${product.id}">
                    Add to Cart
                </button>
            </div>
            `;

        productsContainer.appendChild(card);
    });
}

searchInput.addEventListener("input", applyFilters);

categoryFilter.addEventListener("change", applyFilters);
priceFilter.addEventListener("change", applyFilters);

function applyFilters() {
    let list = [...products];

    const searchValue = searchInput.value.toLowerCase();
    const categoryValue = categoryFilter.value;
    const priceValue = priceFilter.value;

    if (searchValue) {
        list = list.filter(p => p.name.toLowerCase().includes(searchValue));
    }

    if (categoryValue !== "all") {
        list = list.filter(p => p.category === categoryValue);
    }

    if (priceValue !== "all") {

        switch (priceValue) {
            case "0-500":
                list = list.filter(p => p.price <= 500);
                break;

            case "500-1000":
                list = list.filter(p => p.price > 500 && p.price <= 1000);
                break;

            case "1000-2000":
                list = list.filter(p => p.price > 1000 && p.price <= 2000);
                break;

            case "2000+":
                list = list.filter(p => p.price > 2000);
                break;
        }
    }

    renderProducts(list);
}

productsContainer.addEventListener("click", (e) => {

    if (!e.target.classList.contains("add-card-btn")) {
        return;
    }

    const id = e.target.dataset.id;
    const cart = getCart();
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.qty++;
    }
    else {
        cart.push({
            id,
            qty: 1
        });
    }

    saveCart(cart);
    updateCartCount();

    e.target.textContent = "Added";

    setTimeout(() => {
        e.target.textContent = "Add to Cart";
    }, 1000);
});

const slides = document.querySelectorAll(".slide");
let currentSlide = 0;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
    });
}

function nextSlide() {
    currentSlide++;
    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }

    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide--;
    if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }

    showSlide(currentSlide);
}

if (slides.length > 0) {
    showSlide(currentSlide);
    setInterval(nextSlide, 4000);
}

document.querySelector(".next")?.addEventListener("click", nextSlide);
document.querySelector(".prev")?.addEventListener("click", prevSlide);


const cartCountElement = document.getElementById("cartCount");

function updateCartCount() {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + item.qty, 0);

    cartCountElement.textContent = total;
}

updateCartCount();

renderProducts(products);