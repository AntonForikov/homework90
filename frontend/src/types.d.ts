export interface ChatMessage {
    username: string;
    text: string;
}

export interface IncomingChatMessage {
    type: 'NEW_MESSAGE';
    payload: ChatMessage;
}

export interface IncomingWelcomeMessage {
    type: 'WELCOME';
    payload: ChatMessage;
}

export type IncomingMessage = IncomingChatMessage | IncomingWelcomeMessage;
