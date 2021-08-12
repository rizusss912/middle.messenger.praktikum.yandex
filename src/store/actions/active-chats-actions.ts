import {ChatController} from '../../service/active-chats.service';
import {ChatListener} from '../../service/helpers/chat-listener';
import {webSocketReadyState} from '../../utils/api/web-socket-controller';
import {activeChatsActionType} from '../enums/active-chats-actions';
import {Action} from '../interfaces/action.interface';

export class AddActiveChatAction implements Action {
    public readonly type = activeChatsActionType.addActiveChat;
    public readonly payload: {
        chatId: number,
        controller: ChatController,
        listener: ChatListener,
    };

    constructor(chatId: number, controller: ChatController, listener: ChatListener) {
    	this.payload = {chatId, controller, listener};
    }
}

export class RemoveActiveChatAction implements Action {
    public readonly type = activeChatsActionType.removeActiveChat;
    public readonly payload: number;

    constructor(chatId: number) {
    	this.payload = chatId;
    }
}

export class ChangeChatReadyStateAction implements Action {
    public readonly type = activeChatsActionType.changeChatReadyState;
    public readonly payload: {
        chatId: number,
        readyState: webSocketReadyState,
    };

    constructor(chatId: number, readyState: webSocketReadyState) {
    	this.payload = {chatId, readyState};
    }
}
