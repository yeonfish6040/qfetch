export declare class PacketHelper {
    private packet;
    /** milliseconds */
    private timeout;
    constructor(packet?: string);
    connect(): Promise<void>;
}
