import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { language } from '@/custom-routes';

const languages = [
    { code: 'en', label: 'English', flag: 'https://flagcdn.com/w40/gb.png' },
    { code: 'fr', label: 'Français', flag: 'https://flagcdn.com/w40/fr.png' },
    { code: 'ar', label: 'العربية', flag: 'https://flagcdn.com/w40/ma.png' },
];

export default function LanguageSwitcher() {
    const { props } = usePage();
    const currentLocale = (props as any).locale || 'en';
    const currentLang = languages.find(l => l.code === currentLocale) || languages[0];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 group shadow-soft outline-none focus:ring-2 focus:ring-primary/20"
                >
                    <div className="h-6 w-6 rounded-full overflow-hidden border border-border/50">
                        <img src={currentLang.flag} alt={currentLang.label} className="h-full w-full object-cover" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline-block">
                        {currentLang.code}
                    </span>
                    <ChevronDown className="h-3 w-3 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-180" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl bg-card border border-border shadow-elevated z-[1000]">
                <AnimatePresence>
                    {languages.map((lang) => (
                        <DropdownMenuItem 
                            key={lang.code} 
                            asChild
                            className="p-0 focus:bg-transparent"
                        >
                            <Link
                                href={language(lang.code)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all cursor-pointer ${
                                    currentLocale === lang.code 
                                    ? 'bg-primary text-primary-foreground font-bold shadow-lg' 
                                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <img src={lang.flag} alt={lang.label} className="h-4 w-6 rounded-sm object-cover shadow-sm" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{lang.label}</span>
                                </div>
                                {currentLocale === lang.code && <Check className="h-4 w-4" />}
                            </Link>
                        </DropdownMenuItem>
                    ))}
                </AnimatePresence>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
