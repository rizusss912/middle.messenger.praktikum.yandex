import {ActiveChatsState} from './active-chats-state.interface';
import {AuthorizationState} from './authorization-state.interface';
import {ChatsState} from './chats-state.interface';
import {UserState} from './user-state.interface';

export interface State {
    authorization: AuthorizationState;
    user: UserState;
    chats: ChatsState;
    activeChats: ActiveChatsState;
}
