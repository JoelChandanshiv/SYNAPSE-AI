import * as sdk from "matrix-js-sdk";

type Room = {
  id: string;
  name: string;
  unread: number;
};

type Message = {
  id: string;
  roomId: string;
  sender: string;
  text: string;
  timestamp: string;
};

class MatrixClient {
  private client: any = null;
  private hs = "https://joeldc.duckdns.org";
  private server = "joeldc.duckdns.org";
  private listenerAttached = false;

  async login(username: string, password: string) {
    if (!username || !password) {
      return { success: false, error: "Missing credentials" };
    }

    const mxid = username.startsWith("@")
      ? username
      : `@${username}:${this.server}`;

    try {
      const temp = sdk.createClient({ baseUrl: this.hs });

      const res = await temp.login("m.login.password", {
        identifier: { type: "m.id.user", user: mxid },
        password,
      });

      this.client = sdk.createClient({
        baseUrl: this.hs,
        accessToken: res.access_token,
        userId: res.user_id,
      });

      this.client.startClient({ initialSyncLimit: 30 });
      await this.waitForSync();

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  async getRooms(): Promise<Room[]> {
    if (!this.client) return [];
    return this.client.getRooms().map((r: any) => ({
      id: r.roomId,
      name: r.name || r.roomId,
      unread: r.getUnreadNotificationCount("total"),
    }));
  }

  async getMessages(roomId: string): Promise<Message[]> {
    const room = this.client?.getRoom(roomId);
    if (!room) return [];

    return room.getLiveTimeline().getEvents()
      .filter((e: any) => e.getType() === "m.room.message")
      .map((e: any) => ({
        id: e.getId(),
        roomId,
        sender: e.getSender(),
        text: e.getContent()?.body || "",
        timestamp: new Date(e.getTs()).toLocaleString(),
      }));
  }

  onNewMessage(cb: (m: Message) => void) {
    if (!this.client || this.listenerAttached) return;
    this.listenerAttached = true;

    this.client.on("Room.timeline", (e: any, room: any, toStart: boolean) => {
      if (toStart || e.getType() !== "m.room.message") return;
      cb({
        id: e.getId(),
        roomId: room.roomId,
        sender: e.getSender(),
        text: e.getContent()?.body || "",
        timestamp: new Date(e.getTs()).toLocaleString(),
      });
    });
  }

  logout() {
    this.client?.stopClient();
    this.client = null;
    this.listenerAttached = false;
  }

  private waitForSync() {
    return new Promise<void>((res) => {
      this.client.once("sync", (s: string) => {
        if (s === "PREPARED") res();
      });
    });
  }
}

export const matrixClient = new MatrixClient();

