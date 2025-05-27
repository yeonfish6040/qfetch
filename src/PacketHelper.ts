import * as net from "net";

export class PacketHelper {
  private packet: string;
  /** milliseconds */
  private timeout: number;

  constructor(packet = "") {
    this.packet = packet;

    this.timeout = 1000;
  }

  async connect() {

  }
}