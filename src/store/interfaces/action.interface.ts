import { userDataActionType } from "../enums/user-data.enum";

export type actionType = userDataActionType;

export interface Action {
    type: actionType;
    payload?: unknown;
}