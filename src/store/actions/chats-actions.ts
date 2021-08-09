import { chatsActionType } from "../enums/chats-action-type.enum";
import { Action } from "../interfaces/action.interface";
import { 
    addChatUsers,
    chatsList,
    chatToken,
    createChat,
    deleteChat,
    deleteChatUsers } from "../interfaces/chats-state.interface";

export class UploadChatListAction implements Action {
    public readonly type = chatsActionType.chatListUpload;
}

export class UploadedChatListAction implements Action {
    public readonly type = chatsActionType.chatListUploaded;
    public readonly payload: chatsList;
    
    constructor(chatsList: chatsList) {
        this.payload = chatsList;
    }
}

export class UploadErrorChatListAction implements Action {
    public readonly type = chatsActionType.chatListUploadError;
    public readonly payload: Error;

    constructor(error: Error) {
        this.payload = error;
    }
}

export class UploadСreateChatAction implements Action {
    public readonly type = chatsActionType.createChatUpload;
}

export class UploadedСreateChatAction implements Action {
    public readonly type = chatsActionType.createChatUploaded;
    public readonly payload: createChat = undefined;
}

export class UploadErrorСreateChatAction implements Action {
    public readonly type = chatsActionType.createChatUploadError;
    public readonly payload: Error;

    constructor(error: Error) {
        this.payload = error;
    }
}

export class UploadDeleteChatAction implements Action {
    public readonly type = chatsActionType.deleteChatUpload;
}

export class UploadedDeleteChatAction implements Action {
    public readonly type = chatsActionType.deleteChatUploaded;
    public readonly payload: deleteChat = undefined;
}

export class UploadErrorDeleteChatAction implements Action {
    public readonly type = chatsActionType.deleteChatUploadError;
    public readonly payload: Error;

    constructor(error: Error) {
        this.payload = error;
    }
}

export class UploadChatTokenAction implements Action {
    public readonly type = chatsActionType.chatTokenUpload;
    public readonly payload: number;

    constructor(chatId: number) {
        this.payload = chatId;
    }
}

export class UploadedChatTokenAction implements Action {
    public readonly type = chatsActionType.chatTokenUploaded;
    public readonly payload: {chatId: number, chatToken: chatToken};

    constructor(chatId: number, chatToken: chatToken) {
        this.payload = {chatId, chatToken};
    }
}

export class UploadErrorChatTokenAction implements Action {
    public readonly type = chatsActionType.chatTokenUploadError;
    public readonly payload: {chatId: number, error: Error};

    constructor(chatId: number, error: Error) {
        this.payload = {chatId, error};
    }
}

export class UploadDeleteChatUsersAction implements Action {
    public readonly type = chatsActionType.deleteChatUsersUpload;
}

export class UploadedDeleteChatUsersAction implements Action {
    public readonly type = chatsActionType.deleteChatUsersUploaded;
    public readonly payload: deleteChatUsers = undefined;
}

export class UploadErrorDeleteChatUsersAction implements Action {
    public readonly type = chatsActionType.deleteChatUsersUploadError;
    public readonly payload: Error;

    constructor(error: Error) {
        this.payload = error;
    }
}

export class UploadAddChatUsersAction implements Action {
    public readonly type = chatsActionType.addChatUsersUpload;
}

export class UploadedAddChatUsersAction implements Action {
    public readonly type = chatsActionType.addChatUsersUploaded;
    public readonly payload: addChatUsers = undefined;
}

export class UploadErrorAddChatUsersAction implements Action {
    public readonly type = chatsActionType.addChatUsersUploadError;
    public readonly payload: Error;

    constructor(error: Error) {
        this.payload = error;
    }
}
