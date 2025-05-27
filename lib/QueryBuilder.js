"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
class QueryBuilder extends String {
    constructor(obj) {
        const build = (obj, parentKey) => {
            return Object.keys(obj)
                .map((key) => {
                const newKey = parentKey ? `${parentKey}[${key}]` : key;
                if (typeof obj[key] === "object" && obj[key] !== null) {
                    return build(obj[key], newKey); // Recursively build nested objects
                }
                else {
                    return `${newKey}=${encodeURIComponent(obj[key])}`; // Encode values
                }
            })
                .join('&');
        };
        super(build(obj, ''));
    }
}
exports.QueryBuilder = QueryBuilder;
