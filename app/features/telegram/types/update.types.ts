export type User = {
  id: number;
  isBot?: boolean;
  firstName: string;
  lastName?: string;
  username?: string;
};
export type Message = {
  messageId: number;
  messageThreadId: number;
  from: User;
};

export type Update = {
  message: Message;
};
