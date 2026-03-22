import { ArrowLeft, Plus, Trash2, Send, CheckCircle2, ShieldCheck, FileText, CreditCard, Building2, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
// Assuming this might be used, or just removal
import { Button } from '../../Components/UI/Button';
import { useCRM } from '../../Context/CRMContext';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';

const CreateInvoice = () => {
    const { clients, brands, addInvoice, addActivity } = useCRM();
    const navigate = useNavigate();
    const [selectedClientId, setSelectedClientId] = useState('');
    const [selectedBrandId, setSelectedBrandId] = useState('');
    const [items, setItems] = useState([{ id: 1, description: '', quantity: 1, price: 0 }]);
    const [allowedGateways, setAllowedGateways] = useState({ stripe1: false, stripe2: false, paypal: false });
    const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        if (clients.length > 0 && !selectedClientId) {
            setSelectedClientId(clients[0].id);
        }
    }, [clients, selectedClientId]);

    useEffect(() => {
        if (selectedClientId) {
            const client = clients.find(c => String(c.id) === String(selectedClientId));
            if (client && client.company) {
                const brand = brands.find(b => b.name === client.company);
                if (brand) {
                    setSelectedBrandId(brand.id);
                } else {
                    setSelectedBrandId('');
                }
            } else {
                setSelectedBrandId('');
            }
        }
    }, [selectedClientId, clients, brands]);

    const selectedClient = clients.find(c => String(c.id) === String(selectedClientId));

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
    const tax = subtotal * 0; // 0% tax by default
    const total = subtotal + tax;

    const handleSend = async () => {
        if (!selectedClientId) {
            alert('Please select a client');
            return;
        }

        setIsSending(true);

        const client = clients.find(c => String(c.id) === String(selectedClientId));
        const newInvoice = await addInvoice({
            clientId: selectedClientId,
            brand_id: selectedBrandId,
            issue_date: issueDate,
            due_date: dueDate,
            notes: notes,
            subtotal: subtotal,
            tax: tax,
            total: total,
            items: items.map(({ description, quantity, price }) => ({ description, quantity, price })),
            allowedGateways: allowedGateways
        });

        if (newInvoice) {
            // Log Activity
            addActivity({
                type: 'invoice',
                title: 'New Invoice Drafted',
                description: `Invoice for ${client.name} - amount $${total.toFixed(2)}`,
                status: 'info'
            });

            const paymentId = newInvoice.uuid || newInvoice.id;
            const paymentLink = `${window.location.protocol}//${window.location.host}/pay/${paymentId}`;

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
                    invoice_id: (1010 + Number(newInvoice.id)),
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
        <div className="min-h-screen bg-background mesh-gradient pb-20 -m-6 p-6 font-sans">
            {/* Top Navigation Bar */}
            <div className="glass-premium sticky top-0 z-30 -mx-6 mb-12 px-8 h-20 flex items-center justify-between border-b border-slate-200/40">
                <div className="flex items-center gap-4">
                    <Link
                        to="/invoices"
                        className="p-2 hover:bg-slate-50 rounded-full transition-colors group"
                        title="Back to Invoices"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-primary" />
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">Invoice <span className="text-slate-400 font-light italic font-serif">Draft</span></h1>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleSend}
                        disabled={isSending}
                        className="btn-luxury px-8 h-12 shadow-xl shadow-slate-900/10"
                    >
                        {isSending ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                        {isSending ? 'Dispatching...' : 'Dispatch Invoice'}
                    </Button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-12 animate-reveal">
                    {/* Entity Selection Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-black">
                        {/* Brand Selection Card */}
                        <div className="glass-card rounded-[2rem] overflow-hidden group hover:shadow-2xl transition-all duration-700">
                            <div className="p-6 pb-4 border-b border-slate-100/50">
                                <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Building2 className="w-3 h-3" />
                                    Issuing Brand
                                </h2>
                            </div>
                            <div className="p-8">
                                <div className="space-y-4">
                                    <select
                                        value={selectedBrandId}
                                        onChange={(e) => setSelectedBrandId(e.target.value)}
                                        className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all cursor-pointer appearance-none"
                                    >
                                        <option value="">Select Brand</option>
                                        {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                    </select>

                                    {(() => {
                                        const brand = brands.find(b => String(b.id) === String(selectedBrandId));
                                        return brand && (
                                            <div className="p-5 bg-white border border-slate-100/60 rounded-3xl shadow-sm animate-in fade-in slide-in-from-top-4 duration-700">
                                                <div className="flex items-center gap-5">
                                                    <div
                                                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl flex-shrink-0 overflow-hidden"
                                                        style={{ backgroundColor: brand.color, boxShadow: `0 10px 20px -5px ${brand.color}44` }}
                                                    >
                                                        {brand.logo ? <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" /> : brand.name.charAt(0)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="font-bold text-slate-900 text-lg leading-tight truncate">{brand.name}</h4>
                                                        <p className="text-xs text-slate-400 mt-1 line-clamp-1 italic font-serif italic">{brand.description || 'Premium business entity'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>

                        {/* Client Selection Card */}
                        <div className="glass-card rounded-[2rem] overflow-hidden group hover:shadow-2xl transition-all duration-700">
                            <div className="p-6 pb-4 border-b border-slate-100/50">
                                <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <CreditCard className="w-3 h-3" />
                                    Bill Attention
                                </h2>
                            </div>
                            <div className="p-8">
                                <div className="space-y-4">
                                    <select
                                        value={selectedClientId}
                                        onChange={(e) => setSelectedClientId(e.target.value)}
                                        className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all cursor-pointer appearance-none"
                                    >
                                        <option value="">Select a Client...</option>
                                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>

                                    {selectedClient ? (
                                        <div className="p-5 bg-white border border-slate-100/60 rounded-3xl shadow-sm animate-in fade-in slide-in-from-top-4 duration-700">
                                            <div className="flex flex-col gap-1">
                                                <p className="text-lg font-bold text-slate-900">{selectedClient.name}</p>
                                                <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">{selectedClient.company}</p>
                                                <p className="text-xs text-slate-400 mt-2 font-serif italic">{selectedClient.email}</p>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        {/* Document Schedule Card */}
                        <div className="glass-card rounded-[2rem] overflow-hidden group hover:shadow-2xl transition-all duration-700">
                            <div className="p-6 pb-4 border-b border-slate-100/50">
                                <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Calendar className="w-3 h-3" />
                                    Document Schedule
                                </h2>
                            </div>
                            <div className="p-8">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Issue Date</label>
                                        <input
                                            type="date"
                                            value={issueDate}
                                            onChange={(e) => setIssueDate(e.target.value)}
                                            className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Due Date</label>
                                        <input
                                            type="date"
                                            value={dueDate}
                                            onChange={(e) => setDueDate(e.target.value)}
                                            className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Gateways Section Area */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-slate-400" />
                                    Payment Channels
                                </h2>
                                <p className="text-[11px] text-slate-500 mt-0.5">Select preferred gateways for this invoice</p>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Secure</span>
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <GatewayToggle
                                    active={allowedGateways.stripe1}
                                    label="Stripe Business"
                                    icon={<CreditCard className="w-5 h-5" />}
                                    onClick={() => setAllowedGateways(prev => ({ ...prev, stripe1: !prev.stripe1 }))}
                                />
                                <GatewayToggle
                                    active={allowedGateways.stripe2}
                                    label="Stripe Personal"
                                    icon={<CreditCard className="w-5 h-5" />}
                                    onClick={() => setAllowedGateways(prev => ({ ...prev, stripe2: !prev.stripe2 }))}
                                />
                                <GatewayToggle
                                    active={allowedGateways.paypal}
                                    label="PayPal Official"
                                    icon={<img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" />}
                                    onClick={() => setAllowedGateways(prev => ({ ...prev, paypal: !prev.paypal }))}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Items Section Area */}
                    <div className="glass-card rounded-[2.5rem] overflow-hidden text-black transition-all duration-700 hover:shadow-2xl">
                        <div className="p-8 pb-4 border-b border-slate-100/50 flex flex-row items-center justify-between">
                            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <FileText className="w-3 h-3" />
                                Line Item Specifications
                            </h2>
                            <button
                                onClick={addItem}
                                className="group flex items-center gap-2 h-10 px-5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-500 font-bold text-xs"
                            >
                                <Plus className="w-3.5 h-3.5 transition-transform group-hover:rotate-90" />
                                Add Position
                            </button>
                        </div>
                        <div className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-slate-50/30 border-b border-slate-100/50">
                                            <th className="text-left text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] py-6 px-10">Description</th>
                                            <th className="text-center text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] py-6 px-4">Qty</th>
                                            <th className="text-right text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] py-6 px-4">Rate</th>
                                            <th className="text-right text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] py-6 px-10">Amount</th>
                                            <th className="w-20"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100/50">
                                        {items.map((item) => (
                                            <tr key={item.id} className="group hover:bg-slate-50/40 transition-all duration-300 animate-in fade-in slide-in-from-left-2">
                                                <td className="py-7 px-10">
                                                    <input
                                                        type="text"
                                                        placeholder="Item description..."
                                                        className="w-full bg-transparent border-none focus:ring-0 text-base font-medium text-slate-900 placeholder:text-slate-300 outline-none font-serif"
                                                        value={item.description}
                                                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                                    />
                                                </td>
                                                <td className="py-7 px-4 text-center">
                                                    <input
                                                        type="number"
                                                        className="w-12 bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-900 text-center outline-none"
                                                        value={item.quantity}
                                                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                                    />
                                                </td>
                                                <td className="py-7 px-4 text-right">
                                                    <input
                                                        type="number"
                                                        className="w-24 bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-900 text-right outline-none"
                                                        value={item.price}
                                                        onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                                                    />
                                                </td>
                                                <td className="py-7 px-10 text-right font-black text-slate-900 text-lg tracking-tighter">
                                                    ${(item.quantity * item.price).toLocaleString()}
                                                </td>
                                                <td className="py-7 px-6 text-center">
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="p-3 text-red-500 text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-500"
                                                    >
                                                        <Trash2 className="w-4.5 h-4.5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Statement Notes section */}
                    <div className="glass-card rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all duration-700">
                        <div className="p-8 pb-4 border-b border-slate-100/50">
                            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <FileText className="w-3 h-3" />
                                Statement Executive Notes
                            </h2>
                        </div>
                        <div className="p-8">
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Enter custom terms, delivery details, or professional markdown notes..."
                                className="w-full h-40 bg-slate-50 border border-slate-200 rounded-[2rem] p-8 text-sm font-medium focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all resize-none font-serif italic"
                            />
                            <div className="flex items-center gap-2 mt-4 px-4">
                                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Supports Rich Text & Markdown formatting</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Summary Area Section */}
                <div className="lg:col-span-4 h-fit lg:sticky lg:top-32 text-black space-y-6">
                    <div className="glass-card rounded-[2.5rem] overflow-hidden border border-slate-900/5 shadow-2xl animate-reveal" style={{ animationDelay: '200ms' }}>
                        <div className="bg-slate-900 p-8">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5" />
                                Settlement Summary
                            </h3>
                        </div>
                        <div className="p-10 space-y-8">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Base Amount</span>
                                    <span className="text-base font-bold text-slate-900">${subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Service Tax (0%)</span>
                                    <span className="text-base font-bold text-slate-900">${tax.toLocaleString()}</span>
                                </div>
                                <div className="pt-8 border-t border-slate-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Final Valuation</span>
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                                            <ShieldCheck className="w-3 h-3" />
                                            <span className="text-[9px] font-black uppercase tracking-tighter">Verified</span>
                                        </div>
                                    </div>
                                    <div className="text-5xl font-black text-slate-900 tracking-tighter">
                                        ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex flex-col gap-4">
                                <div className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100/50">
                                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium italic font-serif">
                                        "This instrument facilitates secure cross-border settlement via the Nexus proprietary infrastructure."
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 px-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Secured by Renaissance SSL</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-premium p-6 rounded-[2rem] flex items-center justify-between border border-slate-200/40">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg text-slate-900">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-900 tracking-tight">Enterprise Draft</p>
                                <p className="text-[10px] text-slate-400 font-medium">Auto-saved to Nexus Cloud</p>
                            </div>
                        </div>
                        <Building2 className="w-5 h-5 text-red-500" />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sub-component for Gateway Toggles UI - Clean Tailwind Version
const GatewayToggle = ({ active, label, icon, onClick }) => (
    <div
        onClick={onClick}
        className={`relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex flex-col items-center gap-4 text-center ${active
            ? 'border-slate-900 bg-slate-50 shadow-md ring-4 ring-slate-900/5'
            : 'border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50/30'
            }`}
    >
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${active ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'
            }`}>
            {icon}
        </div>
        <div className="space-y-1">
            <span className={`text-xs font-bold block ${active ? 'text-slate-900' : 'text-slate-500'}`}>
                {label}
            </span>
            <span className={`text-[10px] font-medium block uppercase tracking-wider ${active ? 'text-slate-500' : 'text-slate-300'}`}>
                {active ? 'Enabled' : 'Disabled'}
            </span>
        </div>
        {active && (
            <div className="absolute top-3 right-3 w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                <CheckCircle2 className="w-3 h-3" />
            </div>
        )}
    </div>
);

export default CreateInvoice;
