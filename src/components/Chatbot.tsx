
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I\'m the Gemba Indonesia virtual assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage = { role: 'user' as const, content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);
    
    try {
      // Simulate OpenAI API call with a timeout
      // In a real implementation, you would call the OpenAI API here
      setTimeout(() => {
        // Generate a mock response
        const mockResponses = [
          "Thank you for your question! We offer comprehensive consulting services in operational excellence, financial analysis, and business strategy.",
          "I'd be happy to help with that. Our team specializes in process optimization and efficiency improvement.",
          "That's a great question. Gemba Indonesia provides tailored solutions for businesses across various industries including manufacturing, healthcare, and financial services.",
          "We have extensive experience in that area. Would you like me to arrange a consultation with one of our specialists?",
          "I understand your concern. Gemba's approach focuses on practical, implementable solutions that deliver measurable results.",
        ];
        
        const responseIndex = Math.floor(Math.random() * mockResponses.length);
        const botMessage = { 
          role: 'assistant' as const, 
          content: mockResponses[responseIndex]
        };
        
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: 'Sorry, I encountered an error processing your request. Please try again later.' 
        }
      ]);
    }
  };

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className={`chatbot-panel ${!isOpen ? 'hidden' : ''}`}>
          <div className="bg-gemba text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <span className="font-medium">Gemba Assistant</span>
            </div>
            <button onClick={toggleChatbot} className="hover:text-gemba-secondary transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <div className="p-4 h-[360px] overflow-y-auto">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div 
                  className={`inline-block px-4 py-2 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-gemba text-white rounded-tr-none' 
                      : 'bg-gray-200 text-gray-800 rounded-tl-none'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="mb-4 text-left">
                <div className="inline-block px-4 py-2 rounded-lg bg-gray-200 text-gray-800 rounded-tl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gemba"
              />
              <button 
                type="submit" 
                className="bg-gemba hover:bg-gemba-dark text-white p-2 rounded-md transition-colors"
                disabled={!input.trim() || isTyping}
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      )}
      
      <div className="chatbot-button" onClick={toggleChatbot}>
        {isOpen ? <X className="text-white" size={24} /> : <MessageCircle className="text-white" size={24} />}
      </div>
    </div>
  );
};

export default Chatbot;
