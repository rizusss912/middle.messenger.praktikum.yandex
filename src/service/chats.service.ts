import {
	UploadAddChatUsersAction,
	UploadChatListAction,
	UploadChatTokenAction,
	UploadDeleteChatAction,
	UploadDeleteChatUsersAction,
	UploadedAddChatUsersAction,
	UploadedChatListAction,
	UploadedChatTokenAction,
	UploadedDeleteChatAction,
	UploadedDeleteChatUsersAction,
	UploadedСreateChatAction,
	UploadErrorAddChatUsersAction,
	UploadErrorChatListAction,
	UploadErrorChatTokenAction,
	UploadErrorDeleteChatAction,
	UploadErrorDeleteChatUsersAction,
	UploadErrorСreateChatAction,
	UploadСreateChatAction} from '../store/actions/chats-actions';
import {selectChatToken} from '../store/selectors/chats/select-chat-token';
import {Store} from '../store/store';
import {HTTPClientFacade} from './api/http-client.facade';
import {uploadChatsQueryParams} from './api/modules/chats-http-client-module';

let instance: ChatsService;

export class ChatsService {
    private readonly httpClientFacade: HTTPClientFacade;
    private readonly store: Store;

    constructor() {
    	if (instance) {
    		return instance;
    	}

    	instance = this;

    	this.httpClientFacade = new HTTPClientFacade();
    	this.store = new Store();
    }

    public createChat(title: string): Promise<void> {
    	this.store.dispatch(new UploadСreateChatAction());

    	return this.httpClientFacade.chats.createChat(title)
    		.then(() => this.store.dispatch(new UploadedСreateChatAction()))
    		.catch(error => {
    			this.store.dispatch(new UploadErrorСreateChatAction(error));

    			throw error;
    		});
    }

    public deleteChat(chatId: number): Promise<void> {
    	this.store.dispatch(new UploadDeleteChatAction());

    	return this.httpClientFacade.chats.deleteChat(chatId)
    		.then(() => this.store.dispatch(new UploadedDeleteChatAction()))
    		.catch(error => {
    			this.store.dispatch(new UploadErrorDeleteChatAction(error));

    			throw error;
    		});
    }

    public addUsersToChat(usersIds: number[], chatId: number): Promise<void> {
    	this.store.dispatch(new UploadAddChatUsersAction());

    	return this.httpClientFacade.chats.addUsersToChat(usersIds, chatId)
    		.then(() => this.store.dispatch(new UploadedAddChatUsersAction()))
    		.catch(error => {
    			this.store.dispatch(new UploadErrorAddChatUsersAction(error));

    			throw error;
    		});
    }

    public deleteUsersFormChat(usersIds: number[], chatId: number): Promise<void> {
    	this.store.dispatch(new UploadDeleteChatUsersAction());

    	return this.httpClientFacade.chats.deleteUsersFormChat(usersIds, chatId)
    		.then(() => this.store.dispatch(new UploadedDeleteChatUsersAction()))
    		.catch(error => {
    			this.store.dispatch(new UploadErrorDeleteChatUsersAction(error));

    			throw error;
    		});
    }

    public uploadTokenForChat(chatId: number): Promise<void> {
    	this.store.dispatch(new UploadChatTokenAction(chatId));

    	return this.httpClientFacade.chats.getTokenForChat(chatId)
    		.then(response =>
    			this.store.dispatch(new UploadedChatTokenAction(chatId, response.body.token)),
    		)
    		.catch(error => {
    			this.store.dispatch(new UploadErrorChatTokenAction(chatId, error));

    			throw error;
    		});
    }

    public uploadChats(params?: uploadChatsQueryParams): Promise<void> {
    	this.store.dispatch(new UploadChatListAction());

    	return this.httpClientFacade.chats.uploadChats(params)
    		.then(response =>
    			this.store.dispatch(new UploadedChatListAction(response.body)),
    		)
    		.catch(error => {
    			this.store.dispatch(new UploadErrorChatListAction(error));

    			throw error;
    		});
    }

    public uploadTokenForChatIfNot(chatId: number): Promise<void> {
    	return selectChatToken(this.store.state, chatId)
    		? Promise.resolve()
    		: this.uploadTokenForChat(chatId);
    }
}
