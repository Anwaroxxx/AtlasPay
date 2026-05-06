import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { motion } from "framer-motion";
import { Camera, CameraOff, Maximize, X } from "lucide-react";

interface QrScannerProps {
    onResult: (result: string) => void;
    onClose?: () => void;
}

export default function QrScanner({ onResult, onClose }: QrScannerProps) {
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const [isScanning, setIsScanning] = useState(false);

    useEffect(() => {
        const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE]
        };

        scannerRef.current = new Html5QrcodeScanner("qr-reader", config, false);

        scannerRef.current.render(
            (decodedText) => {
                if (scannerRef.current) {
                    scannerRef.current.clear().then(() => {
                        onResult(decodedText);
                    });
                }
            },
            (error) => {
                // Ignore frequent errors during scanning
            }
        );

        setIsScanning(true);

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(e => console.error("Scanner clear error:", e));
            }
        };
    }, [onResult]);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-6 backdrop-blur-sm"
        >
            <div className="w-full max-w-sm relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 text-white">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mr-3">
                            <Camera className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="font-bold">Scan QR Code</h2>
                            <p className="text-xs text-slate-400">Position the QR code inside the frame</p>
                        </div>
                    </div>
                    {onClose && (
                        <button 
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Scanner Viewport */}
                <div className="relative aspect-square w-full bg-slate-900 rounded-3xl overflow-hidden border-2 border-emerald-500/30">
                    <div id="qr-reader" className="w-full h-full" />
                    
                    {/* Animated Overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-0 border-[40px] border-black/40" />
                        <motion.div 
                            animate={{ y: [100, 250, 100] }}
                            transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                            className="absolute left-1/2 -translate-x-1/2 w-48 h-1 bg-emerald-500/50 blur-sm shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                        />
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-8 bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 border border-white/5">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                            <Maximize className="w-4 h-4 text-slate-400" />
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            Ensure the QR code is clear and not reflective for faster scanning.
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Disclaimer */}
            <p className="mt-12 text-[10px] text-slate-500 uppercase tracking-widest font-medium">
                End-to-End Encrypted Verification
            </p>
        </motion.div>
    );
}
