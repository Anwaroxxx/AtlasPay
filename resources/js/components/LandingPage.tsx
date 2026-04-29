import { useState, useEffect, useRef, Suspense } from 'react';
import { Link, Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, PerspectiveCamera } from '@react-three/drei';
import { 
  ShieldCheck,
  Globe,
  ArrowRight,
  Linkedin,
  Twitter,
  Instagram,
  Zap,
  Lock,
  Layers,
  Crown,
  Compass,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Lenis from 'lenis';

// --- 3D Background Elements ---

const Scene3D = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} color="#10b981" intensity={2} />
        <pointLight position={[-10, -10, -10]} color="#065f46" intensity={1} />
        
        <Suspense fallback={null}>
          <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
            <Sphere args={[1.5, 100, 100]} position={[2, 0, -2]}>
              <MeshDistortMaterial
                color="#064e3b"
                attach="material"
                distort={0.4}
                speed={2}
                roughness={0.1}
                metalness={1}
                transparent
                opacity={0.3}
              />
            </Sphere>
          </Float>

          <Float speed={2} rotationIntensity={2} floatIntensity={1}>
            <mesh position={[-2, 1, -3]}>
              <octahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color="#10b981" wireframe opacity={0.1} transparent />
            </mesh>
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
};

// --- Custom Components ---

const LuxuryLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
  <Link 
    href={href} 
    className="relative group text-xs uppercase tracking-[0.4em] font-bold text-gray-400 hover:text-emerald-400 transition-colors"
  >
    {children}
    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-emerald-500 transition-all duration-300 group-hover:w-full" />
  </Link>
);

const SectionHeading = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="space-y-4 mb-20 overflow-hidden">
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "circOut" }}
    >
      <div className="flex items-center gap-3 text-emerald-500 mb-4">
        <div className="h-[1px] w-12 bg-emerald-500/30" />
        <span className="text-[10px] uppercase tracking-[0.5em] font-bold">{subtitle}</span>
      </div>
      <h2 className="text-5xl md:text-8xl font-serif font-bold tracking-tighter leading-none">
        {title}
      </h2>
    </motion.div>
  </div>
);

// --- Data ---

const personas = [
  {
    name: 'Karim',
    role: 'Riad Owner',
    location: 'Marrakech',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    quote: "AtlasPay transformed how I manage my property's international bookings.",
  },
  {
    name: 'Yasmine',
    role: 'Architect',
    location: 'Casablanca',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    quote: "The seamless integration with European banks is a game-changer for my firm.",
  },
  {
    name: 'Omar',
    role: 'Entrepreneur',
    location: 'Tangier',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
    quote: "Finally, a bank that understands the pace of modern Moroccan business.",
  },
  {
    name: 'Sarah',
    role: 'Investor',
    location: 'Rabat',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    quote: "The wealth management tools are sophisticated yet incredibly intuitive.",
  },
];

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#010301] text-white selection:bg-emerald-500/30 overflow-x-hidden">
      <Head title="AtlasPay — The Sovereign Standard" />
      
      <Scene3D />
      
      {/* Immersive Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,_transparent_0%,_#010301_100%)] opacity-80" />
      <div className="fixed inset-0 z-0 pointer-events-none moroccan-pattern opacity-[0.03]" />

      {/* --- Navigation --- */}
      <nav className="fixed top-0 left-0 right-0 z-[100] py-8 px-6 md:px-12 backdrop-blur-sm">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-emerald-500/30 flex items-center justify-center bg-[#010301]">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-black font-serif font-bold italic">A</div>
            </div>
            <span className="text-2xl font-serif font-bold tracking-tighter uppercase italic">AtlasPay</span>
          </motion.div>

          <div className="hidden lg:flex items-center gap-12">
            <LuxuryLink href="#ecosystem">Ecosystem</LuxuryLink>
            <LuxuryLink href="#collections">Collections</LuxuryLink>
            <LuxuryLink href="#elite">Elite Services</LuxuryLink>
            <LuxuryLink href="#sovereignty">Sovereignty</LuxuryLink>
          </div>

          <div className="flex items-center gap-8">
            <Link href="/login" className="text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-white transition-colors">
              Access Vault
            </Link>
            <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-10 h-14 rounded-none uppercase tracking-widest text-[10px] shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              Open Account
            </Button>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* --- Hero: The Vogue Entry --- */}
        <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
          <div className="max-w-screen-2xl mx-auto w-full grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 space-y-12">
              <motion.div 
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, ease: "circOut" }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 text-emerald-500">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[10px] uppercase tracking-[0.6em] font-bold">Kingdom Collection 2026</span>
                </div>
                <h1 className="text-8xl md:text-[11rem] font-serif font-bold leading-[0.75] tracking-tighter text-glow">
                  Wealth <br />
                  <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-100">Transcended.</span>
                </h1>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="max-w-xl space-y-10"
              >
                <p className="text-xl text-gray-400 font-light leading-relaxed">
                  Redefining the architecture of Moroccan finance. A seamless fusion of ancestral sovereignty and digital precision.
                </p>
                <div className="flex gap-8 items-center">
                  <Button className="h-20 px-16 bg-white text-black hover:bg-emerald-50 rounded-none text-sm font-bold uppercase tracking-[0.3em] transition-all hover:scale-105">
                    Start Journey
                  </Button>
                  <Link href="#collections" className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest hover:text-emerald-400 transition-colors">
                    Explore Vault <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-5 relative flex items-center justify-center">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0, rotateY: -20 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className="w-full relative group"
              >
                <div className="absolute inset-0 bg-emerald-500/20 blur-[120px] rounded-full group-hover:bg-emerald-500/30 transition-all duration-700" />
                <img 
                  src="/images/card-platinum.png" 
                  alt="Sovereign Platinum" 
                  className="relative w-full h-auto drop-shadow-[0_80px_120px_rgba(0,0,0,0.9)] transition-transform duration-1000 group-hover:scale-105 group-hover:-rotate-3"
                />
                
                {/* Floating Stats */}
                <div className="absolute -bottom-10 -left-10 p-8 glass-card border border-white/5 backdrop-blur-3xl space-y-2">
                  <Lock className="w-5 h-5 text-emerald-500 mb-4" />
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest">Security Protocol</div>
                  <div className="text-2xl font-serif">Level 9 Vault</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- The Grid: Collections --- */}
        <section id="collections" className="py-40 px-6 md:px-12 border-t border-white/5">
          <div className="max-w-screen-2xl mx-auto">
            <SectionHeading title="The Curated Collections." subtitle="Refined Assets" />

            <div className="grid lg:grid-cols-3 gap-0 border border-white/5">
               {[
                 { id: 'emerald', name: 'Emerald',  tier: 'Sovereign', img: '/images/card-emerald.png',  icon: Crown   },
                 { id: 'gold',    name: 'Riad Gold', tier: 'Privilege', img: '/images/card-gold.png',     icon: Compass },
                 { id: 'platinum',name: 'Makhzen',   tier: 'Absolute',  img: '/images/card-platinum.png', icon: Zap     }
               ].map((card, i) => (
                 <motion.div 
                   key={card.id}
                   whileHover={{ backgroundColor: "rgba(16, 185, 129, 0.02)" }}
                   className="p-16 border-white/5 border-l first:border-l-0 flex flex-col space-y-12 transition-all duration-500 group"
                 >
                    <div className="flex justify-between items-start">
                       <div className="space-y-1">
                          <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">{card.tier}</div>
                          <h3 className="text-4xl font-serif italic">{card.name}</h3>
                       </div>
                       <card.icon className="w-6 h-6 text-gray-600 group-hover:text-emerald-500 transition-colors" />
                    </div>
                    
                    <div className="relative aspect-[1.6/1] w-full py-8 overflow-visible">
                       <img 
                          src={card.img} 
                          className="w-full h-full object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.5)] transition-transform duration-700 group-hover:scale-110 group-hover:-translate-y-4"
                          alt={card.name}
                       />
                    </div>

                    <ul className="space-y-4 text-sm text-gray-500 font-light">
                       <li className="flex items-center gap-3"><Layers className="w-3 h-3 text-emerald-500" /> Biometric Authentication</li>
                       <li className="flex items-center gap-3"><Globe className="w-3 h-3 text-emerald-500" /> Worldwide Concierge</li>
                       <li className="flex items-center gap-3"><ShieldCheck className="w-3 h-3 text-emerald-500" /> Limitless Remittance</li>
                    </ul>

                    <Button variant="ghost" className="w-full h-16 border border-white/5 rounded-none group-hover:bg-white group-hover:text-black transition-all text-[10px] uppercase tracking-widest font-bold">
                       Inquire Now
                    </Button>
                 </motion.div>
               ))}
            </div>
          </div>
        </section>

        {/* --- Sovereign Network: Social Proof --- */}
        <section id="elite" className="py-40 bg-[#020402] border-y border-white/5">
           <div className="max-w-screen-2xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-32 items-center">
              <div className="lg:w-1/2 space-y-12">
                 <h2 className="text-6xl md:text-8xl font-serif font-bold tracking-tight leading-none">
                   The Sovereign <br /> <span className="italic text-emerald-500">Network.</span>
                 </h2>
                 <p className="text-xl text-gray-400 font-light leading-relaxed max-w-lg">
                   An exclusive ecosystem of 2.5 million visionaries. We don't just process transactions; we curate financial destinies.
                 </p>
                 <div className="grid grid-cols-2 gap-12 border-t border-white/5 pt-12">
                    <div className="space-y-2">
                       <div className="text-4xl font-serif font-bold tracking-tighter">$12B+</div>
                       <div className="text-[10px] text-gray-500 uppercase tracking-[0.3em]">Volume Annual</div>
                    </div>
                    <div className="space-y-2">
                       <div className="text-4xl font-serif font-bold tracking-tighter">99.9%</div>
                       <div className="text-[10px] text-gray-500 uppercase tracking-[0.3em]">Uptime Guarantee</div>
                    </div>
                 </div>
              </div>

              <div className="lg:w-1/2 relative">
                 <div className="grid grid-cols-2 gap-6 relative">
                    {personas.map((p, i) => (
                      <motion.div 
                        key={i}
                        whileHover={{ y: -10 }}
                        className="p-10 glass-card border border-white/5 space-y-6 group"
                      >
                         <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 grayscale group-hover:grayscale-0 transition-all duration-700">
                            <img src={p.image} className="w-full h-full object-cover" />
                         </div>
                         <div className="space-y-1">
                            <div className="font-serif font-bold italic">{p.name}</div>
                            <div className="text-[10px] text-emerald-500 uppercase tracking-widest">{p.role}</div>
                         </div>
                         <p className="text-xs text-gray-500 italic leading-relaxed">"{p.quote}"</p>
                      </motion.div>
                    ))}
                 </div>
                 {/* Decorative background for the personas */}
                 <div className="absolute -inset-10 bg-emerald-500/5 blur-3xl -z-10 rounded-full" />
              </div>
           </div>
        </section>

        {/* --- Footer: The Final Statement --- */}
        <footer className="pt-40 pb-20 px-6 md:px-12 bg-[#010301]">
           <div className="max-w-screen-2xl mx-auto space-y-32">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-20">
                 <div className="space-y-12">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-full border border-emerald-500/30 flex items-center justify-center text-emerald-500 font-serif font-bold italic">A</div>
                       <span className="text-2xl font-serif font-bold tracking-tighter uppercase italic">AtlasPay</span>
                    </div>
                    <p className="text-gray-500 font-light text-sm leading-relaxed">
                       Boulevard Al Messora Al khedra, Casablanca CFC, Morocco. <br />
                       Regulated by the High Commission of Bank Al-Maghrib.
                    </p>
                    <div className="flex gap-6">
                       {[Linkedin, Twitter, Instagram].map((Icon, i) => (
                         <Link key={i} href="#" className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-gray-500 hover:text-emerald-500 hover:border-emerald-500 transition-all">
                            <Icon className="w-5 h-5" />
                         </Link>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-8">
                    <h5 className="text-[10px] uppercase tracking-[0.4em] font-bold text-emerald-500">The Vault</h5>
                    <ul className="space-y-4 text-sm text-gray-500 font-light">
                       <li><Link href="#" className="hover:text-white">Emerald Sovereign</Link></li>
                       <li><Link href="#" className="hover:text-white">Riad Privilege</Link></li>
                       <li><Link href="#" className="hover:text-white">Absolute Makhzen</Link></li>
                       <li><Link href="#" className="hover:text-white">Vault Security</Link></li>
                    </ul>
                 </div>

                 <div className="space-y-8">
                    <h5 className="text-[10px] uppercase tracking-[0.4em] font-bold text-emerald-500">Elite Hub</h5>
                    <ul className="space-y-4 text-sm text-gray-500 font-light">
                       <li><Link href="#" className="hover:text-white">Private Office</Link></li>
                       <li><Link href="#" className="hover:text-white">Diaspora Elite</Link></li>
                       <li><Link href="#" className="hover:text-white">Asset Concierge</Link></li>
                       <li><Link href="#" className="hover:text-white">Innovation Lab</Link></li>
                    </ul>
                 </div>

                 <div className="space-y-10">
                    <div className="p-10 border border-white/5 bg-white/[0.01] space-y-4">
                       <Lock className="w-6 h-6 text-emerald-500" />
                       <div className="text-xs uppercase tracking-widest font-bold">Encrypted Connection</div>
                       <p className="text-[10px] text-gray-600 leading-relaxed uppercase tracking-widest">
                          Your financial data is protected by military-grade SOC2 Type II protocols and sovereign encryption.
                       </p>
                    </div>
                 </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center gap-10 pt-16 border-t border-white/5">
                 <div className="flex flex-wrap justify-center gap-12 text-[10px] text-gray-600 uppercase tracking-[0.5em] font-bold">
                    <Link href="#">Privacy Vault</Link>
                    <Link href="#">Sovereign Terms</Link>
                    <Link href="#">Compliance</Link>
                 </div>
                 <div className="text-[10px] text-gray-700 uppercase tracking-[0.6em] font-bold italic">
                    © 2026 ATLASPAY BANKING GROUP.
                 </div>
              </div>
           </div>
        </footer>
      </main>

      <style>{`
        .moroccan-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0L61.226 34.549H97.553L68.163 55.902L79.389 90.451L50 69.098L20.611 90.451L31.837 55.902L2.447 34.549H38.774L50 0Z' fill='%2310b981' fill-opacity='0.05'/%3E%3C/svg%3E");
        }
        .text-glow {
          text-shadow: 0 0 30px rgba(16, 185, 129, 0.2);
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(20px);
        }
      `}</style>
    </div>
  );
}
