import { Link, Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Wifi, ChevronDown, Landmark, Building2, ShieldCheck, Wallet, Coins, Briefcase } from 'lucide-react';
import { home } from '@/routes';

// Moroccan Banks for Sponsor Marquee
const SPONSORS = [
  { name: "BARID BANK", icon: Building2 },
  { name: "BANK AL-MAGHRIB", icon: Landmark },
  { name: "ATTIJARIWAFA", icon: ShieldCheck },
  { name: "CIH BANK", icon: Wallet },
  { name: "BMCE BANK", icon: Coins },
  { name: "CREDIT AGRICOLE", icon: Building2 },
  { name: "SOCIETE GENERALE", icon: Briefcase },
  { name: "BMCI", icon: Landmark }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-[#09090b] text-white relative font-sans isolate selection:bg-emerald-500/30 flex flex-col overflow-x-hidden">
      <Head title="AtlasPay — The Bank That Does It All" />
      
      {/* --- Global Background Textures & Glows --- */}
      {/* Generated Abstract Background */}
      <div className="absolute inset-0 -z-30 overflow-hidden pointer-events-none fixed bg-black">
         <img src="/images/bg-waves.png" alt="Background Texture" className="w-full h-full object-cover opacity-60 object-center scale-105 mix-blend-screen" />
         {/* Top Gradient Fade to keep text readable */}
         <div className="absolute inset-0 bg-gradient-to-b from-[#09090b]/90 via-transparent to-[#09090b] pointer-events-none" />
      </div>

      {/* Noise Texture */}
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none mix-blend-overlay -z-20 fixed" />
      
      {/* Top Emerald Neon Glow Arc */}
      <div className="absolute top-[-500px] left-1/2 -translate-x-[20%] w-[1000px] h-[1000px] rounded-full border-[80px] border-emerald-500/80 blur-[100px] pointer-events-none -z-10 mix-blend-screen" />
      
      {/* Bottom Right Emerald Neon Glow Angle */}
      <div className="absolute top-[30vh] -right-[100px] w-[500px] h-[500px] border-t-[60px] border-l-[60px] border-emerald-500/60 rounded-tl-full blur-[120px] pointer-events-none -z-10 mix-blend-screen rotate-45" />

      {/* --- Top Navbar --- */}
      <nav className="flex items-center justify-between px-6 py-3 md:px-12 max-w-screen-2xl w-full mx-auto relative z-20 shrink-0">
        <Link href={home()} className="flex items-center gap-3 group">
          <img src="/images/logos/darkmode-Photoroom.png" alt="AtlasPay Logo" className="h-20 md:h-28 w-auto object-contain transform -translate-x-4" />
        </Link>

        {/* Center Links */}
        <ul className="hidden lg:flex items-center gap-8 text-[10px] uppercase font-black tracking-[0.3em] text-white/50">
          <li className="hover:text-emerald-400 cursor-pointer transition-colors">Platform</li>
          <li className="w-1 h-1 rounded-full bg-white/20" />
          <li className="hover:text-emerald-400 cursor-pointer transition-colors">Pricing</li>
          <li className="w-1 h-1 rounded-full bg-white/20" />
          <li className="hover:text-emerald-400 cursor-pointer transition-colors">Our Offerings</li>
        </ul>

        {/* Right Actions: Explicit Log In & Sign Up */}
        <div className="flex items-center gap-4 md:gap-6">
          <button className="hidden md:flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors border-r border-white/10 pr-6 group">
             EN <ChevronDown className="w-3 h-3 group-hover:translate-y-px transition-transform" />
          </button>
          
          <Link href="/login" className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white/70 hover:text-white transition-colors">
            Log In
          </Link>
          <Link href="/register" className="px-6 py-3 bg-emerald-500 text-[#09090b] rounded-full text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all transform hover:scale-105">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* --- Main Hero Grid --- */}
      <main className="flex-1 w-full max-w-screen-2xl mx-auto px-6 md:px-12 grid lg:grid-cols-12 gap-12 lg:gap-8 pt-4 md:pt-8 pb-16 items-center relative z-20">
        
        {/* Left Column: Text & CTA */}
        <div className="lg:col-span-5 space-y-8 lg:space-y-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold text-[10px] uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              15% discount on first purchase
            </p>
            <h1 className="text-6xl sm:text-7xl lg:text-[6.5rem] font-black font-display uppercase tracking-tighter leading-[0.85] text-white">
              The bank <br /> that does <br/> it all
            </h1>
            <p className="text-white/50 text-sm leading-relaxed font-medium max-w-[320px]">
              Get what you love and split the payments up over weeks or months. Sovereignty and precision combined.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-6"
          >
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/80">Get started</span>
            <Link href="/register" className="w-16 h-16 rounded-full border-[2px] border-white/20 flex items-center justify-center hover:bg-emerald-500 hover:border-emerald-500 hover:text-black transition-all group">
              <ArrowRight className="w-5 h-5 text-white group-hover:text-black group-hover:translate-x-1 transition-all" />
            </Link>
          </motion.div>
        </div>

        {/* Center Column: Enhanced CSS Cards */}
        <div className="lg:col-span-5 relative h-[450px] lg:h-[550px] w-full hidden md:block perspective-[1200px]">
          {/* Background Card */}
          <motion.div 
            initial={{ opacity: 0, rotateZ: 0 }}
            animate={{ opacity: 1, rotateZ: -15 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute top-[50%] left-[50%] -translate-x-[45%] -translate-y-[45%] w-[340px] h-[210px] bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-3xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden group"
          >
             {/* Dynamic Light Reflection */}
             <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
             
             {/* Neon Geometric Pattern (The 'X' like the image) */}
             <div className="absolute -top-12 -right-4 w-32 h-[150%] border-l-[8px] border-emerald-500 rotate-45 mix-blend-screen shadow-[0_0_40px_rgba(16,185,129,0.8)]" />
             <div className="absolute -top-8 right-12 w-32 h-[150%] border-r-[8px] border-emerald-500 -rotate-45 mix-blend-screen shadow-[0_0_40px_rgba(16,185,129,0.8)]" />
             
             {/* Hardware Elements */}
             <div className="absolute top-6 left-8">
                 {/* Realistic Chip */}
                 <div className="w-11 h-8 rounded bg-gradient-to-br from-[#d4af37] to-[#aa8c2c] shadow-[inset_0_1px_4px_rgba(255,255,255,0.5)] border border-[#8a7223] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 border-[0.5px] border-black/20 m-[2px] rounded-sm" />
                    <div className="w-full h-[0.5px] bg-black/20 absolute top-1/3" />
                    <div className="w-full h-[0.5px] bg-black/20 absolute top-2/3" />
                    <div className="w-[0.5px] h-full bg-black/20 absolute left-1/3" />
                    <div className="w-[0.5px] h-full bg-black/20 absolute left-2/3" />
                 </div>
                 <Wifi className="w-5 h-5 text-white/30 rotate-90 mt-2" />
             </div>
             
             {/* MasterCard CSS Logo */}
             <div className="absolute bottom-6 right-8 flex items-center">
                <div className="flex relative w-10 h-6 items-center">
                   <div className="w-6 h-6 rounded-full bg-[#eb001b] absolute left-0 z-10" />
                   <div className="w-6 h-6 rounded-full bg-[#f79e1b] absolute right-0 z-20 mix-blend-screen opacity-90" />
                </div>
             </div>
          </motion.div>

          {/* Foreground Card */}
          <motion.div 
            initial={{ opacity: 0, rotateZ: 0 }}
            animate={{ opacity: 1, rotateZ: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
            className="absolute top-[50%] left-[50%] -translate-x-[65%] -translate-y-[25%] w-[340px] h-[210px] bg-gradient-to-br from-[#222] to-[#111] rounded-3xl border border-white/20 shadow-[0_40px_80px_rgba(0,0,0,0.9)] overflow-hidden group hover:-translate-y-[30%] transition-transform duration-500 cursor-pointer"
          >
             {/* Noise Texture on card */}
             <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay" />
             <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
             
             {/* Neon Geometric Pattern */}
             <div className="absolute -top-16 right-0 w-32 h-[150%] border-l-[8px] border-emerald-400 rotate-45 mix-blend-screen shadow-[0_0_50px_rgba(16,185,129,1)]" />
             <div className="absolute -top-10 right-16 w-32 h-[150%] border-r-[8px] border-emerald-400 -rotate-45 mix-blend-screen shadow-[0_0_50px_rgba(16,185,129,1)]" />
             
             {/* Hardware Elements */}
             <div className="absolute top-6 left-8 flex flex-col items-start gap-2">
                 <div className="w-11 h-8 rounded bg-gradient-to-br from-[#e0e0e0] to-[#999] shadow-[inset_0_1px_4px_rgba(255,255,255,0.8)] border border-[#777] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 border-[0.5px] border-black/20 m-[2px] rounded-sm" />
                    <div className="w-full h-[0.5px] bg-black/20 absolute top-1/3" />
                    <div className="w-full h-[0.5px] bg-black/20 absolute top-2/3" />
                 </div>
                 <Wifi className="w-5 h-5 text-white/50 rotate-90" />
             </div>
             
             <div className="absolute bottom-6 left-8 flex flex-col">
                 <div className="text-[12px] font-mono tracking-widest text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">4000 1234 5678 9010</div>
                 <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50 mt-1">AtlasPay Elite</div>
             </div>

             <div className="absolute bottom-6 right-8 text-[16px] font-black italic tracking-widest text-white shadow-sm">VISA</div>
          </motion.div>
        </div>

        {/* Right Column: Stats Sidebar (No Avatar) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 flex flex-col gap-12 lg:items-end text-left lg:text-right"
        >
          <div className="space-y-2">
             <div className="text-5xl lg:text-6xl font-display font-black tracking-tighter text-emerald-400">1.45M</div>
             <div className="text-[9px] text-white/40 uppercase tracking-[0.2em] lg:ml-auto max-w-[140px] leading-relaxed font-bold">Total count of active users</div>
          </div>
          
          <div className="hidden lg:block w-8 h-[2px] bg-white/10" />
          
          <div className="space-y-2">
             <div className="text-5xl lg:text-6xl font-display font-black tracking-tighter text-emerald-400">175K</div>
             <div className="text-[9px] text-white/40 uppercase tracking-[0.2em] lg:ml-auto max-w-[140px] leading-relaxed font-bold">Downloads from all stores</div>
          </div>
        </motion.div>
      </main>

      {/* --- Middle Row: Circular Badge & Features --- */}
      <section className="w-full max-w-screen-2xl mx-auto px-6 md:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-12 relative z-20 border-t border-white/5">
         
         {/* Rotating "Learn More" Badge */}
         <Link href="/login" className="relative w-28 h-28 flex items-center justify-center group cursor-pointer shrink-0">
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-spin-slow opacity-80 group-hover:opacity-100 transition-opacity">
               <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
               <text className="text-[10px] font-black tracking-[0.3em] fill-emerald-500 uppercase">
                  <textPath href="#circlePath" startOffset="0%">Learn More • Learn More • </textPath>
               </text>
            </svg>
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
               <ArrowUpRight className="w-4 h-4 text-emerald-500 group-hover:text-black transition-colors" />
            </div>
         </Link>

         {/* Feature Blocks */}
         <div className="flex flex-col sm:flex-row gap-8 lg:gap-16 items-center lg:flex-1 lg:justify-end">
            <div className="space-y-2 max-w-[200px] text-center sm:text-left">
                <h4 className="font-bold text-sm text-white tracking-wide">Fast and secure</h4>
                <p className="text-[11px] text-white/40 leading-relaxed font-medium">Provides the fastest, secure banking service globally.</p>
            </div>
            
            <div className="hidden lg:block w-[2px] h-10 bg-white/10" />
            
            <div className="space-y-2 max-w-[200px] text-center sm:text-left">
                <h4 className="font-bold text-sm text-white tracking-wide">Online installment</h4>
                <p className="text-[11px] text-white/40 leading-relaxed font-medium">Provides installment on any online shopping seamlessly.</p>
            </div>
         </div>
      </section>

      {/* --- Sponsor Marquee & Mini Footer --- */}
      <footer className="mt-auto w-full border-t border-white/5 bg-black/40 backdrop-blur-md overflow-hidden relative z-20">
         {/* Infinite Marquee */}
         <div className="w-full border-b border-white/5 py-8 flex overflow-hidden whitespace-nowrap">
            {/* The wrapper uses has-[:hover] to pause only when one of its children is hovered */}
            <div className="animate-marquee flex items-center gap-16 md:gap-32 w-max has-[:hover]:[animation-play-state:paused]">
                {/* Map SPONSORS multiple times for seamless infinite scroll across ultra-wide monitors */}
                {[...SPONSORS, ...SPONSORS, ...SPONSORS, ...SPONSORS].map((sponsor, i) => {
                    const Icon = sponsor.icon;
                    return (
                    <div key={i} className="flex items-center gap-3 text-white/20 hover:text-emerald-500 font-display font-black text-xl lg:text-3xl tracking-tighter uppercase transition-colors duration-300 cursor-pointer select-none">
                       <Icon className="w-8 h-8 lg:w-10 lg:h-10 opacity-80" strokeWidth={1.5} />
                       {sponsor.name}
                    </div>
                )})}
            </div>
         </div>
         
         {/* Mini Footer */}
         <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
               © 2026 AtlasPay Bank. All rights reserved.
             </div>
             <div className="flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.3em] text-white/30">
               <a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a>
               <a href="#" className="hover:text-emerald-400 transition-colors">Terms</a>
               <a href="#" className="hover:text-emerald-400 transition-colors">Compliance</a>
             </div>
         </div>
      </footer>
    </div>
  );
}
