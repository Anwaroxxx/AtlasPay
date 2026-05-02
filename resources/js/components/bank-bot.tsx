import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MessageSquare, 
    X, 
    Send, 
    Bot, 
    User, 
    Loader2, 
    Sparkles, 
    ShieldCheck, 
    Zap,
    Minus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
    role: 'user' | 'bot';
    content: string;
}

export function BankBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { role: 'bot', content: "Hi! I'm your **Bank Assistant**. How can I help you with your account or credits today?" }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || isLoading) return;

        const userMsg = message.trim();
        setMessage('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ''
                },
                body: JSON.stringify({ message: userMsg })
            });

            const data = await response.json();
            if (data.answer) {
                setMessages(prev => [...prev, { role: 'bot', content: data.answer }]);
            } else {
                setMessages(prev => [...prev, { role: 'bot', content: "Sorry, I couldn't connect to my brain. Can you try again?" }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'bot', content: "Oops! Something went wrong. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end pointer-events-none">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: 50, scale: 0.9, filter: 'blur(10px)' }}
                        className="mb-6 w-[350px] md:w-[400px] overflow-hidden rounded-[2.5rem] border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 pointer-events-auto"
                    >
                        {/* Header */}
                        <div className="relative flex items-center justify-between bg-emerald-500 p-5 text-neutral-900">
                            <div className="relative z-10 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-900 text-emerald-500">
                                    <Bot className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-md font-bold">Bank Assistant</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-2 w-2 rounded-full bg-neutral-900 animate-pulse" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Online</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="rounded-xl p-2 hover:bg-neutral-900/10 transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div 
                            ref={scrollRef} 
                            className="h-[400px] overflow-y-auto p-5 space-y-4 bg-neutral-50/30 dark:bg-neutral-950/30"
                        >
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`relative max-w-[85%] rounded-[1.2rem] px-4 py-2 text-sm shadow-sm ${
                                        msg.role === 'user' 
                                            ? 'bg-emerald-500 text-neutral-900 font-medium' 
                                            : 'bg-white text-neutral-800 border border-neutral-100 dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700 leading-relaxed'
                                    }`}>
                                        <div className="whitespace-pre-wrap">
                                            {msg.content}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="flex items-center gap-2 rounded-[1.2rem] bg-white px-4 py-2 text-sm border border-neutral-100 dark:bg-neutral-800 dark:border-neutral-700">
                                        <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                                        <span className="text-neutral-400 text-xs italic">Thinking...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                            <form onSubmit={handleSend} className="relative flex items-center gap-2">
                                <Input
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="h-12 w-full rounded-xl border-neutral-100 bg-neutral-50 px-4 text-sm dark:bg-neutral-800 dark:border-neutral-700"
                                    disabled={isLoading}
                                />
                                <Button 
                                    type="submit" 
                                    size="icon" 
                                    className="h-12 w-12 rounded-xl bg-emerald-500 text-neutral-900 hover:bg-emerald-400 shrink-0" 
                                    disabled={isLoading || !message.trim()}
                                >
                                    <Send className="h-5 w-5" />
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="pointer-events-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-900 text-emerald-500 shadow-2xl hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-900 transition-all"
            >
                {isOpen ? <X className="h-8 w-8" /> : <MessageSquare className="h-8 w-8" />}
            </motion.button>
        </div>
    );
}
