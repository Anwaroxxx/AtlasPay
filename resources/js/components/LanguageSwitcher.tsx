import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { useState } from 'react';
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
    const currentLang =
        languages.find((l) => l.code === currentLocale) || languages[0];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="group shadow-soft flex items-center gap-2 rounded-full border border-border/50 bg-card px-3 py-2 transition-all duration-300 outline-none hover:border-primary/30 focus:ring-2 focus:ring-primary/20"
                >
                    <div className="h-6 w-6 overflow-hidden rounded-full border border-border/50">
                        <img
                            src={currentLang.flag}
                            alt={currentLang.label}
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <span className="hidden text-[10px] font-black tracking-widest uppercase sm:inline-block">
                        {currentLang.code}
                    </span>
                    <ChevronDown className="h-3 w-3 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-180" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="shadow-elevated z-[1000] w-48 rounded-2xl border border-border bg-card p-2"
            >
                <AnimatePresence>
                    {languages.map((lang) => (
                        <DropdownMenuItem
                            key={lang.code}
                            asChild
                            className="p-0 focus:bg-transparent"
                        >
                            <Link
                                href={language(lang.code)}
                                className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 transition-all ${
                                    currentLocale === lang.code
                                        ? 'bg-primary font-bold text-primary-foreground shadow-lg'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={lang.flag}
                                        alt={lang.label}
                                        className="h-4 w-6 rounded-sm object-cover shadow-sm"
                                    />
                                    <span className="text-[10px] font-black tracking-widest uppercase">
                                        {lang.label}
                                    </span>
                                </div>
                                {currentLocale === lang.code && (
                                    <Check className="h-4 w-4" />
                                )}
                            </Link>
                        </DropdownMenuItem>
                    ))}
                </AnimatePresence>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
