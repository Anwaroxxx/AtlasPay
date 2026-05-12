import { Link, Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    ArrowUpRight,
    Wifi,
    ChevronDown,
    Landmark,
    Building2,
    ShieldCheck,
    Wallet,
    Coins,
    Briefcase,
} from 'lucide-react';
import { home } from '@/routes';

// Moroccan Banks for Sponsor Marquee
const SPONSORS = [
    { name: 'BARID BANK', icon: Building2 },
    { name: 'BANK AL-MAGHRIB', icon: Landmark },
    { name: 'ATTIJARIWAFA', icon: ShieldCheck },
    { name: 'CIH BANK', icon: Wallet },
    { name: 'BMCE BANK', icon: Coins },
    { name: 'CREDIT AGRICOLE', icon: Building2 },
    { name: 'SOCIETE GENERALE', icon: Briefcase },
    { name: 'BMCI', icon: Landmark },
];

export default function LandingPage() {
    return (
        <div className="relative isolate flex min-h-screen w-full flex-col overflow-x-hidden bg-[#09090b] font-sans text-white selection:bg-emerald-500/30">
            <Head title="AtlasPay — The Bank That Does It All" />

            {/* --- Global Background Textures & Glows --- */}
            {/* Generated Abstract Background */}
            <div className="pointer-events-none absolute fixed inset-0 -z-30 overflow-hidden bg-black">
                <img
                    src="/images/bg-waves.png"
                    alt="Background Texture"
                    className="h-full w-full scale-105 object-cover object-center opacity-60 mix-blend-screen"
                />
                {/* Top Gradient Fade to keep text readable */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#09090b]/90 via-transparent to-[#09090b]" />
            </div>

            {/* Noise Texture */}
            <div className="bg-noise pointer-events-none absolute fixed inset-0 -z-20 opacity-30 mix-blend-overlay" />

            {/* Top Emerald Neon Glow Arc */}
            <div className="pointer-events-none absolute top-[-500px] left-1/2 -z-10 h-[1000px] w-[1000px] -translate-x-[20%] rounded-full border-[80px] border-emerald-500/80 mix-blend-screen blur-[100px]" />

            {/* Bottom Right Emerald Neon Glow Angle */}
            <div className="pointer-events-none absolute top-[30vh] -right-[100px] -z-10 h-[500px] w-[500px] rotate-45 rounded-tl-full border-t-[60px] border-l-[60px] border-emerald-500/60 mix-blend-screen blur-[120px]" />

            {/* --- Top Navbar --- */}
            <nav className="relative z-20 mx-auto flex w-full max-w-screen-2xl shrink-0 items-center justify-between px-6 py-3 md:px-12">
                <Link href={home()} className="group flex items-center gap-3">
                    <img
                        src="/images/logos/darkmode-Photoroom.png"
                        alt="AtlasPay Logo"
                        className="h-20 w-auto -translate-x-4 transform object-contain md:h-28"
                    />
                </Link>

                {/* Center Links */}
                <ul className="hidden items-center gap-8 text-[10px] font-black tracking-[0.3em] text-white/50 uppercase lg:flex">
                    <li className="cursor-pointer transition-colors hover:text-emerald-400">
                        Platform
                    </li>
                    <li className="h-1 w-1 rounded-full bg-white/20" />
                    <li className="cursor-pointer transition-colors hover:text-emerald-400">
                        Pricing
                    </li>
                    <li className="h-1 w-1 rounded-full bg-white/20" />
                    <li className="cursor-pointer transition-colors hover:text-emerald-400">
                        Our Offerings
                    </li>
                </ul>

                {/* Right Actions: Explicit Log In & Sign Up */}
                <div className="flex items-center gap-4 md:gap-6">
                    <button className="group hidden items-center gap-1 border-r border-white/10 pr-6 text-[10px] font-black tracking-widest text-white/50 uppercase transition-colors hover:text-white md:flex">
                        EN{' '}
                        <ChevronDown className="h-3 w-3 transition-transform group-hover:translate-y-px" />
                    </button>

                    <Link
                        href="/login"
                        className="px-4 py-2 text-[10px] font-black tracking-widest text-white/70 uppercase transition-colors hover:text-white"
                    >
                        Log In
                    </Link>
                    <Link
                        href="/register"
                        className="transform rounded-full bg-emerald-500 px-6 py-3 text-[10px] font-black tracking-widest text-[#09090b] uppercase shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-105 hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                    >
                        Sign Up
                    </Link>
                </div>
            </nav>

            {/* --- Main Hero Grid --- */}
            <main className="relative z-20 mx-auto grid w-full max-w-screen-2xl flex-1 items-center gap-12 px-6 pt-4 pb-16 md:px-12 md:pt-8 lg:grid-cols-12 lg:gap-8">
                {/* Left Column: Text & CTA */}
                <div className="space-y-8 lg:col-span-5 lg:space-y-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <p className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                            15% discount on first purchase
                        </p>
                        <h1 className="font-display text-6xl leading-[0.85] font-black tracking-tighter text-white uppercase sm:text-7xl lg:text-[6.5rem]">
                            The bank <br /> that does <br /> it all
                        </h1>
                        <p className="max-w-[320px] text-sm leading-relaxed font-medium text-white/50">
                            Get what you love and split the payments up over
                            weeks or months. Sovereignty and precision combined.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-6"
                    >
                        <span className="text-[11px] font-black tracking-[0.2em] text-white/80 uppercase">
                            Get started
                        </span>
                        <Link
                            href="/register"
                            className="group flex h-16 w-16 items-center justify-center rounded-full border-[2px] border-white/20 transition-all hover:border-emerald-500 hover:bg-emerald-500 hover:text-black"
                        >
                            <ArrowRight className="h-5 w-5 text-white transition-all group-hover:translate-x-1 group-hover:text-black" />
                        </Link>
                    </motion.div>
                </div>

                {/* Center Column: Enhanced CSS Cards */}
                <div className="relative hidden h-[450px] w-full perspective-[1200px] md:block lg:col-span-5 lg:h-[550px]">
                    {/* Background Card */}
                    <motion.div
                        initial={{ opacity: 0, rotateZ: 0 }}
                        animate={{ opacity: 1, rotateZ: -15 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="group absolute top-[50%] left-[50%] h-[210px] w-[340px] -translate-x-[45%] -translate-y-[45%] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
                    >
                        {/* Dynamic Light Reflection */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                        {/* Neon Geometric Pattern (The 'X' like the image) */}
                        <div className="absolute -top-12 -right-4 h-[150%] w-32 rotate-45 border-l-[8px] border-emerald-500 mix-blend-screen shadow-[0_0_40px_rgba(16,185,129,0.8)]" />
                        <div className="absolute -top-8 right-12 h-[150%] w-32 -rotate-45 border-r-[8px] border-emerald-500 mix-blend-screen shadow-[0_0_40px_rgba(16,185,129,0.8)]" />

                        {/* Hardware Elements */}
                        <div className="absolute top-6 left-8">
                            {/* Realistic Chip */}
                            <div className="relative flex h-8 w-11 items-center justify-center overflow-hidden rounded border border-[#8a7223] bg-gradient-to-br from-[#d4af37] to-[#aa8c2c] shadow-[inset_0_1px_4px_rgba(255,255,255,0.5)]">
                                <div className="absolute inset-0 m-[2px] rounded-sm border-[0.5px] border-black/20" />
                                <div className="absolute top-1/3 h-[0.5px] w-full bg-black/20" />
                                <div className="absolute top-2/3 h-[0.5px] w-full bg-black/20" />
                                <div className="absolute left-1/3 h-full w-[0.5px] bg-black/20" />
                                <div className="absolute left-2/3 h-full w-[0.5px] bg-black/20" />
                            </div>
                            <Wifi className="mt-2 h-5 w-5 rotate-90 text-white/30" />
                        </div>

                        {/* MasterCard CSS Logo */}
                        <div className="absolute right-8 bottom-6 flex items-center">
                            <div className="relative flex h-6 w-10 items-center">
                                <div className="absolute left-0 z-10 h-6 w-6 rounded-full bg-[#eb001b]" />
                                <div className="absolute right-0 z-20 h-6 w-6 rounded-full bg-[#f79e1b] opacity-90 mix-blend-screen" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Foreground Card */}
                    <motion.div
                        initial={{ opacity: 0, rotateZ: 0 }}
                        animate={{ opacity: 1, rotateZ: 0 }}
                        transition={{
                            duration: 1.2,
                            delay: 0.2,
                            ease: 'easeOut',
                        }}
                        className="group absolute top-[50%] left-[50%] h-[210px] w-[340px] -translate-x-[65%] -translate-y-[25%] cursor-pointer overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-[#222] to-[#111] shadow-[0_40px_80px_rgba(0,0,0,0.9)] transition-transform duration-500 hover:-translate-y-[30%]"
                    >
                        {/* Noise Texture on card */}
                        <div className="bg-noise pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                        {/* Neon Geometric Pattern */}
                        <div className="absolute -top-16 right-0 h-[150%] w-32 rotate-45 border-l-[8px] border-emerald-400 mix-blend-screen shadow-[0_0_50px_rgba(16,185,129,1)]" />
                        <div className="absolute -top-10 right-16 h-[150%] w-32 -rotate-45 border-r-[8px] border-emerald-400 mix-blend-screen shadow-[0_0_50px_rgba(16,185,129,1)]" />

                        {/* Hardware Elements */}
                        <div className="absolute top-6 left-8 flex flex-col items-start gap-2">
                            <div className="relative flex h-8 w-11 items-center justify-center overflow-hidden rounded border border-[#777] bg-gradient-to-br from-[#e0e0e0] to-[#999] shadow-[inset_0_1px_4px_rgba(255,255,255,0.8)]">
                                <div className="absolute inset-0 m-[2px] rounded-sm border-[0.5px] border-black/20" />
                                <div className="absolute top-1/3 h-[0.5px] w-full bg-black/20" />
                                <div className="absolute top-2/3 h-[0.5px] w-full bg-black/20" />
                            </div>
                            <Wifi className="h-5 w-5 rotate-90 text-white/50" />
                        </div>

                        <div className="absolute bottom-6 left-8 flex flex-col">
                            <div className="font-mono text-[12px] tracking-widest text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">
                                4000 1234 5678 9010
                            </div>
                            <div className="mt-1 text-[9px] font-black tracking-[0.2em] text-white/50 uppercase">
                                AtlasPay Elite
                            </div>
                        </div>

                        <div className="absolute right-8 bottom-6 text-[16px] font-black tracking-widest text-white italic shadow-sm">
                            VISA
                        </div>
                    </motion.div>
                </div>

                {/* Right Column: Stats Sidebar (No Avatar) */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col gap-12 text-left lg:col-span-2 lg:items-end lg:text-right"
                >
                    <div className="space-y-2">
                        <div className="font-display text-5xl font-black tracking-tighter text-emerald-400 lg:text-6xl">
                            1.45M
                        </div>
                        <div className="max-w-[140px] text-[9px] leading-relaxed font-bold tracking-[0.2em] text-white/40 uppercase lg:ml-auto">
                            Total count of active users
                        </div>
                    </div>

                    <div className="hidden h-[2px] w-8 bg-white/10 lg:block" />

                    <div className="space-y-2">
                        <div className="font-display text-5xl font-black tracking-tighter text-emerald-400 lg:text-6xl">
                            175K
                        </div>
                        <div className="max-w-[140px] text-[9px] leading-relaxed font-bold tracking-[0.2em] text-white/40 uppercase lg:ml-auto">
                            Downloads from all stores
                        </div>
                    </div>
                </motion.div>
            </main>

            {/* --- Middle Row: Circular Badge & Features --- */}
            <section className="relative z-20 mx-auto flex w-full max-w-screen-2xl flex-col items-center justify-between gap-12 border-t border-white/5 px-6 py-12 md:flex-row md:px-12">
                {/* Rotating "Learn More" Badge */}
                <Link
                    href="/login"
                    className="group relative flex h-28 w-28 shrink-0 cursor-pointer items-center justify-center"
                >
                    <svg
                        viewBox="0 0 100 100"
                        className="animate-spin-slow absolute inset-0 h-full w-full opacity-80 transition-opacity group-hover:opacity-100"
                    >
                        <path
                            id="circlePath"
                            d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                            fill="transparent"
                        />
                        <text className="fill-emerald-500 text-[10px] font-black tracking-[0.3em] uppercase">
                            <textPath href="#circlePath" startOffset="0%">
                                Learn More • Learn More •{' '}
                            </textPath>
                        </text>
                    </svg>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 transition-colors group-hover:bg-emerald-500">
                        <ArrowUpRight className="h-4 w-4 text-emerald-500 transition-colors group-hover:text-black" />
                    </div>
                </Link>

                {/* Feature Blocks */}
                <div className="flex flex-col items-center gap-8 sm:flex-row lg:flex-1 lg:justify-end lg:gap-16">
                    <div className="max-w-[200px] space-y-2 text-center sm:text-left">
                        <h4 className="text-sm font-bold tracking-wide text-white">
                            Fast and secure
                        </h4>
                        <p className="text-[11px] leading-relaxed font-medium text-white/40">
                            Provides the fastest, secure banking service
                            globally.
                        </p>
                    </div>

                    <div className="hidden h-10 w-[2px] bg-white/10 lg:block" />

                    <div className="max-w-[200px] space-y-2 text-center sm:text-left">
                        <h4 className="text-sm font-bold tracking-wide text-white">
                            Online installment
                        </h4>
                        <p className="text-[11px] leading-relaxed font-medium text-white/40">
                            Provides installment on any online shopping
                            seamlessly.
                        </p>
                    </div>
                </div>
            </section>

            {/* --- Sponsor Marquee & Mini Footer --- */}
            <footer className="relative z-20 mt-auto w-full overflow-hidden border-t border-white/5 bg-black/40 backdrop-blur-md">
                {/* Infinite Marquee */}
                <div className="flex w-full overflow-hidden border-b border-white/5 py-8 whitespace-nowrap">
                    {/* The wrapper uses has-[:hover] to pause only when one of its children is hovered */}
                    <div className="animate-marquee flex w-max items-center gap-16 has-[:hover]:[animation-play-state:paused] md:gap-32">
                        {/* Map SPONSORS multiple times for seamless infinite scroll across ultra-wide monitors */}
                        {[
                            ...SPONSORS,
                            ...SPONSORS,
                            ...SPONSORS,
                            ...SPONSORS,
                        ].map((sponsor, i) => {
                            const Icon = sponsor.icon;

                            return (
                                <div
                                    key={i}
                                    className="flex cursor-pointer items-center gap-3 font-display text-xl font-black tracking-tighter text-white/20 uppercase transition-colors duration-300 select-none hover:text-emerald-500 lg:text-3xl"
                                >
                                    <Icon
                                        className="h-8 w-8 opacity-80 lg:h-10 lg:w-10"
                                        strokeWidth={1.5}
                                    />
                                    {sponsor.name}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Mini Footer */}
                <div className="mx-auto flex max-w-screen-2xl flex-col items-center justify-between gap-4 px-6 py-6 md:flex-row md:px-12">
                    <div className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase">
                        © 2026 AtlasPay Bank. All rights reserved.
                    </div>
                    <div className="flex items-center gap-8 text-[9px] font-black tracking-[0.3em] text-white/30 uppercase">
                        <a
                            href="#"
                            className="transition-colors hover:text-emerald-400"
                        >
                            Privacy
                        </a>
                        <a
                            href="#"
                            className="transition-colors hover:text-emerald-400"
                        >
                            Terms
                        </a>
                        <a
                            href="#"
                            className="transition-colors hover:text-emerald-400"
                        >
                            Compliance
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
