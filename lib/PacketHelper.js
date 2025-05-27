"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacketHelper = void 0;
class PacketHelper {
    packet;
    /** milliseconds */
    timeout;
    constructor(packet = "") {
        this.packet = packet;
        this.timeout = 1000;
    }
    async connect() {
    }
}
exports.PacketHelper = PacketHelper;
