import React, { useState } from 'react';
import { Lock, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '../UI/Button';
import { cn } from '../../lib/utils';

export const PayPalModal = ({ isOpen, onClose, onPaymentSuccess, amount, invoiceId }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate payment gateway delay
        setTimeout(() => {
            setIsProcessing(false);
            onPaymentSuccess('PayPal');
            onClose();
        }, 3000);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="bg-[#003087] p-6 border-b border-[#001c52]">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white">
                                <ShieldCheck className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-white">Secure Checkout</span>
                        </div>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 brightness-0 invert" />
                    </div>
                    <div className="mt-4">
                        <p className="text-blue-200 text-sm">Pay for Invoice</p>
                        <h3 className="text-3xl font-bold text-white tracking-tight">${amount?.toLocaleString()}</h3>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">PayPal Email</label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0070E0]/10 focus:border-[#0070E0] outline-none transition-all placeholder:text-gray-300"
                                placeholder="buyer@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0070E0]/10 focus:border-[#0070E0] outline-none transition-all placeholder:text-gray-300"
                                placeholder="•••••••••"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isProcessing}
                        className={cn(
                            "w-full h-14 rounded-2xl text-lg font-bold bg-[#0070E0] hover:bg-[#003087] shadow-xl shadow-blue-200 transition-all",
                            isProcessing && "opacity-80 cursor-wait"
                        )}
                    >
                        {isProcessing ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing PayPal...
                            </span>
                        ) : (
                            `Pay ${amount?.toLocaleString()}`
                        )}
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-gray-400 text-xs font-medium">
                        <Lock className="w-3 h-3" />
                        <span>Secure SSL Encryption</span>
                    </div>
                </form>
            </div>
        </div>
    );
};
