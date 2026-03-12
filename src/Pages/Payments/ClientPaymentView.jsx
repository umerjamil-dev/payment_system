import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCRM } from '../../Context/CRMContext';
import { StripeModal } from '../../Components/Payments/StripeModal';
import {
    BookOpen, Download, CheckCircle2, AlertCircle,
    ShieldCheck, Mail, Building2, Calendar,
    CreditCard, Lock, ArrowRight,
    BadgeCheck, Check
} from 'lucide-react';

const ClientPaymentView = () => {
    const { invoiceId } = useParams();
    const navigate = useNavigate();
    const { invoices, clients, brands, gateways, updateInvoiceStatus, addToast } = useCRM();
    const [isStripeOpen, setIsStripeOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [invoice, setInvoice] = useState(null);
    const [client, setClient] = useState(null);
    const [pdfLoading, setPdfLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            let foundInvoice = invoices.find(inv =>
                inv.id.toLowerCase() === invoiceId?.trim().toLowerCase()
            );

            if (foundInvoice) {
                setInvoice(foundInvoice);
                let foundClient = clients.find(c => c.id === foundInvoice.client_id || c.id === foundInvoice.clientId);
                setClient(foundClient);
            }
            setIsLoading(false);
        }, 300);
        return () => clearTimeout(timer);
    }, [invoiceId, invoices, clients]);

    const handlePaymentSuccess = (method) => {
        updateInvoiceStatus(invoiceId, 'Paid', method);
        addToast('Payment settled. Thank you for your partnership.', 'success');
    };

    const handleDownloadPDF = async () => {
        setPdfLoading(true);
        const element = document.getElementById('ledger-invoice');
        const opt = {
            margin: 0,
            filename: `Invoice-${invoice.id.split('-')[0].toUpperCase()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        try {
            // Ensure html2pdf is loaded
            if (!window.html2pdf) {
                const script = document.createElement('script');
                script.id = 'html2pdf-script';
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
                document.head.appendChild(script);

                await new Promise((resolve, reject) => {
                    script.onload = resolve;
                    script.onerror = reject;
                    // Timeout after 10 seconds
                    setTimeout(() => reject(new Error('html2pdf load timeout')), 10000);
                });
            }

            // Give a tiny moment for browser to settle before capturing
            await new Promise(r => setTimeout(r, 500));

            const worker = window.html2pdf().set(opt).from(element);
            await worker.save();
            addToast('Invoice statement exported successfully!', 'success');
        } catch (error) {
            console.error('PDF Generation Error:', error);
            addToast('Failed to generate PDF. Desktop/Chrome recommended for export.', 'error');
        } finally {
            setPdfLoading(false);
        }
    };

    const brand = brands?.find(b => b.id === invoice?.brand_id || b.id === invoice?.brandId) || brands?.[0] || { name: 'Nexus', color: '#CA1D2A' };

    if (isLoading) return (
        <div className="min-h-screen ledger-page flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-red-600"></div>
        </div>
    );

    if (!invoice) return (
        <div className="min-h-screen ledger-page flex items-center justify-center p-6">
            <div className="text-center p-12 bg-white rounded-3xl shadow-xl border-t-4 border-red-600 max-w-md">
                <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-6" />
                <h2 className="text-3xl font-black text-slate-900 mb-2">Record Not Found</h2>
                <p className="text-slate-500 mb-8">The requested invoice could not be located in our system.</p>
                <button onClick={() => navigate('/')} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all">
                    Return to Home
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen ledger-page py-12 px-4 md:py-20 flex flex-col items-center">
            {/* Action Bar */}
            <div className="w-full max-w-4xl flex justify-end gap-4 mb-8 no-print">
                <button
                    onClick={handleDownloadPDF}
                    disabled={pdfLoading}
                    className="flex items-center gap-2 px-6 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
                >
                    <Download className={`w-4 h-4 ${pdfLoading ? 'animate-bounce' : ''}`} />
                    {pdfLoading ? 'Preparing PDF...' : 'Download PDF'}
                </button>
                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-all shadow-md"
                >
                    <BookOpen className="w-4 h-4" /> Print Statement
                </button>
            </div>

            {/* The Invoice Document */}
            <div
                id="ledger-invoice"
                className="w-full max-w-4xl ledger-card rounded-none overflow-hidden relative border-t-8 border-red-600 shadow-2xl transition-all duration-700 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)]"
            >
                {/* Header Section */}
                <div className="bg-slate-50 p-8 md:p-12 border-b border-slate-100 grid grid-cols-1 md:grid-cols-2 items-start gap-12">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div
                                className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl font-black shadow-lg overflow-hidden shrink-0"
                                style={{ backgroundColor: brand.color }}
                            >
                                {brand.logo ? <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" /> : brand.name.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">{brand.name}</h1>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Official Invoice</p>
                            </div>
                        </div>
                        <div className="p-4 bg-white border border-slate-200 rounded-xl inline-flex gap-8 divide-x divide-slate-100">
                            <div>
                                <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Account ID</p>
                                <p className="text-sm font-mono font-bold text-slate-900">ACT-{invoice.id.split('-')[1]?.toUpperCase() || '74632'}</p>
                            </div>
                            <div className="pl-8">
                                <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Invoice No</p>
                                <p className="text-sm font-mono font-bold text-slate-900">#{invoice.id.split('-')[0].toUpperCase()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="md:text-right space-y-4 flex flex-col md:items-end">
                        <div className="w-24 h-24 p-2 bg-white border border-slate-200 rounded-xl shadow-sm">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${window.location.href}`}
                                alt="Verification QR"
                                className="w-full h-full"
                            />
                        </div>
                        <h2 className="text-5xl font-black text-slate-900 tracking-tighter">INVOICE</h2>
                        <p className="text-sm text-slate-500 font-medium italic">Document Payment Information</p>
                    </div>
                </div>

                {/* Sub-Header: Dates & Client Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 border-b border-slate-100">
                    <div className="p-8 md:p-12 border-r border-slate-100 space-y-8 ledger-block-dark relative">
                        {/* Decorative Strip */}
                        <div className="absolute top-0 left-0 w-1 h-full bg-red-600" />

                        <div className="space-y-4">
                            <div className="flex justify-between border-b border-black/5 pb-2">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Issue Date:</span>
                                <span className="text-sm font-bold text-slate-900">{new Date(invoice.issue_date || invoice.created_at || invoice.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Due Date:</span>
                                <span className="text-sm font-bold text-slate-900">{new Date(invoice.due_date || (new Date(invoice.created_at || invoice.date).getTime() + 7 * 24 * 60 * 60 * 1000)).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Bill To:</p>
                            <div>
                                <h3 className="text-2xl font-black tracking-tight text-slate-900">{client?.name || 'Valued Partner'}</h3>
                                <p className="text-slate-600 font-medium">{client?.company || 'Organization Partner'}</p>
                                <div className="mt-4 space-y-1 text-sm text-slate-700 font-medium">
                                    <p className="flex items-center gap-2"><Mail className="w-3 h-3" /> {client?.email}</p>
                                    <p className="flex items-center gap-2"><Building2 className="w-3 h-3" /> {client?.phone || '(555) 123-4567'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 md:p-12 flex flex-col justify-between">
                        <div className="space-y-6">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Payment Instructions:</p>
                            <div className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <Check className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight">Preferred Method</p>
                                    <p className="text-sm text-slate-600 mt-1 leading-relaxed italic">
                                        Please use the secure checkout portal below for instant settlement. Bank wire transfers are accepted via {brand.name} Direct Infrastructure.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 flex items-baseline justify-between border-t border-slate-100">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${invoice.status === 'Paid' ? 'bg-emerald-500' : 'bg-red-600'} animate-pulse`} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{invoice.status} Status</span>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase text-slate-500">Settlement Currency</p>
                                <p className="text-lg font-black text-slate-900">USD - US Dollar</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-900 text-white text-xs font-black uppercase tracking-widest">
                                <th className="py-6 px-8 text-left">Item Description</th>
                                <th className="py-6 px-8 text-center">Rate</th>
                                <th className="py-6 px-8 text-center">Unit</th>
                                <th className="py-6 px-8 text-right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {(invoice.invoice_items || invoice.items)?.map((item, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-8 px-8">
                                        <p className="text-lg font-bold text-slate-900">{item.description}</p>
                                        <p className="text-xs text-slate-500 font-medium">Professional Managed Services</p>
                                    </td>
                                    <td className="py-8 px-8 text-center font-mono font-bold text-slate-600">${item.price.toLocaleString()}</td>
                                    <td className="py-8 px-8 text-center font-medium text-slate-500">{item.quantity} Qty</td>
                                    <td className="py-8 px-8 text-right font-black text-slate-900 text-lg">${(item.quantity * item.price).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Calculation Section */}
                <div className="flex flex-col md:flex-row justify-between p-8 md:p-12 bg-slate-50/50 border-t border-slate-100 gap-12">
                    <div className="max-w-md space-y-6">
                        <div className="p-6 bg-white border border-slate-200 rounded-[2rem] shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 -rotate-45 translate-x-12 -translate-y-12" />
                            <div className="relative z-10">
                                {invoice.notes ? (
                                    <div className="text-sm text-slate-700 space-y-2 leading-relaxed font-serif italic whitespace-pre-wrap">
                                        {invoice.notes}
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-500 font-bold italic leading-relaxed">
                                        "{brand.description || `Thank you for choosing ${brand.name}. We are committed to excellence in every transaction and partnership we cultivate.`}"
                                    </p>
                                )}
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 mt-4 relative z-10">— {brand.name} Executive Board</p>
                        </div>
                    </div>

                    <div className="md:w-80 space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-bold text-slate-600 uppercase tracking-widest">Gross Subtotal:</span>
                            <span className="font-bold text-slate-900 text-base">${(invoice.total || invoice.amount).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b border-slate-200 pb-4">
                            <span className="font-bold text-slate-600 uppercase tracking-widest">Tax (VAT 0%):</span>
                            <span className="font-bold text-slate-900 text-base">$0.00</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-sm font-black text-red-600 uppercase tracking-[0.2em]">Total Due:</span>
                            <div className="text-right">
                                <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">${(invoice.total || invoice.amount).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Portal Section - NO PRINT */}
                <div className="p-12 bg-white border-t-2 border-slate-100 no-print">
                    <div className="max-w-2xl mx-auto space-y-10">
                        <div className="text-center">
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Secure Settlement Vault</h3>
                            <p className="text-slate-500 text-sm font-medium">Select your preferred transaction bridge to complete the payment.</p>
                        </div>

                        {invoice.status === 'Paid' ? (
                            <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-3xl flex flex-col items-center gap-6 text-center animate-reveal">
                                <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg">
                                    <CheckCircle2 className="w-10 h-10" />
                                </div>
                                <div>
                                    <h4 className="text-2xl font-black text-emerald-900">Transaction Finalized</h4>
                                    <p className="text-emerald-600 font-medium">This document has been fully settled and archived.</p>
                                </div>
                                <button
                                    onClick={handleDownloadPDF}
                                    className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-700 transition-all shadow-xl"
                                >
                                    Retrieve PDF Receipt
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-reveal">
                                {/* Stripe 1 */}
                                {(gateways.stripe1.enabled && (!invoice.allowedGateways || invoice.allowedGateways.stripe1)) && (
                                    <button
                                        onClick={() => setIsStripeOpen(true)}
                                        className="btn-payment-stripe group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="bg-white/10 p-2 rounded-lg">
                                                <CreditCard className="w-5 h-5" />
                                            </div>
                                            <div className="text-left leading-none">
                                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Pay with Card</p>
                                                <p className="text-lg font-black tracking-tighter uppercase">Stripe Pay</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                    </button>
                                )}

                                {/* PayPal */}
                                {(gateways.paypal.enabled && (!invoice.allowedGateways || invoice.allowedGateways.paypal)) && (
                                    <button className="btn-payment-paypal group">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-white/10 p-2 rounded-lg">
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 brightness-0 invert" />
                                            </div>
                                            <div className="text-left leading-none">
                                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">ExpressCheckout</p>
                                                <p className="text-lg font-black tracking-tighter uppercase">PayPal</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="flex items-center justify-center gap-8 py-8 border-t border-slate-50 grayscale opacity-40">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-5" />
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <footer className="p-12 bg-[#0A0A0B] border-t-8 border-blue-600 text-white grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-black">
                                {brand.name.charAt(0)}
                            </div>
                            <span className="font-black uppercase tracking-tight text-white">{brand.name}</span>
                        </div>
                        <p className="text-xs text-white/60 leading-relaxed max-w-[200px]">
                            Advanced Business Solutions and Strategic Infrastructure for Modern Enterprises.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Global Contact</p>
                        <ul className="text-xs space-y-2 text-white/80 font-medium">
                            <li className="flex items-center gap-2"><Mail className="w-3 h-3 text-red-500" /> support@{brand.name.toLowerCase()}.com</li>
                            <li className="flex items-center gap-2"><Calendar className="w-3 h-3 text-red-500" /> Mon - Fri / 09:00 - 18:00</li>
                        </ul>
                    </div>

                    <div className="md:text-right space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Headquarters</p>
                        <p className="text-xs text-white/80 font-medium leading-relaxed">
                            1234 Business Avenue,<br />
                            Suite 500, Innovation District,<br />
                            Corporate Tower, United States
                        </p>
                    </div>
                </footer>
            </div>

            {/* Legal Credits */}
            <div className="mt-12 text-center text-slate-400 font-medium text-[10px] uppercase tracking-widest space-y-2">
                <p>&copy; {new Date().getFullYear()} {brand.name} Group · All Rights Reserved</p>
                <div className="flex items-center justify-center gap-4 opacity-50">
                    <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> PCI Certified</span>
                    <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> SSL Encrypted</span>
                    <span className="flex items-center gap-1"><BadgeCheck className="w-3 h-3" /> Fraud Protected</span>
                </div>
            </div>

            <StripeModal
                isOpen={isStripeOpen}
                onClose={() => setIsStripeOpen(false)}
                onPaymentSuccess={handlePaymentSuccess}
                amount={invoice.total || invoice.amount}
                invoiceId={invoice.id}
            />
        </div>
    );
};

export default ClientPaymentView;