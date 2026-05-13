import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    X, 
    Zap, 
    ArrowRight, 
    History, 
    Wallet, 
    Target, 
    RotateCcw, 
    CreditCard, 
    BrainCircuit,
    LayoutGrid,
    TrendingUp,
    Shield
} from 'lucide-react';
import { router } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface SearchResult {
    id: string;
    title: string;
    description: string;
    href: string;
    icon: any;
    category: 'Features' | 'Actions' | 'Reports';
}

const features: SearchResult[] = [
    { id: 'dashboard', title: 'Dashboard', description: 'Financial overview and stats', href: '/dashboard', icon: LayoutGrid, category: 'Features' },
    { id: 'transactions', title: 'Transaction History', description: 'View full history and reports', href: '/reports/transactions', icon: History, category: 'Reports' },
    { id: 'transfer', title: 'Send Money', description: 'Transfer funds to other accounts', href: '/transfer', icon: Wallet, category: 'Actions' },
    { id: 'savings', title: 'Savings Goals', description: 'Set and track financial targets', href: '/savings', icon: Target, category: 'Features' },
    { id: 'daret', title: 'Daret Groups', description: 'Join or manage social savings', href: '/daret', icon: RotateCcw, category: 'Features' },
    { id: 'credits', title: 'Credits & Loans', description: 'Manage your credits and score', href: '/credits', icon: CreditCard, category: 'Features' },
    { id: 'ai', title: 'SmartBanking AI', description: 'Chat with your AI assistant', href: '/anwar', icon: BrainCircuit, category: 'Actions' },
    { id: 'analysis', title: 'Neural Analysis', description: 'Deep financial insights', href: '/reports/transactions', icon: Zap, category: 'Reports' },
];

export function CommandPalette({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);

    const filteredResults = features.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        item.description.toLowerCase().includes(query.toLowerCase())
    );

    const handleSelect = useCallback((item: SearchResult) => {
        setIsOpen(false);
        router.visit(item.href);
    }, [setIsOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredResults.length));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + filteredResults.length) % Math.max(1, filteredResults.length));
            } else if (e.key === 'Enter') {
                if (filteredResults[selectedIndex]) {
                    handleSelect(filteredResults[selectedIndex]);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, filteredResults, selectedIndex, handleSelect]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-2xl overflow-hidden border-none bg-transparent p-0 shadow-none sm:rounded-3xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/90 p-2 shadow-2xl backdrop-blur-2xl dark:bg-black/90"
                >
                    <div className="moroccan-pattern pointer-events-none absolute inset-0 opacity-[0.03]" />
                    
                    {/* Search Input Area */}
                    <div className="relative flex items-center border-b border-white/5 px-6 py-6">
                        <Search className="h-6 w-6 text-primary animate-pulse" />
                        <input
                            autoFocus
                            placeholder="What do you need help with?"
                            className="flex-1 border-none bg-transparent px-6 text-xl font-bold text-white placeholder:text-muted-foreground/40 focus:ring-0"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-1.5 border border-white/5">
                            <span className="text-[10px] font-black text-white/40 tracking-widest uppercase">ESC to close</span>
                        </div>
                    </div>

                    {/* Results Area */}
                    <div className="scrollbar-none max-h-[450px] overflow-y-auto p-2">
                        {filteredResults.length > 0 ? (
                            <div className="space-y-1">
                                {['Features', 'Actions', 'Reports'].map(cat => {
                                    const catResults = filteredResults.filter(r => r.category === cat);
                                    if (catResults.length === 0) return null;

                                    return (
                                        <div key={cat} className="space-y-1">
                                            <div className="px-4 py-3">
                                                <p className="text-[10px] font-black tracking-[0.3em] text-primary uppercase opacity-60">
                                                    {cat}
                                                </p>
                                            </div>
                                            {catResults.map((item) => {
                                                const globalIndex = filteredResults.indexOf(item);
                                                const isSelected = selectedIndex === globalIndex;

                                                return (
                                                    <motion.div
                                                        key={item.id}
                                                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                                                        onClick={() => handleSelect(item)}
                                                        className={cn(
                                                            "group relative flex items-center gap-4 rounded-2xl p-4 transition-all duration-300 cursor-pointer",
                                                            isSelected ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]" : "hover:bg-white/5 text-white/70"
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
                                                            isSelected ? "bg-white/20" : "bg-white/5"
                                                        )}>
                                                            <item.icon className="h-6 w-6" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="text-sm font-black tracking-tight uppercase">
                                                                {item.title}
                                                            </h4>
                                                            <p className={cn(
                                                                "text-[10px] font-medium opacity-60",
                                                                isSelected ? "text-white" : "text-muted-foreground"
                                                            )}>
                                                                {item.description}
                                                            </p>
                                                        </div>
                                                        {isSelected && (
                                                            <motion.div 
                                                                initial={{ x: -10, opacity: 0 }}
                                                                animate={{ x: 0, opacity: 1 }}
                                                            >
                                                                <ArrowRight className="h-5 w-5" />
                                                            </motion.div>
                                                        )}
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/5">
                                    <Shield className="h-8 w-8 text-muted-foreground/40" />
                                </div>
                                <h3 className="text-sm font-black tracking-widest text-white/40 uppercase">
                                    No features found for "{query}"
                                </h3>
                                <p className="mt-2 text-[10px] font-medium text-muted-foreground/30 uppercase">
                                    Try searching for 'Daret' or 'Transfer'
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer / Quick Actions */}
                    <div className="flex items-center justify-between border-t border-white/5 bg-black/40 px-6 py-4">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-3 w-3 text-success" />
                                <span className="text-[9px] font-black text-white/40 tracking-widest uppercase">Market Active</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap className="h-3 w-3 text-warning" />
                                <span className="text-[9px] font-black text-white/40 tracking-widest uppercase">Neural Link Stable</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-primary italic uppercase">
                            AtlasPay Intelligence v2.0
                        </div>
                    </div>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
}
