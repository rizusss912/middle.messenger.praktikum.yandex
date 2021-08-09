import { Observable } from "../observeble/observeble";
import { Subject } from "../observeble/subject";

enum webSocketReadyState {
    CONNECTING = 0,
    OPEN = 1,
    CLOSING = 2,
    CLOSED = 3,
}

export class WebSocketController<pushMessage, incomingMessage> {
    private readonly url: string;
    private _$isOpen: Subject<boolean> = new Subject<boolean>(false);
    private _$messages: Subject<incomingMessage> = new Subject<incomingMessage>();
    private soket: WebSocket;
    private messagesWaitingForOpening: pushMessage[] = [];

    constructor(url: string, needOpen: boolean = true) {
        this.url = url;

        if (needOpen) this.open();
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

        this.soket.onopen = (event: Event) => this.onOpenHandler(event);
        this.soket.onclose = (event: CloseEvent) => this.onCloseHandler(event);
        this.soket.onmessage = (event: MessageEvent) => this.onMessageHandler(event);
        this.soket.onerror = (event: Event) => this.onErrorHandler(event);
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
        console.log('onOpenHandler', _event);
        if(this.messagesWaitingForOpening.length) {
            for (let message of this.messagesWaitingForOpening) {
                this.send(message);
            }

            this.messagesWaitingForOpening = [];
        }

        this._$isOpen.next(true);
    }

    private onCloseHandler(_event: CloseEvent): void {
        console.log('onCloseHandler', _event);
        this._$isOpen.next(false);
    }

    private onErrorHandler(_event: Event): void {
        console.log('onErrorHandler', _event);
    }

    private onMessageHandler(_event: MessageEvent<incomingMessage>): void {
        console.log('onMessageHandler', _event);
        this._$messages.next(_event.data);
    }
}