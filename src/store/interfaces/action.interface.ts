import { authorizationActionType } from "../enums/authorization-action-type.enum";

export type actionType = authorizationActionType;

export interface Action {
    type: actionType;
    payload?: unknown;
}