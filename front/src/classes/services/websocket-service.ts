import { wsConnetion } from "../../data/connetion";

export class WebsocketService {
  public readonly socket: WebSocket;
  private readonly logicOnMessage: (data: unknown) => void
  constructor(onMessage: (data: unknown) => void) {
    this.logicOnMessage = onMessage;
    this.socket = new WebSocket(`ws://${wsConnetion.url}:${wsConnetion.port}`);
    this.initSocket();
  }

  private initSocket () {
    this.socket.onmessage = this.onMessage;
    this.socket.onopen = (ev) => {console.log(ev)};
    this.socket.onerror = () => {};
  }

  private onMessage = (event: MessageEvent) => {
    if (event.data != "")
      try {
        const data = JSON.parse(event.data); //PHP sends Json data
        this.logicOnMessage(data);
      } catch (error) {
        console.error(error);
        //console.log(ev.data);
      }
  }

  public sendMessage(data: unknown): void {
    this.socket.send(JSON.stringify(data));
  }
}
