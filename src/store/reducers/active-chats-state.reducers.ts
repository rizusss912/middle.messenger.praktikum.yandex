import { AddActiveChatAction, RemoveActiveChatAction } from "../actions/active-chats-actions";
import { activeChatsActionType } from "../enums/active-chats-actions";
import { reducerAdapt } from "../functions/reduser-adaptor";
import { ActiveChatsState } from "../interfaces/active-chats-state.interface";
import { reducer } from "./reducer";

const _activeChatsReducers: Record<activeChatsActionType, reducer<ActiveChatsState>>  = {
    [activeChatsActionType.addActiveChat]:
        (state: ActiveChatsState, action: AddActiveChatAction) =>
            ({
                ...state,
                controllers: {
                    ...state.controllers,
                    [action.payload.chatId]: action.payload.controller,
                }
            }),

    [activeChatsActionType.removeActiveChat]:
        (state: ActiveChatsState, action: RemoveActiveChatAction) => {
            const controllers = Object.assign({}, state.controllers);

            delete controllers[action.payload];
            
            return {
                ...state,
                controllers,
            }
        },
};

export const activeChatsReducers = reducerAdapt(_activeChatsReducers, 'activeChats');