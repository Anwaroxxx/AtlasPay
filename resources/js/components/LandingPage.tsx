import { Link, Head } from '@inertiajs/react';
import { Float, MeshDistortMaterial, Sphere, PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import Lenis from 'lenis';
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
import { useEffect, useRef, Suspense } from 'react';
import CardSwap, { Card } from '@/components/CardSwap';
import { Button } from '@/components/ui/button';


const Scene3D = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} color="#76b182" intensity={2} />
        <pointLight position={[-10, -10, -10]} color="#36694b" intensity={1} />
        
        <Suspense fallback={null}>
          <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
            <Sphere args={[1.5, 100, 100]} position={[2, 0, -2]}>
              <MeshDistortMaterial
                color="#36694b"
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
              <meshStandardMaterial color="#76b182" wireframe opacity={0.1} transparent />
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
      <h2 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter leading-none">
        {title}
      </h2>
    </motion.div>
  </div>
);


const personas = [];

const features = [
  { icon: Lock, title: 'Absolute Sovereignty', description: 'Your assets are protected by military-grade encryption and sovereign-level protocols.' },
  { icon: Zap, title: 'Quantum Precision', description: 'Real-time settlement architecture designed for the speed of modern global finance.' },
  { icon: ShieldCheck, title: 'Immutable Trust', description: 'Regulated by Bank Al-Maghrib with transparent, audited vault management.' },
];

export default function LandingPage() {
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
    <div ref={containerRef} className="min-h-screen bg-[#010301] text-white selection:bg-brand-medium/30 overflow-x-hidden">
      <Head title="AtlasPay — The Sovereign Standard" />
      
      <Scene3D />
      
      {/* Immersive Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,_transparent_0%,_#010301_100%)] opacity-80" />
      <div className="fixed inset-0 z-0 pointer-events-none moroccan-pattern opacity-[0.03]" />

      {/* --- Navigation --- */}
      <nav className="fixed top-0 left-0 right-0 z-[100] py-6 px-6 md:px-12 backdrop-blur-md bg-black/10 border-b border-white/5">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-brand-medium/30 flex items-center justify-center bg-[#010301]">
              <div className="w-6 h-6 rounded-full bg-brand-medium flex items-center justify-center text-black font-serif font-bold italic text-sm">A</div>
            </div>
            <span className="text-xl font-serif font-bold tracking-tighter uppercase italic">AtlasPay</span>
          </motion.div>

          <div className="hidden lg:flex items-center gap-10">
            <LuxuryLink href="#why-us">Why Us</LuxuryLink>
            <LuxuryLink href="#collections">Collections</LuxuryLink>
            <LuxuryLink href="#elite">Elite Services</LuxuryLink>
            <LuxuryLink href="#sovereignty">Sovereignty</LuxuryLink>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-brand-medium transition-colors">
              Access Vault
            </Link>
            <Link href="/register">
              <Button className="bg-brand-medium hover:bg-brand-light text-black font-bold px-8 h-12 rounded-none uppercase tracking-widest text-[10px] shadow-[0_0_30px_rgba(118,177,130,0.2)] cursor-pointer">
                Open Account
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* --- Hero: The Vogue Entry --- */}
        <section className="relative min-h-screen flex items-center justify-center px-6 pt-32 pb-20">
          <div className="max-w-screen-2xl mx-auto w-full grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 space-y-12">
              <motion.div 
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, ease: "circOut" }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 text-brand-medium">
                  <div className="h-2 w-2 rounded-full bg-brand-medium animate-ping" />
                  <span className="text-[10px] uppercase tracking-[0.6em] font-bold">Kingdom Collection 2026</span>
                </div>
                <h1 className="text-7xl md:text-9xl font-serif font-bold leading-[0.85] tracking-tighter text-glow">
                  Wealth <br />
                  <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-brand-medium to-brand-light">Transcended.</span>
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
                  <Link href="/register">
                    <Button className="h-20 px-16 bg-white text-black hover:bg-brand-light rounded-none text-sm font-bold uppercase tracking-[0.3em] transition-all hover:scale-105 cursor-pointer">
                      Start Journey
                    </Button>
                  </Link>
                  <Link href="#collections" className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest hover:text-brand-medium transition-colors">
                    Explore Vault <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className="w-full relative group max-w-[500px]"
              >
                <div className="absolute inset-0 bg-brand-medium/20 blur-[120px] rounded-full group-hover:bg-brand-medium/30 transition-all duration-700" />
                <img 
                  src="/images/card-platinum.png" 
                  alt="Sovereign Platinum" 
                  className="relative w-full h-auto drop-shadow-[0_80px_120px_rgba(0,0,0,0.9)] transition-transform duration-1000 group-hover:scale-105 group-hover:-rotate-3"
                />
              </motion.div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
          >
            <span className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold">Scroll to Explore</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-brand-medium to-transparent" />
          </motion.div>
        </section>

        {/* --- Why Us: The Architectural Standard --- */}
        <section id="why-us" className="py-40 px-6 md:px-12 bg-[#020402] border-y border-white/5">
           <div className="max-w-screen-2xl mx-auto grid lg:grid-cols-12 gap-24 items-center">
              <div className="lg:col-span-6 space-y-16">
                 <SectionHeading title="The Architectural Standard." subtitle="Why AtlasPay" />
                 
                 <div className="space-y-12">
                    {features.map((f, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.2 }}
                        className="flex gap-8 group"
                      >
                         <div className="flex-shrink-0 w-16 h-16 border border-white/5 flex items-center justify-center group-hover:border-brand-medium/50 transition-colors">
                            <f.icon className="w-6 h-6 text-brand-medium" />
                         </div>
                         <div className="space-y-3">
                            <h4 className="text-xl font-serif font-bold">{f.title}</h4>
                            <p className="text-gray-500 font-light leading-relaxed max-w-md">{f.description}</p>
                         </div>
                      </motion.div>
                    ))}
                 </div>
              </div>

              <div className="lg:col-span-6 relative flex items-center justify-center min-h-[600px]">
                 <div className="w-full relative max-w-[550px]">
                    <div className="absolute inset-0 bg-brand-medium/10 blur-[100px] rounded-full" />
                    <div className="relative z-10 w-full aspect-[4/3]">
                       <CardSwap width="100%" height="100%" cardDistance={40} verticalDistance={50}>
                          <Card className="p-4 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-white/5 shadow-2xl">
                             <img src="/images/card-platinum.png" className="w-full h-full object-contain" alt="Platinum" />
                          </Card>
                          <Card className="p-4 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-white/5 shadow-2xl">
                             <img src="/images/card-gold.png" className="w-full h-full object-contain" alt="Gold" />
                          </Card>
                          <Card className="p-4 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-white/5 shadow-2xl">
                             <img src="/images/card-emerald.png" className="w-full h-full object-contain" alt="Emerald" />
                          </Card>
                       </CardSwap>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* --- The Grid: Collections --- */}
        <section id="collections" className="py-40 px-6 md:px-12 border-b border-white/5">
          <div className="max-w-screen-2xl mx-auto">
            <SectionHeading title="The Curated Collections." subtitle="Refined Assets" />

            <div className="grid lg:grid-cols-3 gap-0 border border-white/5">
               {[
                 { id: 'emerald', name: 'Emerald',  tier: 'Sovereign', img: '/images/card-emerald.png',  icon: Crown   },
                 { id: 'gold',    name: 'Riad Gold', tier: 'Privilege', img: '/images/card-gold.png',     icon: Compass },
                 { id: 'platinum',name: 'Makhzen',   tier: 'Absolute',  img: '/images/card-platinum.png', icon: Zap     }
               ].map((card) => (
                 <motion.div 
                   key={card.id}
                   whileHover={{ backgroundColor: "rgba(118, 177, 130, 0.02)" }}
                   className="p-16 border-white/5 border-l first:border-l-0 flex flex-col space-y-12 transition-all duration-500 group"
                 >
                    <div className="flex justify-between items-start">
                       <div className="space-y-1">
                          <div className="text-[10px] text-brand-medium font-bold uppercase tracking-widest">{card.tier}</div>
                          <h3 className="text-4xl font-serif italic">{card.name}</h3>
                       </div>
                       <card.icon className="w-6 h-6 text-gray-600 group-hover:text-brand-medium transition-colors" />
                    </div>
                    
                    <div className="relative aspect-[1.6/1] w-full py-8 overflow-visible">
                       <img 
                          src={card.img} 
                          className="w-full h-full object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.5)] transition-transform duration-700 group-hover:scale-110 group-hover:-translate-y-4"
                          alt={card.name}
                       />
                    </div>

                    <ul className="space-y-4 text-sm text-gray-500 font-light">
                       <li className="flex items-center gap-3"><Layers className="w-3 h-3 text-brand-medium" /> Biometric Authentication</li>
                       <li className="flex items-center gap-3"><Globe className="w-3 h-3 text-brand-medium" /> Worldwide Concierge</li>
                       <li className="flex items-center gap-3"><ShieldCheck className="w-3 h-3 text-brand-medium" /> Limitless Remittance</li>
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
        <section id="elite" className="py-40 border-b border-white/5">
           <div className="max-w-screen-2xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-32 items-center">
              <div className="lg:w-1/2 space-y-12">
                 <h2 className="text-6xl md:text-8xl font-serif font-bold tracking-tight leading-none">
                   The Sovereign <br /> <span className="italic text-brand-medium">Network.</span>
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
                        whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(118, 177, 130, 0.1)" }}
                        className="p-10 glass-card border border-white/5 space-y-6 group transition-colors hover:border-brand-medium/20"
                      >
                         <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 grayscale group-hover:grayscale-0 transition-all duration-700">
                            <img src={p.image} className="w-full h-full object-cover" />
                         </div>
                         <div className="space-y-1">
                            <div className="font-serif font-bold italic">{p.name}</div>
                            <div className="text-[10px] text-brand-medium uppercase tracking-widest">{p.role}</div>
                         </div>
                         <p className="text-xs text-gray-500 italic leading-relaxed">"{p.quote}"</p>
                      </motion.div>
                    ))}
                 </div>
                 {/* Decorative background for the personas */}
                 <div className="absolute -inset-10 bg-brand-medium/5 blur-3xl -z-10 rounded-full" />
              </div>
           </div>
        </section>

        {/* --- Footer: The Final Statement --- */}
        <footer className="pt-40 pb-20 px-6 md:px-12 bg-[#010301]">
           <div className="max-w-screen-2xl mx-auto space-y-32">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-20">
                 <div className="space-y-12">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-full border border-brand-medium/30 flex items-center justify-center text-brand-medium font-serif font-bold italic">A</div>
                       <span className="text-2xl font-serif font-bold tracking-tighter uppercase italic">AtlasPay</span>
                    </div>
                    <p className="text-gray-500 font-light text-sm leading-relaxed">
                       Boulevard Al Messora Al khedra, Casablanca CFC, Morocco. <br />
                       Regulated by the High Commission of Bank Al-Maghrib.
                    </p>
                    <div className="flex gap-6">
                       {[Linkedin, Twitter, Instagram].map((Icon) => (
                         <Link key={Icon.name} href="#" className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-gray-500 hover:text-brand-medium hover:border-brand-medium transition-all">
                            <Icon className="w-5 h-5" />
                         </Link>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-8">
                    <h5 className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-medium">The Vault</h5>
                    <ul className="space-y-4 text-sm text-gray-500 font-light">
                       <li><Link href="#" className="hover:text-white">Emerald Sovereign</Link></li>
                       <li><Link href="#" className="hover:text-white">Riad Privilege</Link></li>
                       <li><Link href="#" className="hover:text-white">Absolute Makhzen</Link></li>
                       <li><Link href="#" className="hover:text-white">Vault Security</Link></li>
                    </ul>
                 </div>

                 <div className="space-y-8">
                    <h5 className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-medium">Elite Hub</h5>
                    <ul className="space-y-4 text-sm text-gray-500 font-light">
                       <li><Link href="#" className="hover:text-white">Private Office</Link></li>
                       <li><Link href="#" className="hover:text-white">Diaspora Elite</Link></li>
                       <li><Link href="#" className="hover:text-white">Asset Concierge</Link></li>
                       <li><Link href="#" className="hover:text-white">Innovation Lab</Link></li>
                    </ul>
                 </div>

                 <div className="space-y-10">
                    <div className="p-10 border border-white/5 bg-white/[0.01] space-y-4">
                       <Lock className="w-6 h-6 text-brand-medium" />
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
        :root {
          --brand-medium: #76b182;
          --brand-light: #c9e6c3;
          --brand-dark: #36694b;
        }
        .text-brand-medium { color: var(--brand-medium); }
        .bg-brand-medium { background-color: var(--brand-medium); }
        .border-brand-medium { border-color: var(--brand-medium); }
        .from-brand-medium { --tw-gradient-from: var(--brand-medium) !important; --tw-gradient-to: rgb(118 177 130 / 0) !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important; }
        .to-brand-light { --tw-gradient-to: var(--brand-light) !important; }
        .hover\\:text-brand-medium:hover { color: var(--brand-medium); }
        .hover\\:bg-brand-light:hover { background-color: var(--brand-light); }
        .hover\\:border-brand-medium:hover { border-color: var(--brand-medium); }
        .selection\\:bg-brand-medium\\/30 *::selection { background-color: rgb(118 177 130 / 0.3); }

        .moroccan-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0L61.226 34.549H97.553L68.163 55.902L79.389 90.451L50 69.098L20.611 90.451L31.837 55.902L2.447 34.549H38.774L50 0Z' fill='%2376b182' fill-opacity='0.05'/%3E%3C/svg%3E");
        }
        .text-glow {
          text-shadow: 0 0 30px rgba(118, 177, 130, 0.2);
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(20px);
        }
      `}</style>
    </div>
  );
}
