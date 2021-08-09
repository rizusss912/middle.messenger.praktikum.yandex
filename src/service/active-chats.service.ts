import { AddActiveChatAction, RemoveActiveChatAction } from "../store/actions/active-chats-actions";
import { selectActiveChatController } from "../store/selectors/active-chats/select-active-chat-controller";
import { selectUserId } from "../store/selectors/authorization/select-user-id";
import { selectChatToken } from "../store/selectors/chats/select-chat-token";
import { Store } from "../store/store";
import { WebSocketController } from "../utils/api/web-socket-controller";
import { API_SERVER } from "./api/http-client.facade";
import { AuthService } from "./auth.service";
import { ChatsService } from "./chats.service";

let instance: ActiveChatsService;

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
    }

    public conectToChat(chatId: number): Promise<void> {
        return Promise.all([
            this.chatsService.uploadTokenForChatIfNot(chatId),
            this.authService.uploadUserDataIfNot(),
        ])
            .then(() => {
                const token = selectChatToken(this.store.state, chatId)!;
                const userId = selectUserId(this.store.state)!;

                this.store.dispatch(new AddActiveChatAction(
                    chatId,
                    this.createChatController(userId, chatId, token),
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

        if(controller) {
            controller.close();
        }

        this.store.dispatch(new RemoveActiveChatAction(chatId));
    }

    private createChatController(userId: number, chatId: number, token: string): WebSocketController<{}, {}> {
        return new WebSocketController(`wss://${API_SERVER}/ws/chats/${userId}/${chatId}/${token}`);
    }
}