import React, { useState, useEffect } from 'react';
import { CreditCard, Lock, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '../UI/Button';
import { cn } from '../../lib/utils';

export const StripeModal = ({ isOpen, onClose, onPaymentSuccess, amount, invoiceId }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [cardData, setCardData] = useState({
        number: '',
        expiry: '',
        cvc: '',
        name: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate payment gateway delay
        setTimeout(() => {
            setIsProcessing(false);
            onPaymentSuccess('Stripe (Card)');
            onClose();
        }, 3000);
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) return parts.join(' ');
        return value;
    };

    const handleCardChange = (e) => {
        const { name, value } = e.target;
        if (name === 'number') {
            setCardData(prev => ({ ...prev, [name]: formatCardNumber(value) }));
        } else if (name === 'expiry') {
            let v = value.replace(/\//g, '').replace(/[^0-9]/gi, '');
            if (v.length > 2) v = v.substring(0, 2) + '/' + v.substring(2, 4);
            setCardData(prev => ({ ...prev, [name]: v }));
        } else {
            setCardData(prev => ({ ...prev, [name]: value }));
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="bg-gray-50 p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-gray-900">Secure Payment</span>
                        </div>
                        <span className="text-sm font-medium text-gray-400">Powered by Stripe</span>
                    </div>
                    <div className="mt-4">
                        <p className="text-gray-500 text-sm">Pay for Invoice</p>
                        <h3 className="text-3xl font-bold text-gray-900 tracking-tight">${amount?.toLocaleString()}</h3>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-300"
                                placeholder="customer@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Card Information</label>
                            <div className="relative">
                                <input
                                    name="number"
                                    required
                                    maxLength="19"
                                    value={cardData.number}
                                    onChange={handleCardChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl rounded-b-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-300"
                                    placeholder="4242 4242 4242 4242"
                                />
                                <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            </div>
                            <div className="flex">
                                <input
                                    name="expiry"
                                    required
                                    maxLength="5"
                                    value={cardData.expiry}
                                    onChange={handleCardChange}
                                    className="w-1/2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-bl-xl border-t-0 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-300"
                                    placeholder="MM / YY"
                                />
                                <input
                                    name="cvc"
                                    required
                                    maxLength="3"
                                    className="w-1/2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-br-xl border-t-0 border-l-0 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-300"
                                    placeholder="CVC"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Cardholder Name</label>
                            <input
                                name="name"
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-300"
                                placeholder="Jane Doe"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isProcessing}
                        className={cn(
                            "w-full h-14 rounded-2xl text-lg font-bold bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all",
                            isProcessing && "opacity-80 cursor-wait"
                        )}
                    >
                        {isProcessing ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing Payment...
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
