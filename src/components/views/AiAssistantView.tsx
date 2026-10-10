'use client';

import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { ChatMessage, SmartBin, BuildingEnergy } from '@/lib/types';
import { queryAiAssistant } from '@/lib/aiAssistantEngine';

interface AiAssistantViewProps {
  messages: ChatMessage[];
  onSendMessage: (msg: ChatMessage) => void;
  bins: SmartBin[];
  buildings: BuildingEnergy[];
  totalWasteKg: number;
  recyclableKg: number;
  totalKwh: number;
  solarKwh: number;
}

const PRESET_QUESTIONS = [
  'Which bins should be collected first?',
  'Which building has the highest avoidable electricity consumption?',
  'What percentage of reported waste is potentially recyclable?',
  'How can our campus reduce electricity costs?',
  'Which interventions produced the greatest measured savings?',
];

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  messages,
  onSendMessage,
  bins,
  buildings,
  totalWasteKg,
  recyclableKg,
  totalKwh,
  solarKwh,
}) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendQuery = (textToSend?: string) => {
    const q = textToSend || inputText;
    if (!q.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    onSendMessage(userMsg);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const resp = queryAiAssistant(q, {
        bins,
        buildings,
        totalWasteKg,
        recyclableKg,
        totalKwh,
        solarKwh,
      });
      onSendMessage(resp);
      setIsTyping(false);
    }, 450);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              Amazon Bedrock AI Sustainability Assistant
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              Grounded Retrieval-Augmented Generation (RAG) • Verified evidence & deterministic formulas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Claude 3.5 Sonnet Grounded</span>
          </span>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div>
        <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          Quick Inquiries Grounded in Campus Telemetry:
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESET_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => handleSendQuery(q)}
              className="text-xs font-medium text-emerald-900 bg-white hover:bg-emerald-50 border border-emerald-200/80 px-3 py-2 rounded-xl transition-all shadow-2xs hover:border-emerald-400"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Stream */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex flex-col min-h-[480px] justify-between">
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {messages.map((msg) => (
            <div key={msg.id} className="text-xs">
              {msg.sender === 'user' ? (
                <div className="flex justify-end">
                  <div className="bg-emerald-600 text-white font-medium rounded-2xl rounded-tr-xs px-4 py-2.5 max-w-[80%] shadow-xs">
                    <p>{msg.text}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-2xl rounded-tl-xs p-4 border border-gray-200/70 text-gray-800 leading-relaxed font-normal">
                    <div className="whitespace-pre-line text-xs font-medium">{msg.text}</div>

                    {msg.mathProof && (
                      <div className="mt-3 p-2.5 rounded-xl bg-white border border-gray-200 font-mono text-[11px] text-emerald-900">
                        <span className="font-bold text-gray-500 uppercase text-[9px] block mb-0.5">Deterministic Validation:</span>
                        <code>{msg.mathProof}</code>
                      </div>
                    )}

                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-gray-200 text-[10px] text-gray-400 font-medium">
                        <span className="text-gray-600 font-bold">Evidence Sources: </span>
                        {msg.sources.join(' • ')}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-emerald-700 animate-pulse">
              <Bot className="w-4 h-4" />
              <span>Querying Amazon Bedrock knowledge base & executing verification math...</span>
            </div>
          )}
        </div>

        {/* Input box */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
              placeholder="Ask anything about waste routing, building anomalies, or renewable energy..."
              className="w-full pl-4 pr-12 py-3 text-xs bg-gray-50 hover:bg-gray-100/70 focus:bg-white rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden transition-all text-gray-800 placeholder:text-gray-400"
            />
            <button
              onClick={() => handleSendQuery()}
              disabled={!inputText.trim()}
              className="absolute right-2 p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white shadow-xs transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
