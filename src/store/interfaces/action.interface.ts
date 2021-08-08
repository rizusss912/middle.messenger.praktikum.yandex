import { authorizationActionType } from "../enums/authorization-action-type.enum";
import { userActionType } from "../enums/user-action-type.enum";

export type actionType = 
    authorizationActionType 
    | userActionType;

export interface Action {
    type: actionType;
    payload?: unknown;
}