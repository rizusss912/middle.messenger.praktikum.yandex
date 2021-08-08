import { authorizationActionType } from "../enums/authorization-action-type.enum";
import { chatsActionType } from "../enums/chats-action-type.enum";
import { userActionType } from "../enums/user-action-type.enum";

export type actionType = 
    authorizationActionType 
    | userActionType
    | chatsActionType;

export interface Action {
    type: actionType;
    payload?: unknown;
}