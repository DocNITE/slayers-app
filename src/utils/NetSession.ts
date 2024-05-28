import { Socket } from "socket.io-client";

class NetSession {
    // Entity id what controlled by player
    public attachedEntity?: number | null;

    // Player socket
    public socket: Socket;

    constructor(socket: Socket) {
        this.attachedEntity = null;

        this.socket = socket;
    }
}

export default NetSession;