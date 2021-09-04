import {addChatUsers, chatsList, chatToken, createChat, deleteChat, deleteChatUsers} from '../../../store/interfaces/chats-state.interface';
import {HTTPResponse} from '../../../utils/api/http-client';
import {HTTPClientModule} from '../../../utils/api/http-client-module';
import {HTTPMethod} from '../../../utils/api/http-method';
import {Interceptor} from '../../../utils/interfaces/interceptor';

const DEFAULT_CHATS_LIMIT = 30;

export type uploadChatsQueryParams = {offset?: number, limit?: number, title?: string};

export class ChatsHttpClientModule extends HTTPClientModule {
    private static readonly moduleMutualPathname = ['chats'];

    constructor(origin: string, mutualPathname: string[], interseptors: Interceptor[] = []) {
    	super(
    		origin,
    		mutualPathname.concat(ChatsHttpClientModule.moduleMutualPathname),
    		interseptors,
    	);
    }

    public uploadChats(
    	queryParams: uploadChatsQueryParams = {limit: DEFAULT_CHATS_LIMIT},
    ): Promise<HTTPResponse<chatsList>> {
    	if (!queryParams.limit) {
    		queryParams.limit = DEFAULT_CHATS_LIMIT;
    	}

    	return this.upload({
    		method: HTTPMethod.GET,
    		pathname: [],
    		queryParams,
    	});
    }

    public createChat(title: string): Promise<HTTPResponse<createChat>> {
    	return this.upload({
    		method: HTTPMethod.POST,
    		pathname: [],
    		body: {title},
    	});
    }

    public deleteChat(chatId: number): Promise<HTTPResponse<deleteChat>> {
    	return this.upload({
    		method: HTTPMethod.DELETE,
    		pathname: [],
    		body: {chatId},
    	});
    }

    public getTokenForChat(chatId: number): Promise<HTTPResponse<{token: chatToken}>> {
    	return this.upload({
    		method: HTTPMethod.POST,
    		pathname: ['token', String(chatId)],
    	});
    }

    public deleteUsersFormChat(
    	usersIds: number[],
    	chatId: number,
    ): Promise<HTTPResponse<deleteChatUsers>> {
    	return this.upload({
    		method: HTTPMethod.DELETE,
    		pathname: ['users'],
    		body: {usersIds, chatId},
    	});
    }

    public addUsersToChat(usersIds: number[], chatId: number): Promise<HTTPResponse<addChatUsers>> {
    	return this.upload({
    		method: HTTPMethod.PUT,
    		pathname: ['users'],
    		body: {usersIds, chatId},
    	});
    }
}
