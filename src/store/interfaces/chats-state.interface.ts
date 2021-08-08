import { pushUserData } from "../../service/api/modules/auth-http-client-module";
import { Data } from "./data.interface";

export interface chatMessage {
    user: pushUserData,
    time: Date,
    content: string,
}

export type chatPreview = {
    id: number,
    title: string,
    avatar: string | null,
    unread_count: number,
    last_message: chatMessage,
}

export type chatsList = chatPreview[];

export type chatToken = string;
export type createChat = undefined;
export type deleteChat = undefined;
export type deleteChatUsers = undefined;
export type addChatUsers = undefined;

export interface ChatsState {
    list: Data<chatsList>,
    createChat: Data<createChat>,
    deleteChat: Data<deleteChat>,
    tokens: {
        [chatId: number]: Data<chatToken>,
    },
    deleteChatUsers: Data<deleteChatUsers>,
    addChatUsers: Data<addChatUsers>,
}