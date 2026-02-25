import { getSession, getUsers, logout, getCart } from "../utils/storage.js";
import { requireAuth } from "../utils/authGuard.js";

const session = requireAuth("login.html");
if (!session) return;

const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const authLink = document.getElementById("authLink");
const profileLink = document.getElementById("profileLink");
const cartCountElement = document.getElementById("cartCount");
const logoutBtn = document.querySelector(".btn-logout");

let name = session.name;
let email = session.email;
if (!name || !email) {
    const users = getUsers();
    const user = users.find(u => u.id === session.id);
    if (user) {
        name = user.name;
        email = user.email;
    }
}

profileName.textContent = name || "—";
profileEmail.textContent = email || "—";

profileLink.textContent = name || "Profile";
authLink.textContent = "Logout";
authLink.href = "#";

authLink.addEventListener("click", (e) => {
    e.preventDefault();
    logout();
    window.location.href = "login.html";
});

logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    logout();
    window.location.href = "login.html";
});

function updateCartCount() {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCountElement.textContent = total;
}

updateCartCount();
