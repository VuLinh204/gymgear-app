'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  MessageCircle, 
  X, 
  Send, 
  Dumbbell, 
  Image as ImageIcon, 
  ChevronLeft, 
  Check, 
  Sparkles, 
  Paperclip,
  Smile,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { 
  ChatMessage, 
  ChatContact, 
  fetchChatContacts, 
  fetchChatMessages, 
  sendChatMessage 
} from '@/lib/supabaseDB';
import { MOCK_EQUIPMENTS } from '@/data/mockData';

interface ChatWidgetProps {
  onOpenEquipmentDetail?: (equipmentId: string) => void;
}

const QUICK_PROMPTS = [
  '💪 Tư vấn lịch tập Push-Pull-Legs',
  '🏋️ Máy Impulse PT300H có tốt không?',
  '🏷️ Hỏi chính sách chiết khấu VIP',
  '📍 Showroom nào có sẵn máy thử?',
];

export default function ChatWidget({ onOpenEquipmentDetail }: ChatWidgetProps) {
  const { currentUser, isGuest, requestAuth } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [activeContact, setActiveContact] = useState<ChatContact | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>('');
  const [showEquipmentPicker, setShowEquipmentPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChatContacts().then(setContacts);
  }, []);

  useEffect(() => {
    if (activeContact) {
      fetchChatMessages(activeContact.id).then(setMessages);
    }
  }, [activeContact]);

  useEffect(() => {
    if (isOpen && activeContact) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, activeContact]);

  const handleOpenChatWith = (contact: ChatContact) => {
    setActiveContact(contact);
  };

  const handleSend = async (customText?: string) => {
    const textToSend = (customText || inputText).trim();
    if (!textToSend && !selectedEquipmentId) return;

    if (isGuest) {
      requestAuth('login');
      return;
    }

    if (!activeContact) return;

    const newMsg = await sendChatMessage(
      activeContact.id,
      textToSend,
      undefined,
      selectedEquipmentId || undefined,
      currentUser
    );

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setSelectedEquipmentId('');
    setShowEquipmentPicker(false);

    // Tự động phản hồi mô phỏng (Bot/PT reply) sau 1.5s
    setTimeout(async () => {
      let replyText = 'Cảm ơn bạn đã nhắn! Mình đã ghi nhận và sẽ phản hồi chi tiết cho bạn ngay.';
      if (textToSend.includes('Impulse') || textToSend.includes('PT300H')) {
        replyText = 'Dòng Impulse PT300H động cơ AC 4.0HP cực kỳ bền cho phòng tập thương mại hoặc gia đình dùng cường độ cao bạn nhé!';
      } else if (textToSend.includes('VIP') || textToSend.includes('chiết khấu')) {
        replyText = 'Hội viên VIP tại GymGear được chiết khấu trực tiếp 15% khi mua máy và miễn phí lắp đặt toàn quốc!';
      } else if (textToSend.includes('lịch tập') || textToSend.includes('Push-Pull-Legs')) {
        replyText = 'Lịch Push-Pull-Legs 6 buổi/tuần rất hiệu quả: Ngày 1 Ngực/Vai/Tay sau, Ngày 2 Lưng/Tay trước, Ngày 3 Chân/Bụng!';
      }

      const botReply = await sendChatMessage(
        activeContact.id,
        replyText,
        undefined,
        undefined,
        {
          id: activeContact.id,
          name: activeContact.name,
          avatar: activeContact.avatar,
          role: 'user',
          roleTitle: activeContact.roleTitle,
          isVerified: true,
        }
      );
      setMessages((prev) => [...prev, botReply]);
    }, 1200);
  };

  const totalUnread = contacts.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  return (
    <div className="fixed bottom-5 right-5 z-[100] font-sans">
      {/* Nút bấm mở Chat nổi */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-pink-500 text-slate-950 font-bold text-sm shadow-xl shadow-orange-500/30 hover:scale-105 hover:shadow-orange-500/50 transition-all duration-300 focus:outline-none"
        >
          <MessageCircle className="w-5 h-5 fill-slate-950" />
          <span className="hidden sm:inline">Hỏi HLV / Showroom</span>
          {totalUnread > 0 && (
            <span className="w-5 h-5 rounded-full bg-white text-slate-950 font-bold text-xs flex items-center justify-center shadow-md">
              {totalUnread}
            </span>
          )}
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-950 rounded-full animate-ping" />
        </button>
      )}

      {/* Hộp thoại Chat Widget */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[380px] h-[540px] max-h-[85vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-3.5 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between">
            {activeContact ? (
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  onClick={() => setActiveContact(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  title="Quay lại danh sách"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="relative shrink-0">
                  <img
                    src={activeContact.avatar}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover border border-slate-700"
                  />
                  {activeContact.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-900" />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate flex items-center gap-1">
                    {activeContact.name}
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate">
                    {activeContact.roleTitle}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-bold">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white leading-tight">Tư Vấn Gym & Thiết Bị</h3>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Đang trực tuyến
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Đóng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          {activeContact ? (
            /* CONVERSATION VIEW */
            <div className="flex-1 flex flex-col min-h-0 bg-slate-950/60">
              
              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.map((msg) => {
                  const isMe = msg.senderId === currentUser?.id || msg.senderId === 'current_user';
                  const taggedEq = msg.equipmentId
                    ? MOCK_EQUIPMENTS.find((e) => e.id === msg.equipmentId)
                    : null;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-end gap-1.5 max-w-[85%]">
                        {!isMe && (
                          <img
                            src={msg.senderAvatar}
                            alt=""
                            className="w-6 h-6 rounded-full object-cover shrink-0 mb-1"
                          />
                        )}
                        <div
                          className={`p-3 rounded-2xl text-xs leading-relaxed ${
                            isMe
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-medium rounded-br-none shadow-md'
                              : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700/60'
                          }`}
                        >
                          {/* Tagged equipment card trong tin nhắn */}
                          {taggedEq && (
                            <div 
                              onClick={() => onOpenEquipmentDetail?.(taggedEq.id)}
                              className="mb-2 p-2 rounded-xl bg-black/30 border border-white/10 flex items-center gap-2 cursor-pointer hover:border-amber-400 transition"
                            >
                              <img src={taggedEq.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover" />
                              <div className="min-w-0 flex-1">
                                <span className="text-[11px] font-bold text-white block truncate">{taggedEq.name}</span>
                                <span className="text-[10px] text-amber-300 block">{taggedEq.priceRange}</span>
                              </div>
                            </div>
                          )}

                          <p>{msg.text}</p>
                        </div>
                      </div>
                      <span className="text-[9px] text-slate-500 px-1 mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestion Chips */}
              <div className="px-3 py-1.5 flex gap-1.5 overflow-x-auto scrollbar-hide border-t border-slate-800/80 bg-slate-900/40">
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    className="shrink-0 text-[10px] px-2 py-1 rounded-full bg-slate-800/80 hover:bg-amber-500/20 hover:text-amber-300 text-slate-300 border border-slate-700/60 transition"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Tag Equipment Selector nếu đang mở */}
              {showEquipmentPicker && (
                <div className="p-2.5 bg-slate-900 border-t border-slate-800">
                  <span className="text-[10px] font-bold text-slate-300 block mb-1">
                    Chọn máy tập để đính kèm hỏi tư vấn:
                  </span>
                  <select
                    value={selectedEquipmentId}
                    onChange={(e) => setSelectedEquipmentId(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs"
                  >
                    <option value="">-- Không đính kèm máy --</option>
                    {MOCK_EQUIPMENTS.map((eq) => (
                      <option key={eq.id} value={eq.id}>
                        {eq.name} ({eq.brand})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Input Bar */}
              <div className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowEquipmentPicker(!showEquipmentPicker)}
                  className={`p-2 rounded-xl border transition ${
                    selectedEquipmentId
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                  title="Đính kèm máy tập"
                >
                  <Dumbbell className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Nhập tin nhắn tư vấn..."
                  className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />

                <button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={!inputText.trim() && !selectedEquipmentId}
                  className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 disabled:opacity-40 transition shadow"
                  title="Gửi tin nhắn"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

            </div>
          ) : (
            /* CONTACTS LIST VIEW */
            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80 bg-slate-950/40">
              <div className="p-3 bg-amber-500/10 border-b border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Nhắn tin hỏi đáp trực tiếp cùng Master Trainer & Showroom.</span>
              </div>

              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => handleOpenChatWith(contact)}
                  className="p-3.5 flex items-center gap-3 cursor-pointer hover:bg-slate-800/50 transition-colors"
                >
                  <div className="relative shrink-0">
                    <img
                      src={contact.avatar}
                      alt=""
                      className="w-11 h-11 rounded-full object-cover border border-slate-700"
                    />
                    {contact.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900 shadow" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="text-xs font-bold text-white truncate">{contact.name}</h4>
                      <span className="text-[10px] text-slate-500 shrink-0">{contact.lastMessageTime}</span>
                    </div>
                    <p className="text-[11px] text-amber-400/90 font-medium truncate mb-0.5">
                      {contact.roleTitle}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {contact.lastMessage}
                    </p>
                  </div>

                  {contact.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center shrink-0">
                      {contact.unreadCount}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  );
}
