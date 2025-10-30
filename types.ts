
export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
}

export interface Message {
  id: string;
  role: MessageRole;
  text: string;
}
