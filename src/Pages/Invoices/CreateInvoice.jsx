import { ArrowLeft, Plus, Trash2, Send, CheckCircle2, ShieldCheck, FileText, CreditCard, Building2, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../Components/UI/Card';
import { Button } from '../../Components/UI/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../Components/UI/Table';
import { useCRM } from '../../Context/CRMContext';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import { useState } from 'react';

const CreateInvoice = () => {
    const { clients, brands, addInvoice } = useCRM();
    const navigate = useNavigate();
    const [selectedClientId, setSelectedClientId] = useState('');
    const [selectedBrandId, setSelectedBrandId] = useState('1');
    const [items, setItems] = useState([{ id: 1, description: '', quantity: 1, price: 0 }]);
    const [allowedGateways, setAllowedGateways] = useState({ stripe1: true, stripe2: true, paypal: true });
    const [isSending, setIsSending] = useState(false);

    const selectedClient = clients.find(c => c.id === selectedClientId);

    const addItem = () => {
        setItems([...items, { id: Date.now(), description: '', quantity: 1, price: 0 }]);
    };

    const removeItem = (id) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const updateItem = (id, field, value) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const handleSend = async () => {
        if (!selectedClientId) {
            alert('Please select a client');
            return;
        }

        setIsSending(true);

        const client = clients.find(c => c.id === selectedClientId);
        const newInvoice = addInvoice({
            clientId: selectedClientId,
            clientName: client.name,
            brandId: selectedBrandId,
            amount: total,
            items: items.map(({ description, quantity, price }) => ({ description, quantity, price })),
            allowedGateways: allowedGateways
        });

        if (newInvoice) {
            const paymentLink = `${window.location.protocol}//${window.location.host}/pay/${newInvoice.id}`;

            // Backup: copy to clipboard
            navigator.clipboard.writeText(paymentLink);

            try {
                // EmailJS Logic
                const SERVICE_ID = 'service_x90d9ll';
                const TEMPLATE_ID = 'template_03sxvjx';
                const PUBLIC_KEY = 'i3Lg3lkiEAl2lyw1J';

                // Initialize EmailJS explicitly
                emailjs.init(PUBLIC_KEY);

                if (!client.email) {
                    throw new Error('Client email is missing in the database');
                }

                const templateParams = {
                    to_email: client.email,
                    email: client.email, // Redundant for dashboard compatibility
                    to_name: client.name,
                    invoice_id: newInvoice.id,
                    total_amount: `$${total.toFixed(2)}`,
                    payment_link: paymentLink,
                    reply_to: 'admin@nexus.com'
                };

                const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);

                if (response.status === 200) {
                    toast.success('Email sent successfully to ' + client.email);
                } else {
                    throw new Error('Unexpected response status: ' + response.status);
                }
            } catch (error) {
                console.error('EmailJS Error:', error);
                toast.error('Email Failed: ' + error.message);
                const errorMsg = error?.text || error?.message || 'Unknown EmailJS error';
                toast.error('EmailJS Failed: ' + errorMsg + '\n\nOpening local email app as backup...');

                // Fallback to mailto link
                const subject = encodeURIComponent(`Invoice ${newInvoice.id} - Nexus CRM`);
                const body = encodeURIComponent(`Hello ${client.name},\n\nYour invoice ${newInvoice.id} for $${total.toFixed(2)} has been generated.\n\nPlease use the link below to view and complete the payment:\n${paymentLink}`);

                const mailtoLink = `mailto:${client.email}?subject=${subject}&body=${body}`;
                const link = document.createElement('a');
                link.href = mailtoLink;
                link.click();
            } finally {
                setIsSending(false);
                navigate('/invoices');
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-20 -m-6 p-6">
            {/* Top Navigation Bar */}
            <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 -mx-6 mb-8 px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        to="/invoices"
                        className="p-2 hover:bg-slate-50 rounded-full transition-colors group"
                        title="Back to Invoices"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-primary" />
                    </Link>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Create New Invoice</h1>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleSend}
                        disabled={isSending}
                        className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 px-6 h-10 rounded-xl flex items-center gap-2 font-semibold transition-all hover:scale-[1.02] active:scale-95"
                    >
                        {isSending ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                        {isSending ? 'Sending...' : 'Send Invoice'}
                    </Button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Entity Selection Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
                        {/* Brand Selection Card */}
                        <Card className="border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-shadow">
                            <CardHeader className="pb-4 border-b border-slate-50">
                                <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-1 h-4 bg-primary rounded-full" />
                                    Brand Presence
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    <select
                                        value={selectedBrandId}
                                        onChange={(e) => setSelectedBrandId(e.target.value)}
                                        className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all cursor-pointer"
                                    >
                                        {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                    </select>

                                    {(() => {
                                        const brand = brands.find(b => b.id === selectedBrandId);
                                        return brand && (
                                            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                                                <div className="flex items-center gap-4">
                                                    <div
                                                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-inner flex-shrink-0 overflow-hidden"
                                                        style={{ backgroundColor: brand.color }}
                                                    >
                                                        {brand.logo ? <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" /> : brand.name.charAt(0)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="font-bold text-slate-900 truncate">{brand.name}</h4>
                                                        <p className="text-xs text-slate-500 line-clamp-1 italic">{brand.description || 'Global business presence.'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Client Selection Card */}
                        <Card className="border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-shadow">
                            <CardHeader className="pb-4 border-b border-slate-50">
                                <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-1 h-4 bg-blue-500 rounded-full" />
                                    Bill To
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    <select
                                        value={selectedClientId}
                                        onChange={(e) => setSelectedClientId(e.target.value)}
                                        className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all cursor-pointer"
                                    >
                                        <option value="">Choose a client...</option>
                                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>

                                    {selectedClient ? (
                                        <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                                            <div className="flex flex-col gap-1">
                                                <p className="text-sm font-bold text-slate-900">{selectedClient.name}</p>
                                                <p className="text-xs text-blue-600 font-medium">{selectedClient.company}</p>
                                                <p className="text-xs text-slate-500 mt-1">{selectedClient.email}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 border border-dashed border-slate-200 rounded-2xl flex items-center justify-center">
                                            <p className="text-xs text-slate-400 font-medium italic">No client selected yet</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Payment Gateways Section Area */}
                    <Card className="border-none shadow-sm bg-white overflow-hidden text-black">
                        <CardHeader className="pb-4 border-b border-slate-50">
                            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                                Payment Availability
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <GatewayToggle
                                    active={allowedGateways.stripe1}
                                    label="Stripe Business"
                                    icon={<CreditCard className="w-5 h-5 text-indigo-500" />}
                                    onClick={() => setAllowedGateways(prev => ({ ...prev, stripe1: !prev.stripe1 }))}
                                />
                                <GatewayToggle
                                    active={allowedGateways.stripe2}
                                    label="Stripe Personal"
                                    icon={<CreditCard className="w-5 h-5 text-purple-500" />}
                                    onClick={() => setAllowedGateways(prev => ({ ...prev, stripe2: !prev.stripe2 }))}
                                />
                                <GatewayToggle
                                    active={allowedGateways.paypal}
                                    label="PayPal Gateway"
                                    icon={<img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" />}
                                    onClick={() => setAllowedGateways(prev => ({ ...prev, paypal: !prev.paypal }))}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Items Section Area */}
                    <Card className="border-none shadow-sm bg-white overflow-hidden text-black">
                        <CardHeader className="pb-4 border-b border-slate-50 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <div className="w-1 h-4 bg-amber-500 rounded-full" />
                                Invoice Line Items
                            </CardTitle>
                            <Button
                                onClick={addItem}
                                variant="outline"
                                size="sm"
                                className="border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-primary rounded-xl flex items-center gap-2 h-9 px-4 font-bold transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                Add Position
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-slate-50/50 border-b border-slate-100">
                                            <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] py-4 px-8">Description</th>
                                            <th className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] py-4 px-4">Qty</th>
                                            <th className="text-right text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] py-4 px-4">Rate</th>
                                            <th className="text-right text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] py-4 px-8">Amount</th>
                                            <th className="w-16"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {items.map((item) => (
                                            <tr key={item.id} className="group hover:bg-slate-50/30 transition-colors">
                                                <td className="py-5 px-8">
                                                    <input
                                                        type="text"
                                                        placeholder="Consultation, Development, etc..."
                                                        className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-700 placeholder:text-slate-300 outline-none"
                                                        value={item.description}
                                                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                                    />
                                                </td>
                                                <td className="py-5 px-4 text-center">
                                                    <input
                                                        type="number"
                                                        className="w-12 bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-700 text-center outline-none"
                                                        value={item.quantity}
                                                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                                    />
                                                </td>
                                                <td className="py-5 px-4 text-right">
                                                    <input
                                                        type="number"
                                                        className="w-24 bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-700 text-right outline-none"
                                                        value={item.price}
                                                        onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                                                    />
                                                </td>
                                                <td className="py-5 px-8 text-right font-bold text-slate-900">
                                                    ${(item.quantity * item.price).toLocaleString()}
                                                </td>
                                                <td className="py-5 px-4 text-center">
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-100 rounded-lg transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Summary Area Section */}
                <div className="lg:col-span-4 h-fit lg:sticky lg:top-24 text-black">
                    <Card className="border-none shadow-2xl bg-white overflow-hidden">
                        <div className="bg-primary/5 p-6 border-b border-primary/10">
                            <h3 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Financial Summary
                            </h3>
                        </div>
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-slate-500">Subtotal</span>
                                    <span className="text-sm font-bold text-slate-900">${subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-slate-500">Tax (10%)</span>
                                    <span className="text-sm font-bold text-slate-900">${tax.toLocaleString()}</span>
                                </div>
                                <div className="pt-6 border-t border-slate-100">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Payable</span>
                                        <div className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">SECURE</div>
                                    </div>
                                    <div className="text-4xl font-black text-primary tracking-tighter">
                                        ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex flex-col gap-3">
                                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Audit trail guaranteed</span>
                                </div>
                                <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                                    This invoice will be electronically signed and dispatched via the secure Nexus delivery network.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Helper Elements */}
                    <div className="mt-6 flex flex-col gap-4">
                        <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm opacity-60">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">SSL Encrypted Delivery</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sub-component for Gateway Toggles UI
const GatewayToggle = ({ active, label, icon, onClick }) => (
    <div
        onClick={onClick}
        className={`group relative p-5 rounded-[2rem] border-2 transition-all cursor-pointer flex flex-col items-center gap-4 text-center ${active
                ? 'border-primary bg-primary/[0.02] shadow-xl shadow-primary/5'
                : 'border-slate-50 bg-slate-50/50 hover:border-slate-200 opacity-60'
            }`}
    >
        <div className={`w-14 h-14 rounded-2xl shadow-lg flex items-center justify-center transition-all group-hover:scale-110 ${active ? 'bg-white text-primary' : 'bg-slate-100 text-slate-300'
            }`}>
            {icon}
        </div>
        <div>
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${active ? 'text-slate-900' : 'text-slate-400'}`}>
                {label}
            </span>
        </div>
        {active && (
            <div className="absolute top-4 right-4 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center shadow-md animate-in zoom-in duration-200">
                <CheckCircle2 className="w-3 h-3 stroke-[4]" />
            </div>
        )}
    </div>
);

export default CreateInvoice;
