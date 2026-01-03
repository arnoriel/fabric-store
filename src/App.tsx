import { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { 
  MapPin, Phone, Mail, ArrowRight, Menu, X, 
  CheckCircle2, Users, ShoppingBag, Truck, Award 
} from 'lucide-react';
import L from 'leaflet';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Chatbot from './components/Chatbot';

// Import Data dan Komponen
import fabricData from './data.json';
import FabricModal from './components/FabricModal';
import Catalog from './pages/Catalog';

// --- Fix Icon Leaflet ---
import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: iconMarker,
    iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- HOME PAGE COMPONENT ---
const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedFabric, setSelectedFabric] = useState<any>(null);
  const navigate = useNavigate();

  const featuredFabrics = fabricData.slice(0, 3);
  const position: [number, number] = [-6.927233, 107.575631];

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  };

  return (
    <div className="overflow-x-hidden selection:bg-premium-gold selection:text-premium-black">
      <FabricModal fabric={selectedFabric} onClose={() => setSelectedFabric(null)} />
      
      {/* --- NAVBAR --- */}
      <nav className="fixed w-full z-50 bg-premium-black/95 backdrop-blur-md text-premium-cream border-b border-premium-gold/10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="flex flex-col">
              <span className="text-xl font-serif font-bold tracking-tighter leading-none">IRUKA</span>
              <span className="text-[10px] text-premium-gold tracking-[0.3em] uppercase">Fabric Store</span>
            </div>
          </div>
          
          <div className="hidden md:flex gap-10 font-medium tracking-wide text-xs uppercase">
            {['Beranda', 'Koleksi', 'Layanan', 'Lokasi'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-premium-gold transition-all duration-300 relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-premium-gold transition-all group-hover:w-full"></span>
              </a>
            ))}
          </div>

          <button className="md:hidden text-premium-gold" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="md:hidden bg-premium-black border-t border-premium-gold/10 p-8 flex flex-col gap-6 text-center text-lg font-serif">
             {['Beranda', 'Koleksi', 'Layanan', 'Lokasi'].map(item => (
               <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsMenuOpen(false)} className="text-white hover:text-premium-gold uppercase tracking-widest">{item}</a>
             ))}
          </motion.div>
        )}
      </nav>

     {/* --- HERO SECTION --- */}
      <section id="beranda" className="relative h-screen flex items-center justify-center bg-premium-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
            src="https://images.unsplash.com/photo-1620733723572-11c53f73a2ad?q=80&w=2000" 
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-premium-black/60 via-transparent to-premium-black"></div>
        </div>

        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="relative z-10 text-center px-4 max-w-5xl">
          <span className="inline-block px-4 py-1 border border-premium-gold text-premium-gold text-[10px] uppercase tracking-[0.4em] mb-8 animate-pulse">Bandung's Textile Destination</span>
          <h1 className="text-5xl md:text-8xl font-serif text-white mb-8 leading-tight tracking-tighter">
            Elegansi dalam <span className="italic font-light text-premium-gold">Setiap Serat</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl font-light mb-12 max-w-2xl mx-auto leading-relaxed">
            Menghadirkan kurasi kain premium dari lokal hingga mancanegara. Solusi tekstil terbaik untuk penjahit profesional, desainer, dan bisnis fashion Anda.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/catalog')} className="px-10 py-4 bg-premium-gold text-premium-black hover:bg-white transition-all duration-300 uppercase tracking-widest text-sm font-bold shadow-2xl">
              Lihat Katalog
            </button>
            <button onClick={() => document.getElementById('location')?.scrollIntoView({behavior: 'smooth'})} className="px-10 py-4 border border-white/30 text-white hover:bg-white hover:text-premium-black transition-all duration-300 uppercase tracking-widest text-sm font-bold backdrop-blur-sm">
              Lokasi Toko
            </button>
          </div>
        </motion.div>
      </section>

      {/* --- STATS COUNTER --- */}
      <section className="py-16 bg-premium-black border-y border-premium-gold/10">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Koleksi Kain", val: "500+", icon: ShoppingBag },
            { label: "Pelanggan Puas", val: "10k+", icon: Users },
            { label: "Tahun Berdiri", val: "1998", icon: Award },
            { label: "Pengiriman", val: "Nasional", icon: Truck }
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center">
              <s.icon className="text-premium-gold mb-3 w-6 h-6" />
              <h4 className="text-3xl font-serif text-white">{s.val}</h4>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- SERVICES / LAYANAN --- */}
      <section id="layanan" className="py-24 bg-premium-cream">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4 text-white">
            <div className="max-w-xl">
              <h2 className="text-4xl font-serif text-premium-black mb-4 leading-tight">Melayani Kebutuhan Tekstil Anda secara Menyeluruh</h2>
              <div className="w-20 h-1 bg-premium-gold"></div>
            </div>
            <p className="text-gray-600 max-w-md text-sm leading-relaxed">Dari kebutuhan personal hingga pesanan partai besar, Iruka Fabric berkomitmen memberikan material terbaik.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Penjualan Eceran", desc: "Tersedia ribuan motif kain untuk kebutuhan busana harian maupun pesta dengan potongan presisi." },
              { title: "Grosir & Partai", desc: "Harga khusus untuk pemilik brand fashion dan toko kain lokal dengan sistem roll-an." },
              { title: "Custom Seragam", desc: "Konsultasi pemilihan bahan untuk seragam kantor, sekolah, hingga organisasi dengan kualitas seragam." }
            ].map((item, idx) => (
              <motion.div key={idx} whileHover={{ y: -10 }} className="p-10 bg-white shadow-sm border border-gray-100 relative group">
                <CheckCircle2 className="w-8 h-8 text-premium-gold mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-serif font-bold mb-4 text-premium-black uppercase">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURED COLLECTION --- */}
      <section id="koleksi" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-premium-gold font-bold tracking-[0.3em] uppercase text-[10px]">Spotlight</span>
            <h2 className="text-4xl font-serif text-premium-black mt-2">Koleksi Terpopuler</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10 mb-16">
            {featuredFabrics.map((fabric) => (
              <motion.div key={fabric.id} whileHover={{ y: -10 }} className="group cursor-pointer" onClick={() => setSelectedFabric(fabric)}>
                <div className="relative overflow-hidden aspect-[3/4] mb-6 shadow-2xl">
                  <img src={fabric.image} alt={fabric.name} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-premium-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end">
                    <p className="text-premium-gold text-xs uppercase tracking-widest mb-2">{fabric.category}</p>
                    <span className="text-white font-serif text-xl">Klik untuk Detail</span>
                  </div>
                </div>
                <h3 className="text-xl font-serif text-premium-black uppercase tracking-tighter">{fabric.name}</h3>
                <p className="text-premium-gold font-bold mt-1">{fabric.price}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center">
            <button onClick={() => navigate('/catalog')} className="group flex items-center gap-4 mx-auto px-12 py-5 bg-premium-black text-white hover:bg-premium-gold hover:text-premium-black transition-all duration-500 uppercase tracking-widest text-xs font-bold shadow-xl">
              Jelajahi Semua Produk <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* --- MAP & LOCATION --- */}
      <section id="lokasi" className="py-24 bg-premium-black text-white">
        <div className="container mx-auto px-6 flex flex-col md:flex-row gap-16">
          <div className="md:w-5/12 flex flex-col justify-center">
            <h2 className="text-5xl font-serif mb-8 text-premium-gold leading-tight">Butik Kami di Pasirkoja</h2>
            <div className="space-y-8">
              <div className="flex items-start gap-6 border-l-2 border-premium-gold/30 pl-6">
                <MapPin className="text-premium-gold shrink-0 w-6 h-6" />
                <div>
                  <h5 className="font-bold uppercase text-xs tracking-widest mb-2 text-premium-gold">Alamat Utama</h5>
                  <p className="text-gray-300 font-light leading-relaxed">
                    Jl. Terusan Pasirkoja No.238A, Babakan,<br/>Kec. Babakan Ciparay, Kota Bandung, Jawa Barat 40223
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-6 border-l-2 border-premium-gold/30 pl-6">
                <Phone className="text-premium-gold shrink-0 w-6 h-6" />
                <div>
                  <h5 className="font-bold uppercase text-xs tracking-widest mb-2 text-premium-gold">Customer Service</h5>
                  <p className="text-gray-300 font-light">+62 812-5757-1238</p>
                </div>
              </div>
              <div className="flex items-start gap-6 border-l-2 border-premium-gold/30 pl-6">
                <Mail className="text-premium-gold shrink-0 w-6 h-6" />
                <div>
                  <h5 className="font-bold uppercase text-xs tracking-widest mb-2 text-premium-gold">Email & Kerjasama</h5>
                  <p className="text-gray-300 font-light">official@irukafabric.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-7/12 h-[500px] border border-premium-gold/20 rounded-sm overflow-hidden relative z-0 shadow-2xl">
            <MapContainer center={position} zoom={16} scrollWheelZoom={false} className="w-full h-full">
              <TileLayer
                attribution='&copy; CARTO'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" 
              />
              <Marker position={position}>
                <Popup className="font-sans">
                  <div className="p-2">
                    <b className="text-lg">IRUKA Fabric Store</b><br />
                    <span className="text-xs text-gray-500 uppercase tracking-tighter">Pusat Tekstil Pasirkoja</span>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#050505] text-gray-500 py-20 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl font-serif font-bold text-white tracking-wider">IRUKA FABRIC</span>
              </div>
              <p className="max-w-sm text-sm leading-relaxed font-light">
                Destinasi belanja kain terpercaya sejak 1998. Kami percaya bahwa setiap karya busana yang indah dimulai dari material yang berkualitas tinggi.
              </p>
            </div>
            <div>
              <h5 className="text-white uppercase text-xs font-bold tracking-[0.2em] mb-6">Navigasi</h5>
              <ul className="space-y-4 text-xs uppercase tracking-widest">
                <li><a href="#beranda" className="hover:text-premium-gold transition-colors">Beranda</a></li>
                <li><a href="#koleksi" className="hover:text-premium-gold transition-colors">Koleksi</a></li>
                <li><a href="#layanan" className="hover:text-premium-gold transition-colors">Layanan</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white uppercase text-xs font-bold tracking-[0.2em] mb-6">Jam Operasional</h5>
              <ul className="space-y-2 text-sm font-light">
                <li className="flex justify-between"><span>Senin - Sabtu</span> <span>09:00 - 17:00</span></li>
                <li className="flex justify-between text-premium-gold"><span>Minggu</span> <span>Tutup</span></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-white/5 gap-4">
            <p className="text-[10px] uppercase tracking-widest">© 2026 Iruka Fabric Store Bandung. Crafted for Excellence.</p>
            <div className="flex gap-8">
              <span className="text-[10px] uppercase tracking-widest hover:text-white cursor-pointer">Instagram</span>
              <span className="text-[10px] uppercase tracking-widest hover:text-white cursor-pointer">WhatsApp</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
      </Routes>
      <Chatbot />
    </Router>
  );
};

export default App;
