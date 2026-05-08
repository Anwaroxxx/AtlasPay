import { motion } from 'framer-motion';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Camera, CameraOff, Maximize, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface QrScannerProps {
    onResult: (result: string) => void;
    onClose?: () => void;
}

export default function QrScanner({ onResult, onClose }: QrScannerProps) {
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const onResultRef = useRef(onResult);

    // Keep the ref updated with the latest callback
    useEffect(() => {
        onResultRef.current = onResult;
    }, [onResult]);

    useEffect(() => {
        const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        };

        scannerRef.current = new Html5QrcodeScanner('qr-reader', config, false);

        scannerRef.current.render(
            (decodedText) => {
                if (scannerRef.current) {
                    scannerRef.current.clear().then(() => {
                        onResultRef.current(decodedText);
                    });
                }
            },
            (error) => {
                // Ignore frequent errors during scanning
            },
        );

        return () => {
            if (scannerRef.current) {
                scannerRef.current
                    .clear()
                    .catch((e) => console.error('Scanner clear error:', e));
            }
        };
    }, []); // Only run on mount

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-6 backdrop-blur-sm"
        >
            <div className="relative w-full max-w-sm">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between text-white">
                    <div className="flex items-center">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                            <Camera className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="font-bold">Scan QR Code</h2>
                            <p className="text-xs text-slate-400">
                                Position the QR code inside the frame
                            </p>
                        </div>
                    </div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 transition-colors hover:bg-slate-700"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>

                {/* Scanner Viewport */}
                <div className="relative aspect-square w-full overflow-hidden rounded-3xl border-2 border-emerald-500/30 bg-slate-900">
                    <div id="qr-reader" className="h-full w-full" />

                    {/* Animated Overlay */}
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute inset-0 border-[40px] border-black/40" />
                        <motion.div
                            animate={{ y: [100, 250, 100] }}
                            transition={{
                                repeat: Infinity,
                                duration: 2.5,
                                ease: 'linear',
                            }}
                            className="absolute left-1/2 h-1 w-48 -translate-x-1/2 bg-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.5)] blur-sm"
                        />
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-8 rounded-2xl border border-white/5 bg-slate-800/50 p-4 backdrop-blur-md">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                            <Maximize className="h-4 w-4 text-slate-400" />
                        </div>
                        <p className="text-xs leading-relaxed text-slate-300">
                            Ensure the QR code is clear and not reflective for
                            faster scanning.
                        </p>
                    </div>
                </div>
            </div>

            {/* Disclaimer */}
            <p className="mt-12 text-[10px] font-medium tracking-widest text-slate-500 uppercase">
                End-to-End Encrypted Verification
            </p>
        </motion.div>
    );
}
