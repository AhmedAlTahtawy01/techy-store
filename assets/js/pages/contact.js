import { getSession, getCart, logout } from "../utils/storage.js";

const session = getSession();
const authLink = document.getElementById("authLink");
const profileLink = document.getElementById("profileLink");
const cartCountElement = document.getElementById("cartCount");

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
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCountElement.textContent = total;
}

updateCartCount();

// Contact form
const contactForm = document.getElementById("contactForm");
const nameInput = document.getElementById("contactName");
const emailInput = document.getElementById("contactEmail");
const messageInput = document.getElementById("contactMessage");
const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const messageError = document.getElementById("messageError");
const successMessage = document.getElementById("contactSuccess");

function clearErrors() {
    nameError.textContent = "";
    emailError.textContent = "";
    messageError.textContent = "";
    successMessage.textContent = "";
}

contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    let valid = true;

    if (!nameInput.value.trim()) {
        nameError.textContent = "Name is required";
        valid = false;
    }

    if (!emailInput.value.trim()) {
        emailError.textContent = "Email is required";
        valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
        emailError.textContent = "Enter a valid email";
        valid = false;
    }

    if (!messageInput.value.trim()) {
        messageError.textContent = "Message is required";
        valid = false;
    }

    if (!valid) return;

    successMessage.textContent = "Thank you! Your message has been sent. We'll get back to you soon.";
    successMessage.style.color = "var(--success)";
    contactForm.reset();
});
