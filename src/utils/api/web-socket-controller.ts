import { Observable } from "../observeble/observeble";
import { Subject } from "../observeble/subject";

export enum webSocketReadyState {
    CONNECTING = 0,
    OPEN = 1,
    CLOSING = 2,
    CLOSED = 3,
}

export class WebSocketController<pushMessage, incomingMessage> {
    private readonly url: string;
    private readonly _$readyState: Subject<webSocketReadyState> = new Subject<webSocketReadyState>();
    private _$messages: Subject<incomingMessage> = new Subject<incomingMessage>();
    private soket: WebSocket;
    private messagesWaitingForOpening: pushMessage[] = [];

    constructor(url: string) {
        this.url = url;
    }

    public get $readyState(): Observable<webSocketReadyState> {
        return this._$readyState.asObserveble();
    }

    public get $messages(): Observable<incomingMessage> {
        return this._$messages.asObserveble();
    }

    public open(): void {
        if (this.soket
            && (
                this.soket.readyState === webSocketReadyState.CONNECTING
                || this.soket.readyState === webSocketReadyState.OPEN
            )
        ) return;

        this.soket = new WebSocket(this.url);
        this.updateState();

        this.soket.onopen = this.onOpenHandler.bind(this);
        this.soket.onclose = this.onCloseHandler.bind(this);
        this.soket.onmessage = this.onMessageHandler.bind(this);
        this.soket.onerror = this.onErrorHandler.bind(this);
    }

    public send(message: pushMessage): void {
        if(!this.soket || this.soket.readyState !== webSocketReadyState.OPEN) {
            this.messagesWaitingForOpening.push(message);
            this.open();

            return;
        }

        this.soket.send(JSON.stringify(message));
    }

    public close(): void {
        if (this.soket) this.soket.close();
    }

    private onOpenHandler(_event: Event): void {
        this.updateState();
        if(this.messagesWaitingForOpening.length) {
            for (let message of this.messagesWaitingForOpening) {
                this.send(message);
            }

            this.messagesWaitingForOpening = [];
        }
    }

    private onCloseHandler(_event: CloseEvent): void {
        this.updateState();
    }

    private onErrorHandler(_event: Event): void {
        this.updateState();
    }

    private onMessageHandler(_event: MessageEvent<incomingMessage>): void {
        this._$messages.next(_event.data);
    }

    private updateState(): void {
        if (this.soket) this._$readyState.next(this.soket.readyState);
    }
}