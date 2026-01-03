import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Search, Filter, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import fabricDataRaw from '../data.json';
import FabricModal from '../components/FabricModal';

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

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0 }
};

const Catalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFabric, setSelectedFabric] = useState<Fabric | null>(null);

  const categories = useMemo(() => {
    return ['All', ...new Set(fabricDataRaw.map(item => item.category))];
  }, []);

  const filteredFabrics = useMemo(() => {
    return fabricDataRaw.filter(fabric => {
      const cleanSearch = searchTerm.toLowerCase().trim();
      const matchesSearch = 
        fabric.name.toLowerCase().includes(cleanSearch) || 
        fabric.category.toLowerCase().includes(cleanSearch);

      const matchesCategory = selectedCategory === 'All' || fabric.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-premium-cream pb-20">
      <FabricModal fabric={selectedFabric} onClose={() => setSelectedFabric(null)} />

      {/* Header - Dibuat lebih ringkas untuk mobile */}
      <header className="bg-premium-black text-white pt-10 pb-8 px-6">
        <div className="container mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-premium-gold hover:text-white mb-4 text-[10px] uppercase tracking-widest transition-colors">
            <ArrowLeft size={12} /> Kembali
          </Link>
          <h1 className="text-3xl md:text-5xl font-serif mb-1">Katalog Koleksi</h1>
          <p className="text-gray-400 font-light text-[11px] tracking-wide uppercase opacity-70">Premium Fabric Selection</p>
        </div>
      </header>

      {/* Bar Filter & Search - Sticky Optimization */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="container mx-auto">
          {/* Search Input */}
          <div className="p-4 md:pt-6 md:pb-2">
            <div className="relative max-w-md mx-auto md:mx-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Cari jenis kain..." 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 outline-none focus:border-premium-gold transition-all text-sm rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Pill Filters - Horizontal Scroll Optimized */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-4 pb-4">
            <div className="bg-premium-gold/10 p-2 rounded-lg shrink-0">
               <Filter size={14} className="text-premium-gold" />
            </div>
            <div className="flex gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-1.5 text-[10px] font-bold uppercase tracking-tighter whitespace-nowrap transition-all rounded-full border shadow-sm ${
                    selectedCategory === cat 
                    ? 'bg-premium-black text-white border-premium-black' 
                    : 'bg-white text-gray-500 border-gray-100 hover:border-premium-gold hover:text-premium-black'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="container mx-auto px-4 mt-8">
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedCategory + searchTerm}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8"
          >
            {filteredFabrics.map((fabric) => (
              <motion.div 
                key={fabric.id} 
                variants={itemVariants}
                className="bg-white group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 rounded-sm overflow-hidden border border-gray-50"
                onClick={() => setSelectedFabric(fabric)}
              >
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img 
                    src={fabric.image} 
                    alt={fabric.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/4594434/pexels-photo-4594434.jpeg'; // Fallback jika link mati
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <span className="bg-white/90 backdrop-blur-sm text-premium-black text-[8px] px-2 py-0.5 font-bold uppercase tracking-widest rounded-full shadow-sm">
                        {fabric.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-[9px] text-premium-gold font-bold uppercase tracking-widest mb-1">{fabric.origin}</div>
                  <h3 className="text-sm md:text-base font-serif text-premium-black line-clamp-1 group-hover:text-premium-gold transition-colors">{fabric.name}</h3>
                  <div className="mt-2 flex justify-between items-center">
                    <p className="text-premium-black font-bold text-xs">{fabric.price}</p>
                    <div className="w-5 h-5 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-premium-gold group-hover:border-premium-gold transition-all">
                        <ArrowLeft size={10} className="rotate-180 text-gray-400 group-hover:text-white" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Catalog;