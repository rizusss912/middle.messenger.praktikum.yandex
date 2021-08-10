import { ChangeChatReadyStateAction } from "../../store/actions/active-chats-actions";
import { Action } from "../../store/interfaces/action.interface"
import { webSocketReadyState } from "../../utils/api/web-socket-controller"
import { Subscription } from "../../utils/observeble/subscription";
import { ChatController } from "../active-chats.service";

export class ChatListener {
    private readonly chatId: number;
    private readonly controller: ChatController;
    private readonly dispatch: (action: Action) => void;

    private messagesSubscription: Subscription<{}> | undefined;
    private readyStateSubscription: Subscription<webSocketReadyState> | undefined;

    constructor(chatId: number, controller: ChatController, dispatch: (action: Action) => void) {
        this.chatId = chatId;
        this.controller = controller;
        this.dispatch = dispatch;
    }

    public unsubscribe(): void {
        if (this.messagesSubscription) {
            this.messagesSubscription.unsubscribe();
            this.messagesSubscription = undefined;
        }

        if (this.readyStateSubscription) {
            this.readyStateSubscription.unsubscribe();
            this.readyStateSubscription = undefined;
        }
    }

    public subscribe(): void {
        if (!this.messagesSubscription) {
            this.messagesSubscription = this.controller.$messages.subscribe(this.onMessageHandler.bind(this));
        }

        if (!this.readyStateSubscription) {
            this.readyStateSubscription = this.controller.$readyState.subscribe(this.onreadyStateChangeHandler.bind(this));
        }
    }

    private onMessageHandler(message: {}): void {
        // обробатываем сообщения через dispatch
        console.log('new message: ', message);
    }

    private onreadyStateChangeHandler(readyState: webSocketReadyState): void {
        this.dispatch(new ChangeChatReadyStateAction(this.chatId, readyState));
    }
}