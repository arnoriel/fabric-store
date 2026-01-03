import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';

interface Fabric {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
  description: string;
  colors: string[];
  origin: string;
}

interface FabricModalProps {
  fabric: Fabric | null;
  onClose: () => void;
}

const FabricModal: React.FC<FabricModalProps> = ({ fabric, onClose }) => {
  // Fungsi untuk menangani pemesanan via WhatsApp
  const handleWhatsAppOrder = () => {
    if (!fabric) return;

    const phoneNumber = "6281257571238";
    const message = `Halo, saya ingin memesan ${fabric.name} apakah tersedia?`;
    
    // Encode URI untuk mengubah spasi menjadi %20 agar aman di URL
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Buka di tab baru
    window.open(whatsappUrl, '_blank');
  };

  return (
    <AnimatePresence>
      {fabric && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl flex flex-col md:flex-row no-scrollbar"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-premium-gold hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            {/* Image Section */}
            <div className="md:w-1/2 h-64 md:h-auto relative">
              <img 
                src={fabric.image} 
                alt={fabric.name} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Detail Section */}
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-premium-cream">
              <span className="text-premium-gold tracking-widest uppercase text-xs font-bold mb-2">
                {fabric.origin} • {fabric.category}
              </span>
              <h2 className="text-3xl md:text-4xl font-serif text-premium-black mb-4">{fabric.name}</h2>
              <p className="text-2xl font-light text-premium-gold mb-6">{fabric.price}</p>
              
              <div className="h-0.5 w-12 bg-premium-black/10 mb-6"></div>
              
              <p className="text-gray-600 leading-relaxed mb-6">
                {fabric.description}
              </p>

              <div className="mb-8">
                <p className="text-sm font-bold text-premium-black mb-2 uppercase tracking-wide">Tersedia Warna:</p>
                <div className="flex flex-wrap gap-2">
                  {fabric.colors.map((color, idx) => (
                    <span key={idx} className="px-3 py-1 border border-gray-300 text-xs text-gray-600 uppercase">
                      {color}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tombol yang sudah difungsikan */}
              <button 
                onClick={handleWhatsAppOrder}
                className="flex items-center justify-center gap-2 bg-premium-black text-white py-4 px-6 hover:bg-premium-gold hover:text-premium-black transition-all duration-300 uppercase tracking-widest text-sm font-bold active:scale-95 shadow-lg"
              >
                <ShoppingBag size={18} />
                Pesan Sekarang (WA)
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FabricModal;
