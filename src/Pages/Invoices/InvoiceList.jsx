import React, { useState } from 'react';
import { Plus, Search, Filter, Download, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../Components/UI/Card';
import { Button } from '../../Components/UI/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../Components/UI/Table';
import { Badge } from '../../Components/UI/Badge';

const InvoiceList = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const invoices = [
        { id: 'INV-001', client: 'Acme Corp', amount: '$2,500.00', date: 'Oct 24, 2023', status: 'Paid', due: 'Nov 24, 2023' },
        { id: 'INV-002', client: 'Global Tech', amount: '$1,200.00', date: 'Oct 23, 2023', status: 'Pending', due: 'Nov 23, 2023' },
        { id: 'INV-003', client: 'Nexus Ltd', amount: '$4,350.00', date: 'Oct 22, 2023', status: 'Overdue', due: 'Oct 29, 2023' },
        { id: 'INV-004', client: 'Bright Star', amount: '$850.00', date: 'Oct 21, 2023', status: 'Paid', due: 'Nov 21, 2023' },
        { id: 'INV-005', client: 'Sky Net', amount: '$1,800.00', date: 'Oct 20, 2023', status: 'Pending', due: 'Nov 20, 2023' },
        { id: 'INV-006', client: 'Acme Corp', amount: '$3,100.00', date: 'Oct 19, 2023', status: 'Paid', due: 'Nov 19, 2023' },
    ];

    const filteredInvoices = invoices.filter(inv =>
        inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.client.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Invoices</h2>
                    <p className="text-gray-500">Track billing history and payment statuses.</p>
                </div>
                <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Create Invoice
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-emerald-50 border-emerald-100">
                    <CardContent className="p-4">
                        <p className="text-sm text-emerald-600 font-medium">Total Collected</p>
                        <h4 className="text-xl font-bold text-emerald-900">$6,450.00</h4>
                    </CardContent>
                </Card>
                <Card className="bg-amber-50 border-amber-100">
                    <CardContent className="p-4">
                        <p className="text-sm text-amber-600 font-medium">Outstanding</p>
                        <h4 className="text-xl font-bold text-amber-900">$3,000.00</h4>
                    </CardContent>
                </Card>
                <Card className="bg-red-50 border-red-100">
                    <CardContent className="p-4">
                        <p className="text-sm text-red-600 font-medium">Overdue</p>
                        <h4 className="text-xl font-bold text-red-900">$4,350.00</h4>
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
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                Export
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
                                <TableHead>Issue Date</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredInvoices.map((inv) => (
                                <TableRow key={inv.id}>
                                    <TableCell className="font-semibold text-secondary">{inv.id}</TableCell>
                                    <TableCell>{inv.client}</TableCell>
                                    <TableCell className="text-gray-500">{inv.date}</TableCell>
                                    <TableCell className="text-gray-500">{inv.due}</TableCell>
                                    <TableCell className="font-medium">{inv.amount}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            inv.status === 'Paid' ? 'success' :
                                                inv.status === 'Pending' ? 'warning' : 'danger'
                                        }>
                                            {inv.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-secondary">
                                            <ExternalLink className="w-4 h-4" />
                                        </Button>
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
