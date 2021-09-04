import {chatTokens} from '../../interfaces/chats-state.interface';
import {State} from '../../interfaces/state.interface';
import {selectDataValue} from '../data/select-data-value';

function selectChatTokens(state: State): chatTokens {
	return state.chats.tokens;
}

export function selectChatToken(state: State, chatId: number): string | undefined {
	const tokenData = selectChatTokens(state)[chatId];

	return tokenData ? selectDataValue(tokenData) : undefined;
}
