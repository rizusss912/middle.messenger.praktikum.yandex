import { WebSocketController } from "../../../utils/api/web-socket-controller";
import { activeChatsControllers } from "../../interfaces/active-chats-state.interface";
import { State } from "../../interfaces/state.interface";

function selectActiveChatControllers(state: State): activeChatsControllers {
    return state.activeChats.controllers;
}

export function selectActiveChatController(state: State, chatId: number): WebSocketController<{}, {}> | undefined {
    return selectActiveChatControllers(state)[chatId];
}