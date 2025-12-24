import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { X, Send, Copy, ExternalLink, Sparkles, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function AuraPromptDialog({ isOpen, onClose }) {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && !conversationId) {
      initializeConversation();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!conversationId) return;

    const unsubscribe = base44.agents.subscribeToConversation(conversationId, (data) => {
      setMessages(data.messages || []);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [conversationId]);

  const initializeConversation = async () => {
    try {
      const conversation = await base44.agents.createConversation({
        agent_name: 'aura_prompt_generator',
        metadata: {
          name: 'Aura Prompt Generation',
          description: 'Generate optimized prompts for Aura designer'
        }
      });
      setConversationId(conversation.id);
    } catch (error) {
      console.error('Failed to create conversation:', error);
      toast.error('Failed to initialize AI assistant');
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !conversationId || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      const conversation = await base44.agents.getConversation(conversationId);
      await base44.agents.addMessage(conversation, {
        role: 'user',
        content: userMessage
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
      setIsLoading(false);
    }
  };

  const handleCopyPrompt = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(text);
    toast.success('Prompt copied to clipboard!');
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  const handleOpenAura = () => {
    window.open('https://www.aura.build/create', '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Aura Prompt Generator</h2>
              <p className="text-xs text-slate-500">AI-powered design prompt assistant</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Let's create something amazing!</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Describe the page or screen you want to design, and I'll help you craft the perfect prompt for Aura.
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-100 text-slate-900'
              }`}>
                {message.content && (
                  <div className="prose prose-sm max-w-none">
                    {message.content.split('```').map((part, i) => {
                      if (i % 2 === 1) {
                        // This is code inside backticks
                        return (
                          <div key={i} className="relative my-3 group">
                            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
                              {part.trim()}
                            </pre>
                            <button
                              onClick={() => handleCopyPrompt(part.trim())}
                              className="absolute top-2 right-2 p-2 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                            >
                              {copiedPrompt === part.trim() ? (
                                <Check className="w-4 h-4 text-green-400" />
                              ) : (
                                <Copy className="w-4 h-4 text-slate-300" />
                              )}
                            </button>
                          </div>
                        );
                      }
                      return <p key={i} className="whitespace-pre-wrap leading-relaxed">{part}</p>;
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 rounded-2xl px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                <span className="text-sm text-slate-600">Generating prompt...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 border-t border-slate-200 bg-slate-50">
          <div className="flex gap-3 mb-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Describe your page idea... (e.g., 'A modern dashboard for analytics')"
              className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-pink-200"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
          
          <button
            onClick={handleOpenAura}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Open Aura Designer
          </button>
        </div>

      </div>
    </div>
  );
}