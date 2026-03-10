import React, { useState } from 'react';
import { Plus, Search, Filter, Download, CheckCircle, Copy } from 'lucide-react';

import { Card, CardHeader, CardContent } from '../../Components/UI/Card';
import { Button } from '../../Components/UI/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../Components/UI/Table';
import { Badge } from '../../Components/UI/Badge';
import { useCRM } from '../../Context/CRMContext';
import { useNavigate } from 'react-router-dom';

const InvoiceList = () => {
    const { invoices, updateInvoiceStatus } = useCRM();
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const filteredInvoices = invoices.filter(inv =>
        inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        collected: invoices.filter(i => i.status === 'Paid').reduce((a, b) => a + b.amount, 0),
        outstanding: invoices.filter(i => i.status === 'Pending').reduce((a, b) => a + b.amount, 0),
        overdue: invoices.filter(i => i.status === 'Overdue').reduce((a, b) => a + b.amount, 0),
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-emerald-50 border-emerald-100">
                    <CardContent className="p-4">
                        <p className="text-sm text-emerald-600 font-medium">Total Collected</p>
                        <h4 className="text-xl font-bold text-emerald-900">${stats.collected.toLocaleString()}</h4>
                    </CardContent>
                </Card>
                <Card className="bg-amber-50 border-amber-100">
                    <CardContent className="p-4">
                        <p className="text-sm text-amber-600 font-medium">Outstanding</p>
                        <h4 className="text-xl font-bold text-amber-900">${stats.outstanding.toLocaleString()}</h4>
                    </CardContent>
                </Card>
                <Card className="bg-red-50 border-red-100">
                    <CardContent className="p-4">
                        <p className="text-sm text-red-600 font-medium">Overdue</p>
                        <h4 className="text-xl font-bold text-red-900">${stats.overdue.toLocaleString()}</h4>
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
                <CardContent className="p-0">
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
                                    <TableCell className="font-semibold text-secondary">{inv.id}</TableCell>
                                    <TableCell>{inv.clientName}</TableCell>
                                    <TableCell className="text-gray-500">{inv.date}</TableCell>
                                    <TableCell className="font-medium">${inv.amount.toLocaleString()}</TableCell>
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
                                                            const link = `${window.location.host}/pay/${inv.id}`;
                                                            navigator.clipboard.writeText(link);
                                                            alert('Payment link copied to clipboard!');
                                                        }}
                                                    >
                                                        <Copy className="w-4 h-4" />
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
