import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCRM } from '../../Context/CRMContext';
import { StripeModal } from '../../Components/Payments/StripeModal';
import {
    BookOpen, Download, CheckCircle2, AlertCircle,
    ShieldCheck, Mail, Building2, Calendar,
    CreditCard, Lock, ArrowRight
} from 'lucide-react';

const ClientPaymentView = () => {
    const { invoiceId } = useParams();
    const navigate = useNavigate();
    const { invoices, clients, brands, gateways, updateInvoiceStatus, addToast } = useCRM();
    const [isStripeOpen, setIsStripeOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [invoice, setInvoice] = useState(null);
    const [client, setClient] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            let foundInvoice = invoices.find(inv =>
                inv.id.toLowerCase() === invoiceId?.trim().toLowerCase()
            );
            if (!foundInvoice) {
                const saved = localStorage.getItem('nexus_invoices');
                if (saved) {
                    foundInvoice = JSON.parse(saved).find(inv =>
                        inv.id.toLowerCase() === invoiceId?.trim().toLowerCase()
                    );
                }
            }
            if (foundInvoice) {
                setInvoice(foundInvoice);
                let foundClient = clients.find(c => c.id === foundInvoice.clientId);
                if (!foundClient) {
                    const saved = localStorage.getItem('nexus_clients');
                    if (saved) foundClient = JSON.parse(saved).find(c => c.id === foundInvoice.clientId);
                }
                setClient(foundClient);
            }
            setIsLoading(false);
        }, 300);
        return () => clearTimeout(timer);
    }, [invoiceId, invoices, clients]);

    const handlePaymentSuccess = (method) => {
        updateInvoiceStatus(invoiceId, 'Paid', method);
        addToast('Payment successful! Your asset is now available.', 'success');
    };

    const isEbook = invoice?.items?.some(item =>
        item.description.toLowerCase().includes('e-book') ||
        item.description.toLowerCase().includes('ebook')
    );

    const brand = brands?.find(b => b.id === invoice?.brandId) || brands?.[0] || { name: 'Nexus', color: '#CA1D2A' };

    /* ── Loading ── */
    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-red-600 animate-spin" />
        </div>
    );

    /* ── Not Found ── */
    if (!invoice) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <div className="bg-white rounded-3xl p-16 text-center max-w-md w-full shadow-2xl border border-gray-100">
                <div className="w-20 h-20 rounded-full bg-red-50 border-2 border-red-100 flex items-center justify-center mx-auto mb-8">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Invoice Not Found</h2>
                <p className="text-gray-500 font-medium mb-10 leading-relaxed">
                    The invoice link you followed might be invalid or expired.
                </p>
                <button
                    onClick={() => navigate('/login')}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs tracking-widest uppercase rounded-2xl transition-all shadow-lg shadow-red-600/25 hover:-translate-y-0.5"
                >
                    Go to Dashboard <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 lg:py-20 flex flex-col items-center">

            {/* ── Main Card ── */}
            <div className="w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100">

                {/* ── Header ── */}
                <div
                    className="relative px-8 py-10 md:px-14 md:py-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 overflow-hidden"
                    style={{ backgroundColor: '#253F80' }}
                >
                    {/* Red glow overlay */}
                    <div
                        className="absolute right-0 top-0 bottom-0 w-2/3 pointer-events-none opacity-20"
                        style={{ background: 'radial-gradient(ellipse 80% 150% at 100% 50%, #CA1D2A, transparent)' }}
                    />

                    {/* Brand */}
                    <div className="flex items-center gap-5 relative z-10">
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl overflow-hidden flex-shrink-0"
                            style={{ backgroundColor: brand.color, border: '2px solid rgba(255,255,255,0.15)' }}
                        >
                            {brand.logo
                                ? <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
                                : brand.name.charAt(0)
                            }
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tight uppercase leading-none">
                                {brand.name}
                            </h2>
                            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mt-2">
                                Official Secure Billing Portal
                            </p>
                        </div>
                    </div>

                    {/* Doc ID */}
                    <div className="text-left md:text-right relative z-10">
                        <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-1">
                            Document Identifier
                        </p>
                        <h1 className="text-5xl font-black text-white tracking-tight leading-none">
                            #{invoice.id}
                        </h1>
                        <div className="flex items-center md:justify-end gap-2 text-white/40 text-xs font-semibold mt-3 uppercase tracking-wider">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(invoice.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                        </div>
                    </div>
                </div>

                {/* ── Body ── */}
                <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-100">

                    {/* Left: Details */}
                    <div className="flex-1 p-8 md:p-12 space-y-14">

                        {/* Recipient + Amount */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                            <div>
                                <p className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">
                                    <Building2 className="w-3.5 h-3.5 opacity-50" />
                                    Recipient Information
                                </p>
                                <p className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-1">
                                    {client?.name || 'Valued Client'}
                                </p>
                                <p className="text-sm font-medium text-gray-400 mb-5">
                                    {client?.company || 'Organization'}
                                </p>
                                <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                                    <Mail className="w-3.5 h-3.5 opacity-50" />
                                    {client?.email}
                                </div>
                            </div>

                            <div className="md:text-right">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">
                                    Amount to Settle
                                </p>
                                <p className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-2">
                                    Amount Due
                                </p>
                                <p className="text-6xl font-black tracking-tight leading-none" style={{ color: '#CA1D2A' }}>
                                    <span className="text-2xl font-light opacity-40 mr-1">$</span>
                                    {invoice.amount?.toLocaleString()}
                                </p>
                                <span className={`inline-block mt-4 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ring-1 ${
                                    invoice.status === 'Paid'
                                        ? 'bg-emerald-50 text-emerald-600 ring-emerald-200'
                                        : 'bg-amber-50 text-amber-600 ring-amber-200'
                                }`}>
                                    Payment {invoice.status}
                                </span>
                            </div>
                        </div>

                        {/* Line Items */}
                        <div>
                            <div
                                className="flex items-baseline justify-between pb-4 mb-1"
                                style={{ borderBottom: '2px solid #253F80' }}
                            >
                                <h3 className="text-xl font-black text-gray-900 tracking-tight">Line Items</h3>
                                <span className="text-xs font-bold text-gray-300 uppercase tracking-widest italic">
                                    Itemized Statement
                                </span>
                            </div>

                            <table className="w-full">
                                <thead>
                                    <tr className="text-xs font-bold text-gray-400 uppercase tracking-widest opacity-60">
                                        <th className="text-left py-5 font-bold">Description</th>
                                        <th className="text-center py-5 px-4 font-bold">Qty</th>
                                        <th className="text-right py-5 font-bold">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {invoice.items?.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="py-6">
                                                <p className="text-base font-bold text-gray-800 tracking-tight leading-none mb-1.5">
                                                    {item.description}
                                                </p>
                                                <p className="text-xs text-gray-400 font-medium tracking-wide">
                                                    Standard Unit Billing
                                                </p>
                                            </td>
                                            <td className="py-6 px-4 text-center">
                                                <span className="inline-block bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1.5 rounded-lg tracking-wide">
                                                    ×{item.quantity}
                                                </span>
                                            </td>
                                            <td className="py-6 text-right">
                                                <span className="text-lg font-black text-gray-900 tracking-tight">
                                                    <span className="text-gray-300 font-light mr-0.5">$</span>
                                                    {(item.quantity * item.price).toLocaleString()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Brand Note */}
                        {brand.description && (
                            <div
                                className="relative rounded-2xl p-8 overflow-hidden"
                                style={{
                                    background: 'linear-gradient(135deg, #F8F9FC, #EEF1F9)',
                                    border: '1px solid rgba(37,63,128,0.1)'
                                }}
                            >
                                <div
                                    className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                                    style={{ backgroundColor: '#253F80' }}
                                />
                                <p className="text-xs font-bold uppercase tracking-widest mb-3 opacity-60"
                                    style={{ color: '#253F80' }}>
                                    Note from {brand.name}
                                </p>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                    {brand.description}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:w-80 xl:w-96 p-8 md:p-10 bg-slate-50/30">
                        <div className="sticky top-10">

                            {invoice.status === 'Paid' ? (
                                <div className="text-center py-8 space-y-6">
                                    <div className="w-24 h-24 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center mx-auto shadow-inner">
                                        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Settled</h3>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            Thank you for your business
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-3 pt-4">
                                        <button
                                            onClick={() => window.print()}
                                            className="w-full flex items-center justify-center gap-2 h-12 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 font-bold text-xs uppercase tracking-widest transition-all hover:border-gray-300"
                                        >
                                            <Download className="w-4 h-4 opacity-50" /> Print Statement
                                        </button>
                                        {isEbook && (
                                            <button className="w-full flex items-center justify-center gap-2 h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5">
                                                <BookOpen className="w-4 h-4" /> Access Digital Assets
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <div className="pb-7 border-b border-gray-100">
                                        <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                                            Checkout
                                        </h3>
                                        <div className="flex items-center gap-2 text-emerald-600">
                                            <ShieldCheck className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase tracking-widest">
                                                End-to-End Encrypted
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">

                                        {/* Stripe 1 */}
                                        {(gateways.stripe1.enabled && (!invoice.allowedGateways || invoice.allowedGateways.stripe1)) && (
                                            <button
                                                onClick={() => setIsStripeOpen(true)}
                                                className="w-full p-5 bg-white hover:bg-gray-50 border border-gray-100 hover:border-red-200 rounded-2xl flex items-center gap-4 group transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                                            >
                                                <div className="w-12 h-12 rounded-xl bg-gray-50 group-hover:bg-red-600 flex items-center justify-center text-gray-400 group-hover:text-white transition-all duration-200 flex-shrink-0">
                                                    <CreditCard className="w-5 h-5" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-0.5">Primary Card</p>
                                                    <p className="text-sm font-bold text-gray-700 tracking-tight">{gateways.stripe1.name}</p>
                                                </div>
                                                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-red-500" />
                                            </button>
                                        )}

                                        {/* Stripe 2 */}
                                        {(gateways.stripe2.enabled && (!invoice.allowedGateways || invoice.allowedGateways.stripe2)) && (
                                            <button
                                                onClick={() => setIsStripeOpen(true)}
                                                className="w-full p-5 bg-white hover:bg-gray-50 border border-gray-100 hover:border-red-200 rounded-2xl flex items-center gap-4 group transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                                            >
                                                <div className="w-12 h-12 rounded-xl bg-gray-50 group-hover:bg-red-600 flex items-center justify-center text-gray-400 group-hover:text-white transition-all duration-200 flex-shrink-0">
                                                    <CreditCard className="w-5 h-5" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-0.5">Alt Settlement</p>
                                                    <p className="text-sm font-bold text-gray-700 tracking-tight">{gateways.stripe2.name}</p>
                                                </div>
                                                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-red-500" />
                                            </button>
                                        )}

                                        {/* PayPal */}
                                        {(gateways.paypal.enabled && (!invoice.allowedGateways || invoice.allowedGateways.paypal)) && (
                                            <button className="w-full p-5 bg-[#003087] hover:bg-[#001f5c] rounded-2xl flex items-center gap-4 group transition-all duration-200 shadow-lg hover:-translate-y-0.5">
                                                <div className="w-12 h-12 rounded-xl bg-white/10 group-hover:bg-white/20 flex items-center justify-center flex-shrink-0 transition-all">
                                                    <img
                                                        src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                                                        alt="PayPal"
                                                        className="h-5 brightness-0 invert opacity-60 group-hover:opacity-100 transition-opacity"
                                                    />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-0.5">Express Pay</p>
                                                    <p className="text-sm font-bold text-white tracking-tight">PayPal Checkout</p>
                                                </div>
                                                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-white/60" />
                                            </button>
                                        )}
                                    </div>

                                    {/* PCI Badge */}
                                    <div
                                        className="flex items-center gap-3 p-4 rounded-2xl"
                                        style={{
                                            background: 'linear-gradient(135deg, #EEF2FF, #E8EEFF)',
                                            border: '1px solid rgba(37,63,128,0.1)'
                                        }}
                                    >
                                        <Lock className="w-5 h-5 flex-shrink-0 opacity-40" style={{ color: '#253F80' }} />
                                        <p className="text-xs font-bold uppercase tracking-wide leading-relaxed"
                                            style={{ color: '#253F80', opacity: .65 }}>
                                            PCI‑DSS Compliant<br />
                                            <span className="opacity-70 normal-case tracking-normal font-medium">Level 1 Infrastructure Verified</span>
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-12 w-full max-w-5xl px-4 flex flex-col md:flex-row items-center justify-between gap-6 opacity-30 hover:opacity-80 transition-opacity duration-500">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    &copy; {new Date().getFullYear()} {brand.name} · Nexus Finance Core
                </p>
                <div className="flex items-center gap-8 grayscale brightness-125">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-4" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3.5" />
                </div>
            </footer>

            <StripeModal
                isOpen={isStripeOpen}
                onClose={() => setIsStripeOpen(false)}
                onPaymentSuccess={handlePaymentSuccess}
                amount={invoice.amount}
                invoiceId={invoice.id}
            />
        </div>
    );
};

export default ClientPaymentView;