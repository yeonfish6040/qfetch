import { HttpCookie } from "./types";
export declare class CookieBuilder {
    private cookie;
    constructor(cookieInit?: HttpCookie);
    getCookies(): HttpCookie;
    getCookie(key: string): string;
    setCookie(key: string, value: string): CookieBuilder;
    delCookie(key: string): CookieBuilder;
    resetCookie(): CookieBuilder;
    build(): string;
}
