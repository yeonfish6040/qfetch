export declare const ContentTypeValues: readonly ["application/json", "application/xml", "application/pdf", "application/zip", "application/x-www-form-urlencoded", "application/octet-stream", "application/javascript", "application/ld+json", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "audio/mpeg", "audio/ogg", "audio/wav", "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml", "multipart/form-data", "text/plain", "text/html", "text/css", "text/javascript", "text/csv", "text/xml", "video/mp4", "video/mpeg", "video/ogg", "video/webm"];
export type ContentType = (typeof ContentTypeValues)[number];
export declare const FormattableContentTypeValues: string[];
export type FormattableContentType = (typeof FormattableContentTypeValues)[number];
export declare const HttpHeaderValues: readonly ["A-IM", "Accept", "Accept-Charset", "Accept-Datetime", "Accept-Encoding", "Accept-Language", "Access-Control-Request-Method", "Access-Control-Request-Headers", "Authorization", "Cache-Control", "Connection", "Content-Encoding", "Content-Length", "Content-MD5", "Content-Type", "Cookie", "Date", "Expect", "Forwarded", "From", "Host", "HTTP2-Settings", "If-Match", "If-Modified-Since", "If-None-Match", "If-Range", "If-Unmodified-Since", "Max-Forwards", "Origin", "Pragma", "Prefer", "Proxy-Authorization", "Range", "Referer", "TE", "Trailer", "Transfer-Encoding", "User-Agent", "Upgrade", "Via", "Warning"];
export type HttpHeader = (typeof HttpHeaderValues)[number];
export declare const HttpAuthorizeSchemaValues: readonly ["Basic", "Bearer", "Digest", "HOBA", "Mutual", "AWS4-HMAC-SHA256", "NTLM", "Negotiate", "OAuth", "SCRAM-SHA-1", "SCRAM-SHA-256", "apikey", "Token"];
export type HttpAuthorizeSchema = (typeof HttpAuthorizeSchemaValues)[number];
export interface HttpAuthorize {
    schema: HttpAuthorizeSchema;
    value: string;
}
export type HttpHeaderObject = {
    [key: HttpHeader | string]: string;
};
export declare const HttpRequestMethodValues: readonly ["GET", "HEAD", "POST", "PUT", "DELETE", "CONNECT", "OPTIONS", "TRACE", "PATCH"];
export type HttpRequestMethod = (typeof HttpRequestMethodValues)[number];
export type HttpRequestBody = {
    [key: string]: any;
};
export type HttpCookie = {
    [key: string]: string;
};
export interface HttpResponse<t = any> {
    ok: boolean;
    url: string;
    headers: Headers;
    status: number;
    statusText: string;
    bytes: Uint8Array | null;
    text: string | null;
    json: t | null;
    formData: FormData | null;
    flag: (header: string) => string;
}
