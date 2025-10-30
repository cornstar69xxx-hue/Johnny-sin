
import React from 'react';
import { Message, MessageRole } from '../types';

interface ChatMessageProps {
  message: Message;
}

const BotIcon = () => (
    <div className="w-8 h-8 rounded-full bg-red-900 flex-shrink-0 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
    </div>
);

const UserIcon = () => (
    <div className="w-8 h-8 rounded-full bg-blue-900 flex-shrink-0 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
    </div>
);


export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === MessageRole.USER;

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <BotIcon />}
      <div
        className={`max-w-md lg:max-w-xl xl:max-w-2xl rounded-2xl p-4 text-white shadow-md ${
          isUser
            ? 'bg-blue-600 rounded-br-none'
            : 'bg-gray-800 border border-red-900/50 rounded-bl-none'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>
      </div>
      {isUser && <UserIcon />}
    </div>
  );
};
