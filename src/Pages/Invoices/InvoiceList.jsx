import React, { useState } from 'react';
import { Plus, Search, Filter, Download, CheckCircle, Copy } from 'lucide-react';

import { Card, CardHeader, CardContent } from '../../Components/UI/Card';
import { Button } from '../../Components/UI/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../Components/UI/Table';
import { Badge } from '../../Components/UI/Badge';
import { useCRM } from '../../Context/CRMContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const InvoiceList = () => {
    const { invoices, updateInvoiceStatus } = useCRM();
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const filteredInvoices = invoices.filter(inv => {
        const clientName = inv.clients?.name || 'Unknown Client';
        return inv.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            clientName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const stats = {
        collected: invoices.filter(i => i.status === 'Paid').reduce((a, b) => a + Number(b.total || 0), 0),
        outstanding: invoices.filter(i => i.status === 'Pending').reduce((a, b) => a + Number(b.total || 0), 0),
        overdue: invoices.filter(i => i.status === 'Overdue').reduce((a, b) => a + Number(b.total || 0), 0),
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Invoices</h2>
                    <p className="text-gray-500">Track billing history and payment statuses.</p>
                </div>
                <Button onClick={() => navigate('/invoices/new')} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Create Invoice
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-black">
                <Card className="relative overflow-hidden border-none bg-[#0A0A0C] shadow-2xl group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:bg-emerald-500/20 transition-all duration-700" />
                    <CardContent className="p-6 relative z-10">
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Total Collected</p>
                        <h4 className="text-3xl font-black tracking-tighter ">${stats.collected.toLocaleString()}</h4>
                        <div className="mt-4 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[70%]" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="relative overflow-hidden border-none bg-[#0A0A0C]  shadow-2xl group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:bg-amber-500/20 transition-all duration-700" />
                    <CardContent className="p-6 relative z-10">
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Outstanding Balance</p>
                        <h4 className="text-3xl font-black tracking-tighter ">${stats.outstanding.toLocaleString()}</h4>
                        <div className="mt-4 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 w-[45%]" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="relative overflow-hidden border-none bg-[#0A0A0C]  shadow-2xl group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/10 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:bg-red-600/20 transition-all duration-700" />
                    <CardContent className="p-6 relative z-10">
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Overdue Receivables</p>
                        <h4 className="text-3xl font-black tracking-tighter ">${stats.overdue.toLocaleString()}</h4>
                        <div className="mt-4 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-red-600 w-[20%]" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="border-b-0 pb-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search invoices..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                Filter
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice #</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredInvoices.map((inv) => (
                                <TableRow key={inv.id}>
                                    <TableCell className="font-semibold text-secondary">{(1010 + Number(inv.id))}</TableCell>
                                    <TableCell>{inv.clients?.name || 'Unknown Client'}</TableCell>
                                    <TableCell className="text-gray-500">{new Date(inv.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell className="font-medium">${Number(inv.total || 0).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            inv.status === 'Paid' ? 'success' :
                                                inv.status === 'Pending' ? 'warning' : 'danger'
                                        }>
                                            {inv.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {inv.status !== 'Paid' && (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-indigo-500 hover:bg-indigo-50"
                                                        title="Copy Payment Link"
                                                        onClick={() => {
                                                            const link = `${window.location.protocol}//${window.location.host}/pay/${inv.uuid || inv.id}`;
                                                            navigator.clipboard.writeText(link);
                                                            toast.success('Payment link copied to clipboard!');
                                                        }}
                                                    >
                                                        <Copy className="w-8 h-8" />
                                                    </Button>
                                                    <Button onClick={() => updateInvoiceStatus(inv.id, 'Paid')} variant="ghost" size="sm" className="text-emerald-600 hover:bg-emerald-50 gap-1 h-8">
                                                        <CheckCircle className="w-4 h-4" />
                                                        Mark Paid
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default InvoiceList;
