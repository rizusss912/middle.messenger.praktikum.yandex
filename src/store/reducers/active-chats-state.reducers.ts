import { AddActiveChatAction, ChangeChatReadyStateAction, RemoveActiveChatAction } from "../actions/active-chats-actions";
import { activeChatsActionType } from "../enums/active-chats-actions";
import { reducerAdapt } from "../functions/reduser-adaptor";
import { ActiveChatsState } from "../interfaces/active-chats-state.interface";
import { reducer } from "./reducer";

const _activeChatsReducers: Record<activeChatsActionType, reducer<ActiveChatsState>>  = {
    [activeChatsActionType.addActiveChat]:
        (state: ActiveChatsState, action: AddActiveChatAction) =>
            ({
                ...state,
                managers: {
                    ...state.managers,
                    [action.payload.chatId]: {
                        controller: action.payload.controller,
                        listener: action.payload.listener,
                    },
                }
            }),

    [activeChatsActionType.removeActiveChat]:
        (state: ActiveChatsState, action: RemoveActiveChatAction) => {
            const controllers = Object.assign({}, state.managers);

            delete controllers[action.payload];
            
            return {
                ...state,
                controllers,
            }
        },

    [activeChatsActionType.changeChatReadyState]:
        (state: ActiveChatsState, action: ChangeChatReadyStateAction) =>
            ({
                ...state,
                chatsReadyStates: {
                    ...state.chatsReadyStates,
                    [action.payload.chatId]: action.payload.readyState,
                },
            }),
};

export const activeChatsReducers = reducerAdapt(_activeChatsReducers, 'activeChats');