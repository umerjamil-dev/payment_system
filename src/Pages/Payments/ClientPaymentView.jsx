import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCRM } from '../../Context/CRMContext';
import { StripeModal } from '../../Components/Payments/StripeModal';
import { Button } from '../../Components/UI/Button';
import { Badge } from '../../Components/UI/Badge';
import { Card } from '../../Components/UI/Card';
import { BookOpen, Download, CheckCircle2, AlertCircle, ShieldCheck, Mail, Building2, Calendar, FileText, CreditCard } from 'lucide-react';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

const ClientPaymentView = () => {
    const { invoiceId } = useParams();
    const navigate = useNavigate();
    const { invoices, clients, updateInvoiceStatus, addToast } = useCRM();
    const [isStripeOpen, setIsStripeOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [invoice, setInvoice] = useState(null);
    const [client, setClient] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            // First check in context
            let foundInvoice = invoices.find(inv =>
                inv.id.toLowerCase() === invoiceId?.trim().toLowerCase()
            );

            // If not in context, check directly in localStorage (Safety Fallback)
            if (!foundInvoice) {
                const savedInvoices = localStorage.getItem('nexus_invoices');
                if (savedInvoices) {
                    const parsedInvoices = JSON.parse(savedInvoices);
                    foundInvoice = parsedInvoices.find(inv =>
                        inv.id.toLowerCase() === invoiceId?.trim().toLowerCase()
                    );
                }
            }

            if (foundInvoice) {
                setInvoice(foundInvoice);
                const foundClient = clients.find(c => c.id === foundInvoice.clientId);
                if (foundClient) {
                    setClient(foundClient);
                } else {
                    // Safety check if client isn't matched
                    const savedClients = localStorage.getItem('nexus_clients');
                    if (savedClients) {
                        const parsedClients = JSON.parse(savedClients);
                        setClient(parsedClients.find(c => c.id === foundInvoice.clientId));
                    }
                }
            }
            setIsLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [invoiceId, invoices, clients]);

    const handlePaymentSuccess = (method) => {
        updateInvoiceStatus(invoiceId, 'Paid', method);
        addToast('Payment successful! Your E-book is now available.', 'success');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#05070a]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin z-10" />
            </div>
        );
    }

    if (!invoice) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#05070a]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
                <Card className="glass-card text-center p-12 max-w-md relative z-10 border-white/10">
                    <AlertCircle className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
                    <h2 className="text-2xl font-bold text-white mb-2">Invoice Not Found</h2>
                    <p className="text-white/50 mb-8">The invoice link you followed might be invalid or expired.</p>
                    <Button onClick={() => navigate('/login')} variant="secondary">Go to Login</Button>
                </Card>
            </div>
        );
    }

    const isEbook = invoice.items?.some(item =>
        item.description.toLowerCase().includes('e-book') ||
        item.description.toLowerCase().includes('ebook')
    );

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col bg-[#05070a]">
            {/* Rich Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-blue-600/5 pointer-events-none" />

            {/* Decorative Orbs */}
            <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />

            {/* Header / Brand */}
            <header className="glass-card !rounded-none border-t-0 border-x-0 border-b border-white/5 h-20 flex items-center px-6 md:px-12 justify-between relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20">
                        N
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white uppercase italic">Nexus Billing</span>
                </div>
                <Badge
                    className={cn(
                        "px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest",
                        invoice.status === 'Paid' ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                    )}
                >
                    {invoice.status}
                </Badge>
            </header>

            <main className="max-w-6xl mx-auto py-12 px-6 md:px-12 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10 flex-1 w-full">
                {/* Invoice Details */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 text-primary mb-2">
                                <FileText className="w-5 h-5" />
                                <span className="text-sm font-bold uppercase tracking-[0.2em]">Official Invoice</span>
                            </div>
                            <h1 className="text-4xl font-black text-white mb-2">Invoice {invoice.id}</h1>
                            <div className="flex items-center gap-4 text-white/50 text-sm">
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    Issued: {new Date(invoice.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                </span>
                            </div>
                        </div>
                        <div className="text-left md:text-right bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <p className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Total Amount Due</p>
                            <h2 className="text-4xl font-black text-primary animate-glow-soft">${invoice.amount?.toLocaleString()}</h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Client Info */}
                        <div className="glass-card p-8 border-white/10 group hover:border-primary/30 transition-all">
                            <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <Building2 className="w-4 h-4" /> Billed To
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-2xl font-bold text-white leading-tight">{client?.name || 'Valued Client'}</p>
                                    <p className="text-white/60 font-medium">{client?.company || 'Organization'}</p>
                                </div>
                                <div className="pt-4 border-t border-white/5 space-y-2">
                                    <p className="flex items-center gap-3 text-white/50 text-sm">
                                        <Mail className="w-4 h-4 text-primary" />
                                        {client?.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Status Guard */}
                        <div className="glass-card p-8 border-white/10 flex flex-col justify-center items-center text-center space-y-4">
                            {invoice.status === 'Paid' ? (
                                <>
                                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/30">
                                        <CheckCircle2 className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-xl font-bold text-white">Payment Received</h4>
                                    <p className="text-white/50 text-sm">Verified via {invoice.paymentMethod || 'Secure API'}</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center border border-amber-500/30">
                                        <CreditCard className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-xl font-bold text-white">Pending Payment</h4>
                                    <p className="text-white/50 text-sm">Awaiting secure transaction</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Line Items Table */}
                    <Card className="glass-card overflow-hidden border-white/10 p-0">
                        <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
                            <h3 className="font-bold text-white">Invoice Summary</h3>
                            <span className="text-xs text-white/30 uppercase tracking-widest font-bold">Details</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-black/20 text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">
                                        <th className="text-left py-4 px-8">Description</th>
                                        <th className="text-center py-4 px-4">Qty</th>
                                        <th className="text-right py-4 px-4">Price</th>
                                        <th className="text-right py-4 px-8">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {invoice.items?.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-white/5 transition-colors group">
                                            <td className="py-6 px-8">
                                                <p className="font-bold text-white group-hover:text-primary transition-colors">{item.description}</p>
                                            </td>
                                            <td className="py-6 px-4 text-center text-white/60 font-medium tracking-wider">{item.quantity}</td>
                                            <td className="py-6 px-4 text-right text-white/60 font-medium">${item.price.toLocaleString()}</td>
                                            <td className="py-6 px-8 text-right font-black text-white">${(item.quantity * item.price).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    {invoice.status === 'Paid' && isEbook && (
                        <div className="glass-card p-8 bg-emerald-500/5 border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
                                    <BookOpen className="w-8 h-8" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-white leading-tight">Your Asset is Ready!</h4>
                                    <p className="text-emerald-400/80 font-medium">Download your premium E-book now.</p>
                                </div>
                            </div>
                            <Button className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-10 py-6 h-auto flex items-center justify-center gap-3 font-bold shadow-xl shadow-emerald-600/20 transition-all hover:scale-[1.05]">
                                <Download className="w-5 h-5" />
                                Download PDF
                            </Button>
                        </div>
                    )}
                </div>

                {/* Payment Action Bar */}
                <div className="space-y-6">
                    <Card className="glass-card p-8 border-white/10 sticky top-12 shadow-2xl">
                        {invoice.status === 'Paid' ? (
                            <div className="text-center py-4 space-y-6">
                                <div className="w-24 h-24 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30 animate-in zoom-in-50 duration-500">
                                    <CheckCircle2 className="w-12 h-12" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white">Payment Complete</h3>
                                    <p className="text-white/40 font-medium mt-2">Thank you for your business!</p>
                                </div>
                                <div className="pt-4 border-t border-white/10">
                                    <Button
                                        variant="outline"
                                        className="w-full h-14 rounded-xl border-white/10 hover:bg-white/5 text-white/70 hover:text-white transition-all font-bold tracking-widest uppercase text-xs"
                                        onClick={() => window.print()}
                                    >
                                        Download Receipt
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-black text-white leading-tight">Secure Checkout</h3>
                                    <p className="text-white/50 text-sm font-medium leading-relaxed">
                                        Review your invoice details and complete the transaction via our secure gateway.
                                    </p>
                                </div>
                                <div className="space-y-6">
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                                        <span className="text-white/40 text-sm font-bold uppercase tracking-widest">Payable</span>
                                        <span className="text-2xl font-black text-white">${invoice.amount?.toLocaleString()}</span>
                                    </div>
                                    <Button
                                        className="w-full h-20 text-xl font-black bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 group relative overflow-hidden"
                                        onClick={() => setIsStripeOpen(true)}
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-3">
                                            PAY SECURELY <ShieldCheck className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    </Button>
                                    <div className="flex flex-col items-center gap-4 pt-2">
                                        <div className="flex items-center gap-3 opacity-30 invert brightness-0">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-5" />
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
                                            <ShieldCheck className="w-3 h-3" />
                                            256-BIT ENCRYPTION
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>

                    <p className="text-center text-[10px] text-white/20 font-bold uppercase tracking-[0.2em] px-8 py-4 bg-black/20 rounded-xl border border-white/5">
                        Payments processed by Nexus Billing. No card data is stored on our servers.
                    </p>
                </div>
            </main>

            <footer className="py-8 text-center text-white/20 text-[10px] font-bold uppercase tracking-[0.4em] relative z-10">
                &copy; {new Date().getFullYear()} NEXUS CRM SYSTEM • POWERED BY LUXURY TECH
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
