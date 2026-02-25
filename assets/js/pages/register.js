const form = document.getElementById("registerForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");

const strengthBar = document.getElementById("strengthBar");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");

const successMessage = document.getElementById("successMessage");

// Just simulating the hashing of the password
function hashPassword(password) {
    return btoa(password);
}

// Required & At least 3 characters
function validateName() {
    const value = nameInput.value.trim();

    if (!value) {
        nameError.textContent = "Name is required";
        return false;
    }

    if (value.length < 3) {
        nameError.textContent = "Name must be at least 3 characters";
        return false;
    }

    nameError.textContent = "";
    return true;
}

// Required & Valid email format
function validateEmail() {
    const value = emailInput.value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value) {
        emailError.textContent = "Email is required";
        return false;
    }

    if (!emailRegex.test(value)) {
        emailError.textContent = "Invalid email format";
        return false;
    }

    emailError.textContent = "";
    return true;
}

// Required & Min 6 characters & At least 1 letter and 1 number
function validatePassword() {
    const value = passwordInput.value;

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

    if (!value) {
        passwordError.textContent = "Password is required";
        return false;
    }

    if (!passwordRegex.test(value)) {
        passwordError.textContent = "Password must be 6 characters or more with letters and numbers";
        return false;
    }

    passwordError.textContent = "";
    return true;
}

// Must match password
function validateConfirmPassword() {
    const value = confirmPasswordInput.value;

    if (!value) {
        confirmPasswordError.textContent = "Confirm your password";
        return false;
    }

    if (value !== passwordInput.value) {
        confirmPasswordError.textContent = "Passowrds do not match";
        return false;
    }

    confirmPasswordError.textContent = "";
    return true;
}

function saveUser(user) {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const exists = users.some(u => u.email.toLowerCase() === user.email.toLowerCase());

    if (exists) {
        emailError.textContent = "Email already registered";
        return false;
    }

    users.push(user);

    localStorage.setItem("users", JSON.stringify(users));
    return true;
}

passwordInput.addEventListener("input", () => {
    validatePassword();

    const value = passwordInput.value;

    let strength = 0;

    if (!value) {
        strengthBar.className = "strength-bar";
        return;
    }

    if (value.length >= 6) {
        strength++;
    }

    if (/[a-z]/.test(value)) {
        strength++;
    }

    if (/[A-Z]/.test(value)) {
        strength++;
    }

    if (/[0-9]/.test(value)) {
        strength++;
    }

    if (/[^A-Za-z0-9]/.test(value)) {
        strength++;
    }

    strengthBar.className = "strength-bar";

    if (strength <= 2) {
        strengthBar.classList.add("weak");
    }
    else if (strength <= 4) {
        strengthBar.classList.add("medium");
    }
    else {
        strengthBar.classList.add("strong");
    }
});

document.querySelectorAll(".toggle-password").forEach(btn => {
    btn.addEventListener("click", () => {
        const target = document.getElementById(btn.dataset.target);

        if (target.type === "password") {
            target.type = "text";
            btn.textContent = "Hide";
        }
        else {
            target.type = "password";
            btn.textContent = "Show";
        }
    });
})


form.addEventListener("submit", (e) => {

    e.preventDefault();

    const valid = validateName() && validateEmail() && validatePassword() && validateConfirmPassword();

    if (valid) {
        const user = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            password: hashPassword(passwordInput.value)
        };

        const saved = saveUser(user);
        if (!saved) {
            return;
        }

        successMessage.textContent = "Registeration successful";

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);
    }
    else {
        successMessage.textContent = "";
    }
});

nameInput.addEventListener("input", validateName);
emailInput.addEventListener("input", validateEmail);
confirmPasswordInput.addEventListener("input", validateConfirmPassword);