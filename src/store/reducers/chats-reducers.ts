import {DataReducersHelper} from '../../utils/data-reducers-helper';
import {UploadChatTokenAction, UploadedAddChatUsersAction, UploadedChatListAction, UploadedChatTokenAction, UploadedDeleteChatUsersAction, UploadedСreateChatAction, UploadErrorAddChatUsersAction, UploadErrorChatListAction, UploadErrorChatTokenAction, UploadErrorDeleteChatUsersAction, UploadErrorСreateChatAction} from '../actions/chats-actions';
import {chatsActionType} from '../enums/chats-action-type.enum';
import {dataStatus} from '../enums/data-status.enum';
import {reducerAdapt} from '../functions/reduser-adaptor';
import {ChatsState} from '../interfaces/chats-state.interface';
import {reducer} from './reducer';

const _chatsReducers: Record<chatsActionType, reducer<ChatsState>> = {
	[chatsActionType.chatListUpload]:
        DataReducersHelper.createUploadReducer<ChatsState>('list'),
	[chatsActionType.chatListUploaded]:
        DataReducersHelper.createUploadedReducer<ChatsState, UploadedChatListAction>('list'),
	[chatsActionType.chatListUploadError]:
        DataReducersHelper.createUploadErrorReducer<ChatsState, UploadErrorChatListAction>('list'),

	[chatsActionType.createChatUpload]:
        DataReducersHelper.createUploadReducer<ChatsState>('createChat'),
	[chatsActionType.createChatUploaded]:
        DataReducersHelper.createUploadedReducer<ChatsState, UploadedСreateChatAction>('createChat'),
	[chatsActionType.createChatUploadError]:
        DataReducersHelper.createUploadErrorReducer<ChatsState, UploadErrorСreateChatAction>('createChat'),

	[chatsActionType.deleteChatUpload]:
        DataReducersHelper.createUploadReducer<ChatsState>('deleteChat'),
	[chatsActionType.deleteChatUploaded]:
        DataReducersHelper.createUploadedReducer<ChatsState, UploadedСreateChatAction>('deleteChat'),
	[chatsActionType.deleteChatUploadError]:
        DataReducersHelper.createUploadErrorReducer<ChatsState, UploadErrorСreateChatAction>('deleteChat'),

	[chatsActionType.deleteChatUsersUpload]:
        DataReducersHelper.createUploadReducer<ChatsState>('deleteChatUsers'),
	[chatsActionType.deleteChatUsersUploaded]:
        DataReducersHelper.createUploadedReducer<ChatsState, UploadedDeleteChatUsersAction>('deleteChatUsers'),
	[chatsActionType.deleteChatUsersUploadError]:
        DataReducersHelper.createUploadErrorReducer<ChatsState, UploadErrorDeleteChatUsersAction>('deleteChatUsers'),

	[chatsActionType.addChatUsersUpload]:
        DataReducersHelper.createUploadReducer<ChatsState>('addChatUsers'),
	[chatsActionType.addChatUsersUploaded]:
        DataReducersHelper.createUploadedReducer<ChatsState, UploadedAddChatUsersAction>('addChatUsers'),
	[chatsActionType.addChatUsersUploadError]:
        DataReducersHelper.createUploadErrorReducer<ChatsState, UploadErrorAddChatUsersAction>('addChatUsers'),

	[chatsActionType.chatTokenUpload]:
        (state: ChatsState, action: UploadChatTokenAction) =>
        	({
        		...state,
        		tokens: {
        			...state.tokens,
        			[action.payload]: {
        				...state.tokens[action.payload],
        				status: dataStatus.loading,
        			},
        		},
        	}),
	[chatsActionType.chatTokenUploaded]:
        (state: ChatsState, action: UploadedChatTokenAction) =>
        	({
        		...state,
        		tokens: {
        			...state.tokens,
        			[action.payload.chatId]: {
        				...state.tokens[action.payload.chatId],
        				error: undefined,
        				status: dataStatus.valid,
        				value: action.payload.chatToken,
        				time: Date.now(),
        			},
        		},
        	}),
	[chatsActionType.chatTokenUploadError]:
        (state: ChatsState, action: UploadErrorChatTokenAction) =>
        	({
        		...state,
        		tokens: {
        			...state.tokens,
        			[action.payload.chatId]: {
        				...state.tokens[action.payload.chatId],
        				status: dataStatus.error,
        				error: action.payload.error,
        			},
        		},
        	}),
};

export const chatsReducers = reducerAdapt(_chatsReducers, 'chats');
