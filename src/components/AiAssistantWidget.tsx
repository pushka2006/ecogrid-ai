'use client';

import React, { useState } from 'react';
import {
  Bot,
  Send,
  MoreHorizontal,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { ChatMessage, SmartBin, BuildingEnergy } from '@/lib/types';
import { queryAiAssistant } from '@/lib/aiAssistantEngine';

interface AiAssistantWidgetProps {
  messages: ChatMessage[];
  onSendMessage: (msg: ChatMessage) => void;
  bins: SmartBin[];
  buildings: BuildingEnergy[];
  totalWasteKg: number;
  recyclableKg: number;
  totalKwh: number;
  solarKwh: number;
  onExpandView?: () => void;
}

export const AiAssistantWidget: React.FC<AiAssistantWidgetProps> = ({
  messages,
  onSendMessage,
  bins,
  buildings,
  totalWasteKg,
  recyclableKg,
  totalKwh,
  solarKwh,
  onExpandView,
}) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    onSendMessage(userMsg);
    const query = inputText;
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const response = queryAiAssistant(query, {
        bins,
        buildings,
        totalWasteKg,
        recyclableKg,
        totalKwh,
        solarKwh,
      });
      onSendMessage(response);
      setIsTyping(false);
    }, 450);
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200/70 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 leading-none">
                AI Sustainability Assistant
              </h3>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Online</span>
              </p>
            </div>
          </div>
          <button
            onClick={onExpandView}
            className="text-gray-400 hover:text-gray-600 p-1"
            title="Options / Expand"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
          {messages.map((msg) => (
            <div key={msg.id} className="text-xs">
              {msg.sender === 'user' ? (
                /* User bubble (green background aligned right) */
                <div className="flex justify-end">
                  <div className="bg-[#059669] text-white font-medium rounded-2xl rounded-tr-xs px-3.5 py-2 max-w-[85%] shadow-xs">
                    <p>{msg.text}</p>
                  </div>
                </div>
              ) : (
                /* Assistant bubble aligned left */
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 bg-gray-50/80 rounded-2xl rounded-tl-xs p-3 border border-gray-200/70 text-gray-800 leading-relaxed font-normal">
                    <div className="whitespace-pre-line text-xs">{msg.text}</div>

                    {/* Sources citation */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-gray-200/60 text-[10px] text-gray-400 font-medium">
                        <span className="text-gray-500 font-semibold">Sources: </span>
                        {msg.sources.join(' • ')}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-gray-400 animate-pulse">
              <Bot className="w-4 h-4 text-emerald-600" />
              <span>Grounding reasoning via Amazon Bedrock...</span>
            </div>
          )}
        </div>
      </div>

      {/* Input box */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question about waste, energy or sustainability..."
            className="w-full pl-3.5 pr-10 py-2.5 text-xs bg-gray-50 hover:bg-gray-100/70 focus:bg-white rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden transition-all text-gray-800 placeholder:text-gray-400"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="absolute right-1.5 p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white shadow-xs transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
