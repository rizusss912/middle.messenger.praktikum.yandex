import { WebSocketController } from "../../utils/api/web-socket-controller";

export type activeChatsControllers = {
    [chatId: number]: WebSocketController<{}, {}>,
};

export interface ActiveChatsState {
    controllers: activeChatsControllers;
}