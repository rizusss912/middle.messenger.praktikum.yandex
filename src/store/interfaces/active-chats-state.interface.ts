import {ChatController} from '../../service/active-chats.service';
import {ChatListener} from '../../service/helpers/chat-listener';
import {webSocketReadyState} from '../../utils/api/web-socket-controller';

export type activeChatsManagers = {
    [chatId: number]: {
        controller: ChatController,
        listener: ChatListener,
    },
};

export type chatsReadyStates = {
    [chatId: number]: webSocketReadyState,
}

export interface ActiveChatsState {
    managers: activeChatsManagers;
    chatsReadyStates: chatsReadyStates,
}
