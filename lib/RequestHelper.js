"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestHelper = void 0;
const fs = __importStar(require("fs"));
const CookieBuilder_1 = require("./CookieBuilder");
const node_stream_1 = require("node:stream");
const QueryBuilder_1 = require("./QueryBuilder");
const streamToFile = (readableStream, writableStream) => {
    return new Promise((resolve, reject) => {
        node_stream_1.Readable.fromWeb(readableStream).pipe(writableStream);
        writableStream.on('finish', resolve);
        writableStream.on('error', reject);
    });
};
class RequestHelper {
    BASE_URL;
    CONTENT_TYPE;
    AUTHORIZATION;
    COOKIE;
    CUSTOM_HEADERS;
    constructor(baseURL) {
        this.BASE_URL = baseURL;
        this.CONTENT_TYPE = "";
        this.AUTHORIZATION = null;
        this.COOKIE = new CookieBuilder_1.CookieBuilder();
        this.CUSTOM_HEADERS = new Headers();
    }
    // GETTER ===============================================================================
    getBaseURL() {
        return this.BASE_URL;
    }
    getContentType() {
        return this.CONTENT_TYPE;
    }
    getHeaders() {
        return Object.fromEntries([...this.CUSTOM_HEADERS]);
    }
    getAuth() {
        return this.AUTHORIZATION;
    }
    getCookie() {
        return this.COOKIE.getCookies();
    }
    // SETTER ===============================================================================
    setBaseUrl(baseURL) {
        this.BASE_URL = baseURL;
        return this;
    }
    setContentType(contentType) {
        this.CONTENT_TYPE = contentType;
        return this;
    }
    addHeader(key, value) {
        this.CUSTOM_HEADERS.set(key, value);
        return this;
    }
    delHeader(key) {
        this.CUSTOM_HEADERS.delete(key);
        return this;
    }
    setHeader(obj) {
        this.CUSTOM_HEADERS = new Headers(obj);
        return this;
    }
    resetHeader() {
        this.CUSTOM_HEADERS = new Headers();
        return this;
    }
    setAuth(schema, value) {
        this.AUTHORIZATION = {
            schema,
            value
        };
        return this;
    }
    setBasicAuth(username, password) {
        const authString = Buffer.from(`${username}:${password}`).toString("base64");
        this.AUTHORIZATION = {
            schema: "Basic",
            value: authString,
        };
        return this;
    }
    setBearerAuth(token) {
        this.AUTHORIZATION = {
            schema: "Bearer",
            value: token,
        };
    }
    setTokenAuth(token) {
        this.AUTHORIZATION = {
            schema: "Token",
            value: token,
        };
    }
    resetAuth() {
        this.AUTHORIZATION = null;
        return this;
    }
    setCookie(key, value) {
        this.COOKIE.setCookie(key, value);
        return this;
    }
    delCookie(key) {
        this.COOKIE.delCookie(key);
        return this;
    }
    resetCookie() {
        this.COOKIE.resetCookie();
        return this;
    }
    // EXECUTES =============================================================================
    async sendRequest(method, path, body, customHeader, outputFile) {
        // build url
        let url = `${this.BASE_URL.endsWith("/") ? this.BASE_URL.substring(0, this.BASE_URL.length - 1) : this.BASE_URL}/${path.startsWith("/") ? path.substring(1, path.length) : path}`;
        if (path === "" && url.endsWith("/"))
            url = url.substring(0, url.length - 1);
        // header priority (one-time > custom setters(auth, content-type..) > fixed headers)
        // merge fixed headers(permanent header) and specific headers(one-time header)
        const requestHeader = new Headers(this.getHeaders());
        requestHeader.set("Cache-Control", "no-cache");
        if (this.CONTENT_TYPE)
            requestHeader.set("Content-Type", this.CONTENT_TYPE);
        if (this.AUTHORIZATION)
            requestHeader.set("Authorization", `${this.AUTHORIZATION.schema} ${this.AUTHORIZATION.value}`);
        if (Object.keys(this.COOKIE.getCookies()).length)
            requestHeader.set("Cookie", this.COOKIE.build());
        if (customHeader) {
            Object.entries(customHeader).forEach(([k, v]) => {
                requestHeader.set(k, v);
            });
        }
        let requestBody;
        if (body && typeof body !== "string") {
            switch (this.CONTENT_TYPE) {
                case "application/json":
                    requestBody = JSON.stringify(body);
                    break;
                case "application/x-www-form-urlencoded":
                    requestBody = Object.entries(body).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join("&");
                    break;
                case "multipart/form-data":
                    requestBody = body;
                    break;
                default:
                    requestBody = body.toString();
            }
        }
        else if (body)
            requestBody = body;
        const res = await fetch(url, {
            credentials: "include",
            headers: requestHeader,
            method: method,
            body: requestBody || undefined,
        });
        if (outputFile) {
            const stream = fs.createWriteStream(outputFile);
            await streamToFile(res.body, stream);
            return {
                ok: res.ok,
                url: res.url,
                headers: res.headers,
                status: res.status,
                statusText: res.statusText,
                bytes: null,
                text: null,
                json: null,
                formData: null,
                flag: () => "",
            };
        }
        else {
            let bytes;
            let text;
            let json;
            let formData;
            const formRegex = /((?<group>(?<key>[^=&]+)=(?<value>[^=&]+))&?)/g;
            try {
                bytes = await res.bytes();
            }
            catch (e) {
                console.error(e);
                bytes = null;
            }
            try {
                if (bytes !== null)
                    text = new TextDecoder().decode(bytes);
                else
                    throw Error();
            }
            catch (e) {
                text = null;
            }
            try {
                if (text !== null)
                    json = JSON.parse(text);
                else
                    throw Error();
            }
            catch (e) {
                json = null;
            }
            try {
                if (text !== null && formRegex.test(text)) {
                    formData = Object.fromEntries(text.split("&").map((e) => e.split("=")));
                }
                else
                    throw Error();
            }
            catch (e) {
                formData = null;
            }
            const extractFlags = (header) => {
                const flagRegex = new RegExp(`${header}\{[^\}]+\}`, "g");
                const matches = text.match(flagRegex);
                return matches ? matches[0] : "";
            };
            return {
                ok: res.ok,
                url: res.url,
                headers: res.headers,
                status: res.status,
                statusText: res.statusText,
                bytes,
                text,
                json,
                formData,
                flag: text ? extractFlags : () => "",
            };
        }
    }
    async get(path, query, customHeader, outputFile) {
        let queries = {};
        if (path.indexOf("?") !== -1 && path.split("?").length >= 2) {
            const query_in_path = path.split("?")[1].split("&").map((e) => e.split("="));
            queries = { ...Object.fromEntries(query_in_path), ...query };
            path = path.split("?")[0];
        }
        else {
            queries = { ...query };
        }
        if (Object.keys(queries).length >= 1) {
            path = `${path}?${new QueryBuilder_1.QueryBuilder(queries)}`;
        }
        return await this.sendRequest("GET", path, undefined, customHeader, outputFile);
    }
    async post(path, body, customHeader) {
        return await this.sendRequest("POST", path, body, customHeader);
    }
    async ihatepost(url, option) {
        return await fetch(url, option);
    }
    async put(path, body, customHeader) {
        return await this.sendRequest("PUT", path, body, customHeader);
    }
    async patch(path, body, customHeader) {
        return await this.sendRequest("PATCH", path, body, customHeader);
    }
    async delete(path, body, customHeader) {
        return await this.sendRequest("DELETE", path, body, customHeader);
    }
}
exports.RequestHelper = RequestHelper;
