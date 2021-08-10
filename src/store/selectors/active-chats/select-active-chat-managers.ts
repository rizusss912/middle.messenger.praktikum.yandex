import { ChatController } from "../../../service/active-chats.service";
import { ChatListener } from "../../../service/helpers/chat-listener";
import { State } from "../../interfaces/state.interface";

export function selectActiveChatManagers(state: State) {
    return state.activeChats.managers;
}

export function selectActiveChatController(state: State, chatId: number): ChatController | undefined {
    return selectActiveChatManagers(state)[chatId]?.controller;
}

export function selectActiveChatListener(state: State, chatId: number): ChatListener | undefined {
    return selectActiveChatManagers(state)[chatId]?.listener;
}