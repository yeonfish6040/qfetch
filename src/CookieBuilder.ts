import {HttpCookie} from "./types";

export class CookieBuilder {
  private cookie: HttpCookie;

  constructor(cookieInit?: HttpCookie) {
    if (cookieInit)
      this.cookie = cookieInit;
    else
      this.cookie = {};
  }

  getCookies(): HttpCookie {
    return Object.fromEntries(
      Object.entries(this.cookie)
        .map(([k, v]) => [decodeURIComponent(k), decodeURIComponent(v)])
    );
  }

  getCookie(key: string): string {
    return decodeURIComponent(this.cookie[encodeURIComponent(key)]);
  }

  setCookie(key: string, value: string): CookieBuilder {
    this.cookie[encodeURIComponent(key)] = encodeURIComponent(value);
    return this;
  }

  delCookie(key: string): CookieBuilder {
    delete this.cookie[encodeURIComponent(key)];
    return this;
  }

  resetCookie(): CookieBuilder {
    this.cookie = {};
    return this;
  }

  build(): string {
    return Object.entries(this.cookie)
      .map((cookie) => cookie.join("="))
      .join("; ");
  }
}