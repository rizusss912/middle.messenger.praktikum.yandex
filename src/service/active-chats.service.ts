import { AddActiveChatAction, RemoveActiveChatAction } from "../store/actions/active-chats-actions";
import { Action } from "../store/interfaces/action.interface";
import { selectActiveChatController, selectActiveChatListener } from "../store/selectors/active-chats/select-active-chat-managers";
import { selectUserId } from "../store/selectors/authorization/select-user-id";
import { selectChatToken } from "../store/selectors/chats/select-chat-token";
import { Store } from "../store/store";
import { WebSocketController } from "../utils/api/web-socket-controller";
import { API_SERVER } from "./api/http-client.facade";
import { AuthService } from "./auth.service";
import { ChatsService } from "./chats.service";
import { ChatListener } from "./helpers/chat-listener";

let instance: ActiveChatsService;

//TODO: Описать типы для сообщений
export type ChatController = WebSocketController<{}, {}>;

export class ActiveChatsService {
    private readonly store: Store;
    private readonly chatsService: ChatsService;
    private readonly authService: AuthService;

    constructor() {
        if (instance) return instance;

        instance = this;

        this.store = new Store();
        this.chatsService = new ChatsService();
        this.authService = new AuthService();

        window.state = () => this.store.state;
        window.send = () => this.sendToChat(269, "ещё раз привет");
    }

    public conectToChat(chatId: number): Promise<void> {
        return Promise.all([
            this.chatsService.uploadTokenForChatIfNot(chatId),
            this.authService.uploadUserDataIfNot(),
        ])
            .then(() => {
                const token = selectChatToken(this.store.state, chatId)!;
                const userId = selectUserId(this.store.state)!;
                const controller = this.createChatController(userId, chatId, token);
                const listener = this.createChatListener(chatId, controller);

                listener.subscribe();
                controller.open();

                this.store.dispatch(new AddActiveChatAction(
                    chatId,
                    controller,
                    listener,
                ));
            })
    }

    public async sendToChat(chatId: number, message: string): Promise<void> {
        let controller = selectActiveChatController(this.store.state, chatId);

        if (!controller) {
            await this.conectToChat(chatId);

            controller = selectActiveChatController(this.store.state, chatId);
        }

        controller!.send({content: message, type: "message"});
    }

    public disconnectToChat(chatId: number): void {
        const controller = selectActiveChatController(this.store.state, chatId);
        const listener = selectActiveChatListener(this.store.state, chatId);

        if(controller) {
            controller.close();
        }

        if (listener) {
            listener.unsubscribe();
        }

        this.store.dispatch(new RemoveActiveChatAction(chatId));
    }

    private createChatController(userId: number, chatId: number, token: string): ChatController {
        return new WebSocketController(`wss://${API_SERVER}/ws/chats/${userId}/${chatId}/${token}`);
    }

    public createChatListener(chatId: number, controller: ChatController): ChatListener {
        return new ChatListener(chatId, controller, (action: Action) => this.store.dispatch(action));
    }
}