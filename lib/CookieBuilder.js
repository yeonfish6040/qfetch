"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookieBuilder = void 0;
class CookieBuilder {
    cookie;
    constructor(cookieInit) {
        if (cookieInit)
            this.cookie = cookieInit;
        else
            this.cookie = {};
    }
    getCookies() {
        return Object.fromEntries(Object.entries(this.cookie)
            .map(([k, v]) => [decodeURIComponent(k), decodeURIComponent(v)]));
    }
    getCookie(key) {
        return decodeURIComponent(this.cookie[encodeURIComponent(key)]);
    }
    setCookie(key, value) {
        this.cookie[encodeURIComponent(key)] = encodeURIComponent(value);
        return this;
    }
    delCookie(key) {
        delete this.cookie[encodeURIComponent(key)];
        return this;
    }
    resetCookie() {
        this.cookie = {};
        return this;
    }
    build() {
        return Object.entries(this.cookie)
            .map((cookie) => cookie.join("="))
            .join("; ");
    }
}
exports.CookieBuilder = CookieBuilder;
