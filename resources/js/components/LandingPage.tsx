import { Link, Head } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  ShieldCheck,
  Globe,
  ArrowRight,
  Zap,
  Lock,
  Layers,
  Crown,
  Compass,
  Activity,
  Plus,
  MousePointer2,
  Sparkles
} from 'lucide-react';
import { home } from '@/routes';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import CardSwap, { Card } from '@/components/CardSwap';

const features = [
  { icon: Lock, title: 'Absolute Security', description: 'Military-grade encryption protocols and sovereign-level protection for all assets.' },
  { icon: Zap, title: 'Instant Settlement', description: 'Real-time transaction architecture designed for the speed of modern global finance.' },
  { icon: ShieldCheck, title: 'Regulatory Trust', description: 'Fully compliant and audited vault management with transparent reporting.' },
];

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#010301] text-white selection:bg-primary/30 overflow-x-hidden font-sans">
      <Head title="AtlasPay — The Sovereign Standard" />
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-success/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,_transparent_0%,_#010301_80%)]" />
      </div>
      <div className="fixed inset-0 z-0 pointer-events-none moroccan-pattern opacity-[0.03]" />
      
      {/* --- Smart Floating Navbar --- */}
      <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center py-8 px-6 transition-all duration-500">
        <motion.nav 
          animate={{ 
            width: isScrolled ? 'auto' : '100%',
            y: isScrolled ? 10 : 0,
          }}
          className={`max-w-screen-2xl flex items-center justify-between backdrop-blur-2xl border transition-all duration-500 ${
            isScrolled 
            ? 'bg-white/[0.03] border-white/10 rounded-full px-8 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' 
            : 'bg-transparent border-transparent px-8 py-4 w-full'
          }`}
        >
          <div className="flex items-center gap-4">
            <Link href={home()} className="flex items-center">
              <img 
                src="/images/logos/darkmode-Photoroom.png" 
                alt="AtlasPay Logo" 
                className={`object-contain transition-all ${isScrolled ? 'h-12' : 'h-24'}`}
              />
            </Link>
          </div>

          <div className={`flex items-center gap-8 ${isScrolled ? 'mx-8' : ''}`}>
            {['Vault', 'Elite', 'Archive'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-[10px] uppercase tracking-[0.3em] font-black text-white/50 hover:text-primary transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="text-[10px] uppercase tracking-widest font-black text-white/40 hover:text-white transition-colors">
              Access
            </Link>
            <Link href="/register">
              <Button className="bg-primary hover:bg-success text-white font-black px-8 h-11 rounded-full uppercase tracking-widest text-[9px] shadow-elevated transition-all hover:scale-[1.05] border-none">
                Get Started
              </Button>
            </Link>
          </div>
        </motion.nav>
      </div>

      <main className="relative z-10">
        {/* --- Hero --- */}
        <section className="relative min-h-screen flex items-center justify-center px-6 pt-32 pb-20">
          <div className="max-w-screen-2xl mx-auto w-full grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 space-y-12">
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                className="space-y-8"
              >
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span className="text-[9px] uppercase tracking-[0.5em] font-black">Kingdom Collection 2026</span>
                </div>
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-black leading-[0.82] tracking-tighter uppercase">
                  Wealth <br />
                  <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-primary via-success to-emerald-400">Transcended.</span>
                </h1>
                <p className="text-xl text-white/50 font-medium leading-relaxed max-w-xl">
                  Redefining the architecture of Moroccan finance. A seamless fusion of ancestral sovereignty and digital precision.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="flex flex-col sm:flex-row gap-8 items-start sm:items-center"
              >
                <Link href="/register">
                  <Button className="h-20 px-16 bg-white text-black hover:bg-primary hover:text-white rounded-full text-xs font-black uppercase tracking-[0.3em] transition-all hover:scale-[1.05] shadow-[0_20px_80px_rgba(255,255,255,0.1)] border-none">
                    Begin Journey
                  </Button>
                </Link>
                <div className="flex flex-col gap-2">
                   <div className="flex -space-x-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-10 w-10 rounded-full border-2 border-[#010301] bg-neutral-800 overflow-hidden ring-1 ring-white/5 transition-transform hover:scale-110 hover:z-10">
                           <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" className="w-full h-full grayscale hover:grayscale-0 transition-all" />
                        </div>
                      ))}
                   </div>
                   <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                     Trusted by <span className="text-white">+2.5M visionaries</span>
                   </div>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-5 relative group">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0, rotateY: 30 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
                className="w-full relative [perspective:2000px]"
              >
                <div className="absolute inset-0 bg-primary/20 blur-[150px] rounded-full group-hover:bg-primary/30 transition-all duration-700" />
                <motion.img 
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  src="/images/card-platinum.png" 
                  alt="Platinum Card" 
                  className="relative w-full h-auto drop-shadow-[0_80px_120px_rgba(0,0,0,1)] rotate-[-12deg] group-hover:rotate-0 transition-all duration-1000 ease-out cursor-pointer"
                />
              </motion.div>
            </div>
          </div>

          <motion.div 
            style={{ opacity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
          >
            <div className="w-[1px] h-16 bg-gradient-to-b from-primary/50 via-primary to-transparent" />
            <MousePointer2 className="w-4 h-4 text-primary animate-bounce" />
          </motion.div>
        </section>

        {/* --- Stats Row --- */}
        <section className="py-24 border-y border-white/5 relative">
          <div className="absolute inset-0 bg-white/[0.01] backdrop-blur-3xl" />
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12 relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:p-8">
               {[
                 { label: 'Network Volume', val: '$12.4B', icon: Activity },
                 { label: 'Settlement', val: '0.04ms', icon: Zap },
                 { label: 'Encryption', val: 'AES-256', icon: Lock },
                 { label: 'Availability', val: '99.99%', icon: Globe },
               ].map((stat) => (
                 <div key={stat.label} className="space-y-4 group cursor-help">
                    <div className="flex items-center gap-3 text-primary/40 group-hover:text-primary transition-colors">
                       <stat.icon className="w-5 h-5" />
                       <span className="text-[10px] font-black uppercase tracking-[0.4em]">{stat.label}</span>
                    </div>
                    <div className="text-5xl font-display font-black tracking-tighter group-hover:text-glow transition-all">{stat.val}</div>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* --- Card Swap Section --- */}
        <section id="vault" className="py-48 px-6 md:px-12 relative">
           <div className="max-w-screen-2xl mx-auto grid lg:grid-cols-12 gap-32 items-center">
              <div className="lg:col-span-6 space-y-16">
                 <div className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="h-0.5 w-16 bg-primary" />
                      <span className="text-[10px] uppercase tracking-[0.6em] font-black text-primary">The Collection</span>
                    </div>
                    <h2 className="text-6xl md:text-8xl font-display font-black tracking-tighter uppercase leading-[0.9]">
                      Curated <br /> <span className="italic text-primary">Destinies.</span>
                    </h2>
                    <p className="text-white/40 text-xl leading-relaxed max-w-lg font-medium">
                      Choose the tier that matches your ambition. Each card is a gateway to exclusive sovereign services and global access.
                    </p>
                 </div>

                 <div className="grid gap-6">
                    {features.map((f, i) => (
                      <motion.div 
                        key={i} 
                        whileHover={{ x: 10 }}
                        className="flex gap-8 group"
                      >
                         <div className="h-16 w-16 rounded-[1.5rem] border border-white/5 bg-white/[0.02] flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                            <f.icon className="w-7 h-7 text-primary" />
                         </div>
                         <div className="space-y-2">
                            <h4 className="text-xl font-black uppercase tracking-tight">{f.title}</h4>
                            <p className="text-base text-white/30 font-medium leading-relaxed">{f.description}</p>
                         </div>
                      </motion.div>
                    ))}
                 </div>
              </div>

              <div className="lg:col-span-6 flex justify-center lg:justify-end min-h-[650px] relative">
                 <div className="w-full max-w-[600px] relative">
                    <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full" />
                    <CardSwap width="100%" height="100%" cardDistance={50} verticalDistance={60}>
                       <Card className="p-4 bg-gradient-to-br from-neutral-900 to-black border-white/5 shadow-2xl rounded-3xl overflow-hidden group/card">
                          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/card:opacity-100 transition-opacity" />
                          <img src="/images/card-platinum.png" className="w-full h-full object-contain relative z-10" alt="Platinum" />
                       </Card>
                       <Card className="p-4 bg-gradient-to-br from-neutral-900 to-black border-white/5 shadow-2xl rounded-3xl overflow-hidden group/card">
                          <div className="absolute inset-0 bg-success/5 opacity-0 group-hover/card:opacity-100 transition-opacity" />
                          <img src="/images/card-gold.png" className="w-full h-full object-contain relative z-10" alt="Gold" />
                       </Card>
                       <Card className="p-4 bg-gradient-to-br from-neutral-900 to-black border-white/5 shadow-2xl rounded-3xl overflow-hidden group/card">
                          <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity" />
                          <img src="/images/card-emerald.png" className="w-full h-full object-contain relative z-10" alt="Emerald" />
                       </Card>
                    </CardSwap>
                 </div>
              </div>
           </div>
        </section>

        {/* --- Final Statement --- */}
        <section className="py-60 px-6 relative overflow-hidden">
           <div className="absolute inset-0 bg-primary/5 blur-[150px] -z-10" />
           <div className="max-w-5xl mx-auto text-center space-y-16">
              <div className="space-y-6">
                 <h2 className="text-7xl md:text-9xl font-display font-black tracking-tighter uppercase leading-[0.85]">
                   Secure your <br /> <span className="text-primary italic">Sovereignty.</span>
                 </h2>
                 <p className="text-xl text-white/30 font-medium tracking-wide">Join the exclusive network of Moroccan elite banking.</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                 <Link href="/register">
                   <Button className="h-24 px-20 bg-primary text-white rounded-full text-sm font-black uppercase tracking-widest shadow-[0_20px_50px_rgba(54,105,75,0.4)] transition-all hover:scale-105 hover:bg-success border-none">
                     Create Free Account
                   </Button>
                 </Link>
                 <Link href="/login" className="group">
                    <span className="text-xs font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
                      Already a member? <span className="text-primary ml-2 group-hover:underline">Login</span>
                    </span>
                 </Link>
              </div>
           </div>
        </section>

        {/* --- Footer --- */}
        <footer className="py-24 px-6 border-t border-white/5 bg-black/40">
           <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 md:p-8">
              <div className="flex items-center gap-4">
                <img 
                  src="/images/logos/darkmode-Photoroom.png" 
                  alt="AtlasPay Logo" 
                  className="h-16 w-auto object-contain"
                />
              </div>
              <div className="flex gap-16 text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
                <a href="#" className="hover:text-primary transition-colors">Vault Privacy</a>
                <a href="#" className="hover:text-primary transition-colors">Sovereign Terms</a>
                <a href="#" className="hover:text-primary transition-colors">Global Compliance</a>
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10">
                © 2026 ATLASPAY BANKING GROUP
              </div>
           </div>
        </footer>
      </main>
    </div>
  );
}

