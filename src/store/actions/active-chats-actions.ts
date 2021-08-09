import { WebSocketController } from "../../utils/api/web-socket-controller";
import { activeChatsActionType } from "../enums/active-chats-actions";
import { Action } from "../interfaces/action.interface";

export class AddActiveChatAction implements Action {
    public readonly type = activeChatsActionType.addActiveChat;
    public readonly payload: {chatId: number, controller: WebSocketController<{}, {}>};

    constructor(chatId: number, controller: WebSocketController<{}, {}>) {
        this.payload = {chatId, controller};
    }
}

export class RemoveActiveChatAction implements Action {
    public readonly type = activeChatsActionType.removeActiveChat;
    public readonly payload: number;

    constructor(chatId: number) {
        this.payload = chatId;
    }
}