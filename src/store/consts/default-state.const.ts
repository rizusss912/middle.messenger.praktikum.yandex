import { getDefaultData } from "../functions/get-default-data";
import { State } from "../interfaces/state.interface";
import { authToken, logout, userData } from "../interfaces/authorization-state.interface";
import { changePassword, changeUser } from "../interfaces/user-state.interface";
import { addChatUsers, chatsList, createChat, deleteChat, deleteChatUsers } from "../interfaces/chats-state.interface";

export const defaultState: State = {
    authorization: {
        authToken: getDefaultData<authToken>(),
        logout: getDefaultData<logout>(),
        userData: getDefaultData<userData>(),
    },
    user: {
        changePassword: getDefaultData<changePassword>(),
        changeUserData: getDefaultData<changeUser>(),
    },
    chats: {
        list: getDefaultData<chatsList>(),
        createChat: getDefaultData<createChat>(),
        deleteChat: getDefaultData<deleteChat>(),
        tokens: {},
        deleteChatUsers: getDefaultData<deleteChatUsers>(),
        addChatUsers: getDefaultData<addChatUsers>(),
    },
}