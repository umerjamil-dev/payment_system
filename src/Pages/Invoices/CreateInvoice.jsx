import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Send } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../Components/UI/Card';
import { Button } from '../../Components/UI/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../Components/UI/Table';
import { useCRM } from '../../Context/CRMContext';
import emailjs from '@emailjs/browser';

const CreateInvoice = () => {
    const { clients, addInvoice } = useCRM();
    const navigate = useNavigate();
    const [selectedClientId, setSelectedClientId] = useState('');
    const [items, setItems] = useState([{ id: 1, description: '', quantity: 1, price: 0 }]);
    const [isSending, setIsSending] = useState(false);

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
            amount: total,
            items: items.map(({ description, quantity, price }) => ({ description, quantity, price }))
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Link to="/invoices" className="flex items-center text-sm text-gray-500 hover:text-primary transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Invoices
                </Link>
                <div className="flex gap-3">
                    <Button
                        onClick={handleSend}
                        disabled={isSending}
                        variant="secondary"
                        className="flex items-center gap-2"
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6 text-black">
                    <Card>
                        <CardHeader>
                            <CardTitle>Invoice Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Select Client</label>
                                    <select
                                        value={selectedClientId}
                                        onChange={(e) => setSelectedClientId(e.target.value)}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    >
                                        <option value="">Select a client...</option>
                                        {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.company})</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Invoice Number</label>
                                    <input
                                        type="text"
                                        readOnly
                                        placeholder="Auto-generated"
                                        className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded-lg text-sm outline-none cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-semibold text-gray-900">Line Items</h4>
                                    <Button onClick={addItem} variant="outline" size="sm" className="flex items-center gap-2">
                                        <Plus className="w-4 h-4" />
                                        Add Item
                                    </Button>
                                </div>
                                <div className="border rounded-xl overflow-x-auto scrollbar-hide">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[45%]">Description</TableHead>
                                                <TableHead>Qty</TableHead>
                                                <TableHead>Price</TableHead>
                                                <TableHead>Total</TableHead>
                                                <TableHead className="w-10"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {items.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>
                                                        <input
                                                            type="text"
                                                            placeholder="Item description..."
                                                            className="w-full bg-transparent border-none focus:ring-0 text-sm"
                                                            value={item.description}
                                                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <input
                                                            type="number"
                                                            className="w-16 bg-transparent border-none focus:ring-0 text-sm"
                                                            value={item.quantity}
                                                            onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <input
                                                            type="number"
                                                            className="w-24 bg-transparent border-none focus:ring-0 text-sm"
                                                            value={item.price}
                                                            onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        ${(item.quantity * item.price).toFixed(2)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="text-gray-400 hover:text-primary transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="font-medium">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Tax (10%)</span>
                                <span className="font-medium">${tax.toFixed(2)}</span>
                            </div>
                            <div className="pt-4 border-t flex justify-between items-center">
                                <span className="text-base font-bold text-gray-900">Total Amount</span>
                                <span className="text-xl font-bold text-primary">${total.toFixed(2)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CreateInvoice;
