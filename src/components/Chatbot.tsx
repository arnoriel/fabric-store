import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2, Scissors, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSmartResponse, type ChatMessage } from '../utils/ailogic';
import fabricData from '../data.json';
import FabricModal from './FabricModal';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [selectedFabric, setSelectedFabric] = useState<any>(null);

  const initialMessage: ChatMessage[] = [
    { role: 'assistant', content: 'Halo! Saya asisten Iruka Fabric. Ada yang bisa saya bantu cari?' }
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem('iruca_fabric_chat');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : initialMessage;
    } catch (e) {
      return initialMessage;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sessionStorage.setItem('iruca_fabric_chat', JSON.stringify(messages));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleResetChat = () => {
    setMessages(initialMessage);
    sessionStorage.removeItem('iruca_fabric_chat');
    setInput('');
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const result = await getSmartResponse(input, messages);
    const aiMsg: ChatMessage = { 
      role: 'assistant', 
      content: result.text, 
      fabricIds: result.fabricIds 
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  return (
    <>
      {/* 1. MODAL DI TARUH DI LUAR ANIMATE PRESENCE CHAT AGAR TIDAK TERPOTONG */}
      <FabricModal fabric={selectedFabric} onClose={() => setSelectedFabric(null)} />

      {/* 2. FLOATING BUTTON */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[60] bg-premium-black text-premium-gold p-4 rounded-full shadow-2xl border border-premium-gold/30 hover:scale-110 transition-transform active:scale-90"
      >
        <MessageCircle size={28} />
      </button>

      {/* 3. JENDELA CHAT */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed inset-0 md:inset-auto md:bottom-24 md:right-6 md:w-[400px] md:h-[600px] bg-white z-[70] flex flex-col shadow-2xl md:rounded-2xl overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="bg-premium-black p-4 flex justify-between items-center border-b border-premium-gold/30 shrink-0">
              <div className="flex items-center gap-2">
                <div className="bg-premium-gold/20 p-2 rounded-lg">
                  <Scissors size={18} className="text-premium-gold" />
                </div>
                <div>
                  <h3 className="text-white font-serif text-sm">Iruka Fabric AI</h3>
                  <p className="text-[10px] text-premium-gold uppercase tracking-widest">Online Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleResetChat} className="text-white/50 hover:text-premium-gold transition-colors">
                  <RotateCcw size={16} />
                </button>
                <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-premium-cream/30 no-scrollbar">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' ? 'bg-premium-black text-white rounded-tr-none' : 'bg-white text-premium-black shadow-sm rounded-tl-none border border-gray-100'
                  }`}>
                    {msg.content}
                    
                    {/* Rekomendasi Kain */}
                    {msg.fabricIds && msg.fabricIds.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {msg.fabricIds.map(id => {
                          const fabric = fabricData.find(f => f.id === id);
                          if (!fabric) return null;
                          return (
                            <button 
                              key={id} 
                              onClick={() => setSelectedFabric(fabric)}
                              className="w-full flex gap-2 p-2 bg-premium-cream/50 rounded-lg border border-premium-gold/10 hover:border-premium-gold hover:bg-white transition-all text-left active:scale-95"
                            >
                              <img src={fabric.image} className="w-12 h-12 object-cover rounded shadow-sm" alt={fabric.name} />
                              <div className="flex flex-col justify-center overflow-hidden">
                                <p className="text-[10px] font-bold truncate text-premium-black">{fabric.name}</p>
                                <p className="text-[9px] text-premium-gold font-semibold">{fabric.price}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                    <Loader2 className="animate-spin text-premium-gold" size={16} />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100 shrink-0">
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Tanya tentang kain..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:border-premium-gold transition-all"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading}
                  className="bg-premium-black text-premium-gold p-2 rounded-full hover:bg-premium-gold hover:text-premium-black transition-all"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
