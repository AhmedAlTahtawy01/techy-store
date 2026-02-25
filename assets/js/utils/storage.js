const USERS_KEY = "users";
const SESSION_KEY = "session";

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

    return {
        success: true,
        user
    };
}

export function setSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function getSession() {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
}

export function logout() {
    localStorage.removeItem(SESSION_KEY);
}