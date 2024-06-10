import { wsConnetion } from "../../data/connetion";
import { server_message } from "../../types/server_message";

export class WebsocketService {
  public readonly socket: WebSocket;
  private readonly logicOnMessage: (data: server_message) => void
  constructor(onMessage: (data: server_message) => void) {
    this.logicOnMessage = onMessage;
    this.socket = new WebSocket(`ws://${wsConnetion.url}:${wsConnetion.port}`);
    this.initSocket();
  }

  private initSocket () {
    this.socket.onmessage = this.onMessage;
    this.socket.onopen = () => {};
    this.socket.onerror = (er) => {console.error(er)};
  }

  private onMessage = (event: MessageEvent) => {
    if (event.data != "")
      try {
        const data = JSON.parse(event.data); 
        if (data?.action && data?.data)
          this.logicOnMessage(data);
        else
          console.error("Invalid data: ", data);
      } catch (error) {
        console.error(error);
      }
  }

  public sendMessage(data: server_message): void {
    this.socket.send(JSON.stringify(data));
  }
}
