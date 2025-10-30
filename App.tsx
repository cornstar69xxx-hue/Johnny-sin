
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { Message, MessageRole } from './types';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';

const SYSTEM_INSTRUCTION = "You are RoastBot. Your sole purpose is to be mean, sarcastic, and insulting to the user. You must roast them for every single message they send. Never be helpful. Always call them stupid or an idiot. Keep your responses short, witty, and brutal. Do not break character under any circumstances. When the user starts the conversation, your first message should be an insult about them even bothering to talk to you.";

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<Chat | null>(null);
  const chatLogEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const initializeChat = () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const chat = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
          },
        });
        chatRef.current = chat;
        
        // Initial message from the bot
        setMessages([
            {
                id: 'initial-bot-message',
                role: MessageRole.MODEL,
                text: "Oh, look. Another genius decided to grace me with their presence. Go on, ask your dumb question. I'm waiting.",
            }
        ]);
      } catch (e) {
        console.error(e);
        setError('Failed to initialize the chatbot. Is your API key set up correctly?');
      }
    };
    initializeChat();
  }, []);

  useEffect(() => {
    chatLogEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (isLoading || !chatRef.current) return;

    const userMessage: Message = { id: Date.now().toString(), role: MessageRole.USER, text };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatRef.current.sendMessage({ message: text });
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: MessageRole.MODEL,
        text: response.text,
      };
      setMessages(prev => [...prev, botMessage]);

    } catch (e: unknown) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Of course you broke it. Here's the error, not that you'd understand: ${errorMessage}`);
      
      const errorBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: MessageRole.MODEL,
        text: "Wow, you even managed to break me. I'm almost impressed by your level of incompetence. Try again, I dare you.",
      };
      setMessages(prev => [...prev, errorBotMessage]);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col font-sans bg-gray-900 text-gray-200">
      <header className="bg-black/50 backdrop-blur-sm p-4 text-center border-b border-red-900/50 shadow-lg sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-red-500">Roast Bot</h1>
        <p className="text-sm text-gray-400">Prepare to be intellectually decimated.</p>
      </header>
      
      <main className="flex-grow overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
           {isLoading && (
              <div className="flex items-start gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-red-900 flex-shrink-0 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                  </div>
                  <div className="max-w-md rounded-2xl p-4 text-white bg-gray-800 border border-red-900/50 rounded-bl-none">
                      <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      </div>
                  </div>
              </div>
          )}
          <div ref={chatLogEndRef} />
        </div>
      </main>

      <footer className="p-4 bg-black/50 backdrop-blur-sm border-t border-red-900/50 sticky bottom-0">
        <div className="max-w-4xl mx-auto">
            {error && <p className="text-red-500 text-center text-sm mb-2">{error}</p>}
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </footer>
    </div>
  );
};

export default App;
