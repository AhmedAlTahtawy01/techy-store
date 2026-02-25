import { loginUser, getSession } from "../utils/storage.js";

const form = document.getElementById("loginForm");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const successMessage = document.getElementById("successMessage");

const session = getSession();
if (session) {
    window.location.href = "../index.html";
}

function validateEmail() {
    const value = emailInput.value.trim();
    if (!value) {
        emailError.textContent = "Email is required";
        return false;
    }

    emailError.textContent = "";
    return true;
}

function validatePassword() {
    const value = passwordInput.value;
    if (!value) {
        passwordError.textContent = "Password is required";
        return false;
    }

    passwordError.textContent = "";
    return true;
}

document.querySelectorAll(".toggle-password").forEach(btn => {
    btn.addEventListener("click", () => {
        const input = document.getElementById(btn.dataset.target);
        if (input.type === "password") {
            input.type = "text";
            btn.textContent = "Hide";
        }
        else {
            input.type = "password";
            btn.textContent = "Show";
        }
    });
});

form.addEventListener("submit", (e) => {
    e.preventDefault();

    emailError.textContent = "";
    passwordError.textContent = "";

    const valid = validateEmail() && validatePassword();
    if (!valid) {
        return;
    }

    const result = loginUser(emailInput.value.trim(), passwordInput.value);
    if (!result.success) {
        emailError.textContent = result.message;
        passwordError.textContent = result.message;
        return;
    }

    successMessage.textContent = "Login successful";

    setTimeout(() => {
        window.location.href = "../index.html";
    }, 1000);
});

emailInput.addEventListener("input", validateEmail);
passwordInput.addEventListener("input", validatePassword);