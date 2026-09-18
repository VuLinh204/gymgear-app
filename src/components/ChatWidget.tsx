'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  BookOpen,
  Plus,
  Trash2,
  Clock,
  Zap,
  FileText,
  Tag,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  RotateCcw,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import {
  fetchAIKnowledgeDocs,
  createAIKnowledgeDoc,
  deleteAIKnowledgeDoc,
} from '@/lib/supabaseDB';
import type { AIResponseResult } from '@/lib/supabaseDB';
import type { Equipment, AIKnowledgeDoc } from '@/types';

type MessageRole = 'user' | 'ai' | 'system';

interface ChatMsg {
  id: string;
  role: MessageRole;
  text: string;
  sourceTitle?: string;
  matchedEquipment?: Equipment;
  createdAt: Date;
  status?: 'sent' | 'error';
}

interface ChatWidgetProps {
  onOpenEquipmentDetail?: (equipmentId: string) => void;
}

const WAIT_SECS = 300;

const QUICK_PROMPTS = [
  'Chính sách hội viên Premium?',
  'Tư vấn lịch tập Push-Pull-Legs',
  'Showroom Hà Nội ở đâu?',
  'Máy Impulse PT300H giá bao nhiêu?',
];

const CATEGORY_LABELS: Record<string, string> = {
  equipment: 'Thiết bị',
  workout: 'Luyện tập',
  nutrition: 'Dinh dưỡng',
  policy: 'Chính sách',
  pricing: 'Giá cả',
  custom: 'Khác',
};

function buildWelcome(): ChatMsg {
  return {
    id: 'welcome',
    role: 'ai',
    text: 'Xin chào! Tôi là GymGear AI Assistant. Tôi có thể tư vấn về máy tập, chính sách giá, lịch luyện tập và dinh dưỡng. Hãy đặt câu hỏi bất cứ lúc nào!\n\nNếu bạn muốn được tư vấn trực tiếp từ admin, hãy bấm "Liên hệ Admin" phía trên.',
    createdAt: new Date(),
    status: 'sent',
  };
}

export default function ChatWidget({ onOpenEquipmentDetail }: ChatWidgetProps) {
  const { currentUser } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'kb'>('chat');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([buildWelcome()]);
  const [mode, setMode] = useState<'ai' | 'waiting'>('ai');
  const [countdown, setCountdown] = useState(WAIT_SECS);
  const [countdownActive, setCountdownActive] = useState(false);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [docs, setDocs] = useState<AIKnowledgeDoc[]>([]);
  const [kbLoading, setKbLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocContent, setNewDocContent] = useState('');
  const [newDocCategory, setNewDocCategory] = useState<AIKnowledgeDoc['category']>('custom');
  const [newDocKeywords, setNewDocKeywords] = useState('');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'kb') {
      setKbLoading(true);
      fetchAIKnowledgeDocs().then((d) => { setDocs(d); setKbLoading(false); });
    }
  }, [activeTab]);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, isTyping]);

  const triggerAIAutoReply = useCallback(() => {
    const systemMsg: ChatMsg = {
      id: `sys-${Date.now()}`,
      role: 'system',
      text: 'Admin chưa thể phản hồi. AI Assistant sẽ tự động trả lời câu hỏi của bạn.',
      createdAt: new Date(),
      status: 'sent',
    };
    setMessages((prev) => [...prev, systemMsg]);
    setMode('ai');
  }, []);

  const startCountdown = useCallback(() => {
    setCountdown(WAIT_SECS);
    setCountdownActive(true);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          setCountdownActive(false);
          triggerAIAutoReply();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [triggerAIAutoReply]);

  const handleForceAI = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setCountdownActive(false);
    triggerAIAutoReply();
  };

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSend = async (customText?: string) => {
    const textToSend = (customText ?? inputText).trim();
    if (!textToSend) return;

    const userMsg: ChatMsg = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: textToSend,
      createdAt: new Date(),
      status: 'sent',
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    if (mode === 'waiting') {
      startCountdown();
      const waitMsg: ChatMsg = {
        id: `wait-${Date.now()}`,
        role: 'system',
        text: 'Tin nhắn đã được gửi. AI sẽ phản hồi tự động nếu admin chưa trả lời trong 5 phút.',
        createdAt: new Date(),
        status: 'sent',
      };
      setMessages((prev) => [...prev, waitMsg]);
      return;
    }

    setIsTyping(true);
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: textToSend }),
      });
      const result: AIResponseResult & { error?: string } = await response.json();
      if (!response.ok) throw new Error(result.error || 'AI request failed');
      const aiMsg: ChatMsg = {
        id: `ai-${Date.now()}`,
        role: 'ai',
        text: result.text,
        sourceTitle: result.sourceTitle,
        matchedEquipment: result.matchedEquipment,
        createdAt: new Date(),
        status: 'sent',
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      const errMsg: ChatMsg = {
        id: `err-${Date.now()}`,
        role: 'ai',
        text: error instanceof Error
          ? error.message
          : 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.',
        createdAt: new Date(),
        status: 'error',
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAddDoc = async () => {
    if (!newDocTitle.trim() || !newDocContent.trim()) return;
    const kws = newDocKeywords.split(',').map((k) => k.trim()).filter(Boolean);
    const created = await createAIKnowledgeDoc({
      title: newDocTitle.trim(),
      content: newDocContent.trim(),
      category: newDocCategory,
      keywords: kws,
      authorName: currentUser?.name || 'Admin',
    });
    setDocs((prev) => [created, ...prev]);
    setNewDocTitle('');
    setNewDocContent('');
    setNewDocKeywords('');
    setShowAddForm(false);
  };

  const handleDeleteDoc = async (id: string) => {
    await deleteAIKnowledgeDoc(id);
    setDocs((prev) => prev.filter((d) => d.id !== id));
  };

  const handleReset = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setCountdownActive(false);
    setMessages([buildWelcome()]);
    setMode('ai');
    setCountdown(WAIT_SECS);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[100] font-sans">
      {!isOpen && (
        <button
          id="chat-widget-open-btn"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-pink-500 text-white font-bold text-sm shadow-xl shadow-orange-500/30 hover:scale-105 hover:shadow-orange-500/50 transition-all duration-300 focus:outline-none"
        >
          <Bot className="w-5 h-5" />
          <span className="hidden sm:inline">GymGear AI</span>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-950 rounded-full animate-ping" />
        </button>
      )}

      {isOpen && (
        <div
          className={`bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 transition-[width,height,transform,box-shadow] ease-[cubic-bezier(0.16,1,0.3,1)] duration-500 ${isExpanded
            ? 'w-[calc(100vw-2rem)] sm:w-[min(960px,calc(100vw-2rem))] h-[calc(100vh-2rem)] sm:h-[min(760px,calc(100vh-2rem))] max-h-[calc(100vh-2rem)] shadow-[0_24px_80px_rgba(0,0,0,0.5)]'
            : 'w-[92vw] sm:w-[400px] h-[580px] max-h-[88vh] shadow-2xl'
            }`}
        >

          {/* Header */}
          <div className="shrink-0 px-4 py-3 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/60 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-white leading-tight">GymGear AI Assistant</h3>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-emerald-400">
                    {mode === 'ai' ? 'AI Instant' : countdownActive ? `Cho Admin (${formatCountdown(countdown)})` : 'Cho Admin'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded((expanded) => !expanded)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
                title={isExpanded ? 'Thu nhỏ cửa sổ chat' : 'Phóng to cửa sổ chat'}
                aria-label={isExpanded ? 'Thu nhỏ cửa sổ chat' : 'Phóng to cửa sổ chat'}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button onClick={handleReset} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition" title="Reset">
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tab Bar */}
          <div className="shrink-0 flex border-b border-slate-800 bg-slate-900">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold transition ${activeTab === 'chat' ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5' : 'text-slate-400 hover:text-white'}`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Hỏi đáp
            </button>
            <button
              onClick={() => setActiveTab('kb')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold transition ${activeTab === 'kb' ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5' : 'text-slate-400 hover:text-white'}`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Kho tri thức
            </button>
          </div>

          {/* Mode Switcher */}
          {activeTab === 'chat' && (
            <div className="shrink-0 px-3 py-2 bg-slate-800/50 border-b border-slate-800 flex items-center gap-2">
              <div className="flex gap-1.5">
                <button
                  onClick={() => { setMode('ai'); if (countdownRef.current) { clearInterval(countdownRef.current); setCountdownActive(false); } }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition ${mode === 'ai' ? 'bg-amber-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                >
                  <Zap className="w-3 h-3" />
                  Hỏi đáp AI
                </button>
                <button
                  onClick={() => setMode('waiting')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition ${mode === 'waiting' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                >
                  <Clock className="w-3 h-3" />
                  Liên hệ Admin
                </button>
              </div>
            </div>
          )}

          {/* CHAT TAB */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} msg={msg} onOpenEquipmentDetail={onOpenEquipmentDetail} />
                ))}
                {isTyping && (
                  <div className="flex items-end gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="px-3 py-2.5 bg-slate-800 border border-slate-700/60 rounded-2xl rounded-bl-none">
                      <div className="flex gap-1 items-center">
                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0ms]" />
                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:150ms]" />
                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                )}
                {countdownActive && (
                  <div className="mx-2 p-3 rounded-xl bg-blue-900/40 border border-blue-500/30 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-white">
                          AI sẽ trả lời sau: <span className="text-blue-300 tabular-nums">{formatCountdown(countdown)}</span>
                        </p>
                        <p className="text-[10px] text-slate-400">Admin chưa phản hồi</p>
                      </div>
                    </div>
                    <button onClick={handleForceAI} className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500 text-white text-[10px] font-bold hover:bg-amber-400 transition">
                      <Zap className="w-3 h-3" />
                      Kích hoạt AI
                    </button>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick prompts */}
              <div className="shrink-0 px-3 py-1.5 flex gap-1.5 overflow-x-auto scrollbar-hide border-t border-slate-800/80 bg-slate-900/40">
                {QUICK_PROMPTS.map((p, i) => (
                  <button key={i} onClick={() => handleSend(p)} className="shrink-0 text-[10px] px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-amber-500/20 hover:text-amber-300 text-slate-300 border border-slate-700/60 transition whitespace-nowrap">
                    {p}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="shrink-0 p-2.5 bg-slate-900 border-t border-slate-800 flex items-center gap-1.5">
                <input
                  id="chat-widget-input"
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder={mode === 'ai' ? 'Hỏi AI bất kỳ điều gì...' : 'Nhắn tin cho Admin...'}
                  className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
                />
                <button
                  id="chat-widget-send-btn"
                  type="button"
                  onClick={() => handleSend()}
                  disabled={!inputText.trim()}
                  className="p-2.5 rounded-xl bg-amber-500 text-white hover:bg-amber-400 disabled:opacity-40 transition shadow"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* KB TAB */}
          {activeTab === 'kb' && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="shrink-0 px-3 py-2.5 bg-slate-800/30 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Kho tri thức ({docs.length})</p>
                  <p className="text-[10px] text-slate-400">AI tham khảo nội dung này để trả lời</p>
                </div>
                <button onClick={() => setShowAddForm((v) => !v)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500 text-white text-[10px] font-bold hover:bg-amber-400 transition">
                  <Plus className="w-3.5 h-3.5" />
                  Thêm tài liệu
                </button>
              </div>

              {showAddForm && (
                <div className="shrink-0 p-3 border-b border-slate-700 bg-slate-800/60 space-y-2">
                  <input
                    type="text"
                    value={newDocTitle}
                    onChange={(e) => setNewDocTitle(e.target.value)}
                    placeholder="Tiêu đề tài liệu..."
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
                  />

                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 font-medium px-0.5">Danh mục</p>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setNewDocCategory(val as AIKnowledgeDoc['category'])}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all ${newDocCategory === val
                            ? 'bg-amber-500 border-amber-500 text-white shadow-sm shadow-amber-500/30'
                            : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-amber-500/50 hover:text-amber-300'
                            }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    value={newDocContent}
                    onChange={(e) => setNewDocContent(e.target.value)}
                    placeholder="Nội dung tài liệu (AI sẽ học từ đây)..."
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none transition"
                  />
                  <input
                    type="text"
                    value={newDocKeywords}
                    onChange={(e) => setNewDocKeywords(e.target.value)}
                    placeholder="Từ khóa (cách nhau bằng dấu phẩy)..."
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddDoc}
                      disabled={!newDocTitle.trim() || !newDocContent.trim()}
                      className="flex-1 py-2 rounded-lg bg-amber-500 text-white text-xs font-bold hover:bg-amber-400 disabled:opacity-40 transition"
                    >
                      Lưu tài liệu
                    </button>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 rounded-lg bg-slate-700 text-slate-300 text-xs hover:bg-slate-600 transition"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}

              <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80">
                {kbLoading ? (
                  <div className="p-6 flex justify-center"><div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>
                ) : docs.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    Chua co tai lieu nao
                  </div>
                ) : (
                  docs.map((doc) => <DocItem key={doc.id} doc={doc} onDelete={() => handleDeleteDoc(doc.id)} />)
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MessageBubble({ msg, onOpenEquipmentDetail }: { msg: ChatMsg; onOpenEquipmentDetail?: (id: string) => void }) {
  if (msg.role === 'system') {
    return (
      <div className="flex justify-center">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/50">
          <AlertCircle className="w-3 h-3 text-blue-400 shrink-0" />
          <span className="text-[10px] text-slate-400">{msg.text}</span>
        </div>
      </div>
    );
  }

  const isUser = msg.role === 'user';
  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} gap-1`}>
      {!isUser && (
        <div className="flex items-center gap-1 px-1">
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center">
            <Bot className="w-3 h-3 text-white" />
          </div>
          <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wide">AI Assistant</span>
          {msg.sourceTitle && (
            <span className="text-[9px] text-slate-500 flex items-center gap-0.5 ml-1">
              <FileText className="w-2.5 h-2.5" />
              {msg.sourceTitle}
            </span>
          )}
        </div>
      )}
      <div className={`max-w-[85%] flex flex-col gap-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
        {msg.matchedEquipment && (
          <div onClick={() => onOpenEquipmentDetail?.(msg.matchedEquipment!.id)} className="w-full p-2.5 rounded-xl bg-slate-800/80 border border-amber-500/30 hover:border-amber-400 cursor-pointer transition flex items-center gap-2.5">
            {msg.matchedEquipment.thumbnail && (
              <img src={msg.matchedEquipment.thumbnail} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold text-white truncate">{msg.matchedEquipment.name}</p>
              <p className="text-[10px] text-amber-400">{msg.matchedEquipment.brand}</p>
              <p className="text-[10px] text-slate-400">{msg.matchedEquipment.priceRange}</p>
            </div>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold whitespace-nowrap shrink-0">Xem chi tiet</span>
          </div>
        )}
        <div className={`px-3 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${isUser ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white font-medium rounded-br-none shadow-md' : msg.status === 'error' ? 'bg-red-900/40 border border-red-500/30 text-red-300 rounded-bl-none' : 'bg-slate-800 text-slate-100 border border-slate-700/60 rounded-bl-none'}`}>
          {msg.text}
        </div>
        <span className="text-[9px] text-slate-500 px-1">
          {msg.createdAt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}

function DocItem({ doc, onDelete }: { doc: AIKnowledgeDoc; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="p-3 hover:bg-slate-800/30 transition">
      <div className="flex items-start gap-2">
        <div className="w-6 h-6 rounded-lg bg-slate-700 flex items-center justify-center shrink-0 mt-0.5">
          <FileText className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{doc.title}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-700 text-slate-300 font-medium">
                  {CATEGORY_LABELS[doc.category] || doc.category}
                </span>
                {doc.authorName && <span className="text-[9px] text-slate-500">{doc.authorName}</span>}
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => setExpanded((v) => !v)} className="p-1 rounded text-slate-400 hover:text-white transition">
                {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              <button onClick={onDelete} className="p-1 rounded text-slate-500 hover:text-red-400 transition">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          {expanded && (
            <div className="mt-2 space-y-1.5">
              <p className="text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap">{doc.content}</p>
              {doc.keywords.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap">
                  <Tag className="w-3 h-3 text-slate-500" />
                  {doc.keywords.map((kw, i) => (
                    <span key={i} className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-700/60 text-slate-400">{kw}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
