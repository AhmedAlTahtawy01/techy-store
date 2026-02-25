import { getSession } from "./storage.js";

export function requireAuth(redirectTo = "login.html") {
    const session = getSession();

    if (!session) {
        window.location.href = redirectTo;
    }

    return session;
}

export function redirectIfAuthenticated(redirectTo = "../index.html") {
    const session = getSession();

    if (session) {
        window.location.href = redirectTo;
    }
}