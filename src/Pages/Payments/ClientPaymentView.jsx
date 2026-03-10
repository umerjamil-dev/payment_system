import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCRM } from '../../Context/CRMContext';
import { StripeModal } from '../../Components/Payments/StripeModal';
import { Button } from '../../Components/UI/Button';
import { Badge } from '../../Components/UI/Badge';
import { Card } from '../../Components/UI/Card';
import { BookOpen, Download, CheckCircle2, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';

const ClientPaymentView = () => {
    const { invoiceId } = useParams();
    const navigate = useNavigate();
    const { invoices, clients, updateInvoiceStatus, addToast } = useCRM();
    const [isStripeOpen, setIsStripeOpen] = useState(false);
    const [invoice, setInvoice] = useState(null);
    const [client, setClient] = useState(null);

    useEffect(() => {
        const foundInvoice = invoices.find(inv => inv.id === invoiceId);
        if (foundInvoice) {
            setInvoice(foundInvoice);
            const foundClient = clients.find(c => c.id === foundInvoice.clientId);
            setClient(foundClient);
        }
    }, [invoiceId, invoices, clients]);

    const handlePaymentSuccess = (method) => {
        updateInvoiceStatus(invoiceId, 'Paid', method);
        addToast('Payment successful! Your E-book is now available.', 'success');
    };

    if (!invoice) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <Card className="text-center p-12 max-w-md">
                    <AlertCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Invoice Not Found</h2>
                    <p className="text-gray-500 mb-8">The invoice link you followed might be invalid or expired.</p>
                    <Button onClick={() => navigate('/')} className="bg-secondary">Go Back</Button>
                </Card>
            </div>
        );
    }

    const isEbook = invoice.items.some(item => item.description.toLowerCase().includes('e-book') || item.description.toLowerCase().includes('ebook'));

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header / Brand */}
            <div className="bg-white border-b border-gray-100 h-20 flex items-center px-6 md:px-12 justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl italic">
                        N
                    </div>
                    <span className="font-bold text-xl tracking-tight text-secondary">NEXUS BILLING</span>
                </div>
                <Badge variant={invoice.status === 'Paid' ? 'success' : 'warning'}>{invoice.status}</Badge>
            </div>

            <main className="max-w-5xl mx-auto py-12 px-6 md:px-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Invoice Details */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 mb-2">Invoice {invoice.id}</h1>
                            <p className="text-gray-500">Issued on {new Date(invoice.date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Amount</p>
                            <h2 className="text-5xl font-black text-primary">${invoice.amount?.toLocaleString()}</h2>
                        </div>
                    </div>

                    <Card className="p-0 overflow-hidden border-none shadow-xl shadow-gray-200/50">
                        <div className="bg-secondary p-8 text-white">
                            <h3 className="font-bold text-lg mb-4 opacity-80">Billed To</h3>
                            <div className="space-y-1">
                                <p className="text-xl font-bold">{client?.name || 'Client'}</p>
                                <p className="opacity-70">{client?.company || 'Organization'}</p>
                                <p className="opacity-70">{client?.email}</p>
                            </div>
                        </div>

                        <div className="p-8">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Item</th>
                                        <th className="text-center py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Qty</th>
                                        <th className="text-right py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Price</th>
                                        <th className="text-right py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoice.items.map((item, idx) => (
                                        <tr key={idx} className="border-b border-gray-50 last:border-0">
                                            <td className="py-6">
                                                <p className="font-bold text-gray-900">{item.description}</p>
                                            </td>
                                            <td className="py-6 text-center text-gray-600 font-medium">{item.quantity}</td>
                                            <td className="py-6 text-right text-gray-600 font-medium">${item.price.toLocaleString()}</td>
                                            <td className="py-6 text-right font-black text-gray-900">${(item.quantity * item.price).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    {invoice.status === 'Paid' && isEbook && (
                        <Card className="p-8 bg-green-50/50 border-green-100 flex items-center justify-between animate-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
                                    <BookOpen className="w-8 h-8" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 leading-tight">Your E-book is ready!</h4>
                                    <p className="text-sm text-green-700 font-medium">Thank you for your purchase.</p>
                                </div>
                            </div>
                            <Button className="bg-green-600 hover:bg-green-700 rounded-xl px-8 flex items-center gap-2">
                                <Download className="w-5 h-5" />
                                Download PDF
                            </Button>
                        </Card>
                    )}
                </div>

                {/* Payment Action Sidebar */}
                <div className="space-y-6">
                    <Card className="p-8 border-none shadow-xl shadow-gray-200/50 sticky top-24">
                        {invoice.status === 'Paid' ? (
                            <div className="text-center py-6 space-y-4">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="w-10 h-10" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900">Payment Completed</h3>
                                    <p className="text-gray-500 font-medium mt-1">Paid via {invoice.paymentMethod || 'Stripe'}</p>
                                </div>
                                <div className="pt-6">
                                    <Button variant="outline" className="w-full rounded-xl py-6" onClick={() => window.print()}>
                                        Print Receipt
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Complete Payment</h3>
                                    <p className="text-gray-500 text-sm font-medium leading-relaxed">
                                        Please complete the payment below to gain instant access to your E-book.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <Button
                                        className="w-full py-8 text-xl font-black bg-primary hover:bg-primary-dark rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
                                        onClick={() => setIsStripeOpen(true)}
                                    >
                                        Pay Now
                                    </Button>
                                    <div className="flex items-center justify-center gap-4 pt-2 opacity-40">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-4" />
                                        <div className="h-4 w-[1px] bg-gray-400"></div>
                                        <ShieldCheck className="w-4 h-4 text-gray-900" />
                                        <span className="text-[10px] font-bold uppercase tracking-tighter">Secure</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </main>

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

