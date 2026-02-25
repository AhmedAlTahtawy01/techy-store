const USERS_KEY = "users";
const SESSION_KEY = "session";
const CART_PREFIX = "cart_";
const GUEST_CART_KEY = "cart_guest";

export function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function setUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function emailExists(email) {
    const users = getUsers();
    return users.some(user => user.email.toLowerCase() === email.toLowerCase());
}

export function hashPassword(password) {
    return btoa(password);
}

export function registerUser({ name, email, password }) {
    if (emailExists(email)) {
        return {
            success: false,
            message: "Email already registered"
        };
    }

    const users = getUsers();
    const newUser = {
        id: crypto.randomUUID(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashPassword(password)
    };

    users.push(newUser);

    setUsers(users);

    return {
        success: true,
        user: newUser
    };
}

export function loginUser(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user || user.password !== hashPassword(password)) {
        return {
            success: false,
            message: "User or password wrong"
        };
    }

    setSession(user);
    mergeGuestCartIntoUser(user.id);

    return {
        success: true,
        user
    };
}

export function setSession(user) {
    const session = { id: user.id, name: user.name, email: user.email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSession() {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
}

export function logout() {
    localStorage.removeItem(SESSION_KEY);
}

function getCartKey() {
    const session = getSession();
    return session ? `${CART_PREFIX}${session.id}` : GUEST_CART_KEY;
}

export function getCart() {
    const key = getCartKey();
    return JSON.parse(localStorage.getItem(key)) || [];
}

export function saveCart(cart) {
    const key = getCartKey();
    localStorage.setItem(key, JSON.stringify(cart));
}

function getCartByKey(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function saveCartByKey(key, cart) {
    localStorage.setItem(key, JSON.stringify(cart));
}

function mergeGuestCartIntoUser(userId) {
    const guestCart = getCartByKey(GUEST_CART_KEY);
    if (guestCart.length === 0) return;

    const userCartKey = `${CART_PREFIX}${userId}`;
    const userCart = getCartByKey(userCartKey);

    const merged = [...userCart];
    for (const guestItem of guestCart) {
        const existing = merged.find(item => item.id === guestItem.id);
        if (existing) {
            existing.qty += guestItem.qty;
        } else {
            merged.push({ id: guestItem.id, qty: guestItem.qty });
        }
    }

    saveCartByKey(userCartKey, merged);
    localStorage.removeItem(GUEST_CART_KEY);
}