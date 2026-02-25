import { products } from "../data/products.js";
import { getSession, logout, getCart, saveCart } from "../utils/storage.js";

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const productContent = document.getElementById("productContent");
const productNotFound = document.getElementById("productNotFound");

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

function getCategoryLabel(category) {
    const labels = {
        phone: "Phones",
        laptop: "Laptops",
        console: "Consoles",
        accessory: "Accessories",
        device: "Devices"
    };
    return labels[category] || category;
}

function updateCartCount() {
    const cartCountElement = document.getElementById("cartCount");
    if (cartCountElement) {
        const cart = getCart();
        const total = cart.reduce((sum, item) => sum + item.qty, 0);
        cartCountElement.textContent = total;
    }
}

function renderProduct(product) {
    const stock = product.stock ?? 0;
    const inStock = stock > 0;

    productContent.innerHTML = `
        <div class="product-detail-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-detail-info">
            <h1>${product.name}</h1>
            <p class="product-detail-price">$${product.price}</p>
            <div class="product-detail-meta">
                <span><strong>Stock:</strong> ${stock} in stock</span>
                <span><strong>Category:</strong> ${getCategoryLabel(product.category)}</span>
            </div>
            ${product.description ? `<p class="product-detail-description">${product.description}</p>` : ""}
            <button type="button" class="product-add-btn" data-id="${product.id}" ${!inStock ? "disabled" : ""}>
                ${inStock ? "Add to Cart" : "Out of Stock"}
            </button>
        </div>
    `;

    const addBtn = productContent.querySelector(".product-add-btn");
    if (addBtn && inStock) {
        addBtn.addEventListener("click", () => {
            const cart = getCart();
            const existing = cart.find(item => item.id === product.id);

            if (existing) {
                if (existing.qty >= stock) return;
                existing.qty++;
            } else {
                cart.push({ id: product.id, qty: 1 });
            }

            saveCart(cart);
            updateCartCount();

            addBtn.textContent = "Added";
            addBtn.classList.add("added");
            setTimeout(() => {
                addBtn.textContent = "Add to Cart";
                addBtn.classList.remove("added");
            }, 1500);
        });
    }
}

if (productId) {
    const product = products.find(p => p.id === productId);

    if (product) {
        document.title = `Techy | ${product.name}`;
        renderProduct(product);
    } else {
        productContent.style.display = "none";
        productNotFound.style.display = "block";
    }
} else {
    productContent.style.display = "none";
    productNotFound.style.display = "block";
}

updateCartCount();
