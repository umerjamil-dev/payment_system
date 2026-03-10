import React from 'react';
import { Mail, Phone, MapPin, Building2, Calendar, ArrowLeft, MoreHorizontal, FileText, History } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../Components/UI/Card';
import { Button } from '../../Components/UI/Button';
import { Badge } from '../../Components/UI/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../Components/UI/Table';
import { Link, useParams } from 'react-router-dom';

const ClientDetails = () => {
    const { id } = useParams();

    // Mock data for a single client
    const client = {
        id: id || '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 234 567 890',
        company: 'Acme Corp',
        address: '123 Business Ave, New York, NY 10001',
        status: 'Active',
        joinedDate: 'Jan 15, 2023',
        totalRevenue: '$15,400.00',
        pendingAmount: '$1,200.00',
        history: [
            { id: 1, action: 'Invoice Generated', target: 'INV-008', date: 'Oct 24, 2023 10:30 AM' },
            { id: 2, action: 'Email Sent', target: 'Payment Reminder', date: 'Oct 20, 2023 02:15 PM' },
            { id: 3, action: 'Payment Received', target: 'INV-007', date: 'Oct 15, 2023 09:00 AM' },
            { id: 4, action: 'Contact Updated', target: 'Phone Number', date: 'Sep 30, 2023 11:45 AM' },
        ],
        invoices: [
            { id: 'INV-008', amount: '$2,500.00', date: 'Oct 24, 2023', status: 'Pending' },
            { id: 'INV-007', amount: '$3,200.00', date: 'Oct 12, 2023', status: 'Paid' },
            { id: 'INV-004', amount: '$1,800.00', date: 'Sep 15, 2023', status: 'Paid' },
        ]
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <Link to="/clients" className="flex items-center text-sm text-gray-500 hover:text-primary transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Clients
                </Link>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">Edit Client</Button>
                    <Button variant="primary" size="sm">Create Invoice</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Client Info Card */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardContent className="p-8 flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full bg-secondary text-white text-3xl flex items-center justify-center font-bold mb-4 shadow-lg ring-4 ring-secondary/10">
                                {client.name.charAt(0)}{client.name.split(' ')[1]?.charAt(0)}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">{client.name}</h3>
                            <p className="text-gray-500 mb-4">{client.company}</p>
                            <Badge variant={client.status === 'Active' ? 'success' : 'default'} className="mb-6">
                                {client.status}
                            </Badge>

                            <div className="w-full space-y-4 text-left">
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">{client.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">{client.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Building2 className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">{client.company}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600 leading-tight">{client.address}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm border-t pt-4 mt-4">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">Customer since {client.joinedDate}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-secondary text-white">
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-blue-100 text-sm opacity-80">Lifetime Value</p>
                                    <h4 className="text-2xl font-bold">{client.totalRevenue}</h4>
                                </div>
                                <div>
                                    <p className="text-blue-100 text-sm opacity-80">Pending Payment</p>
                                    <h4 className="text-2xl font-bold">{client.pendingAmount}</h4>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: History & Invoices */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Client Invoices */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between border-b-0 pb-0 shadow-none">
                            <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-gray-400" />
                                <CardTitle>Invoices</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Invoice #</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {client.invoices.map((inv) => (
                                        <TableRow key={inv.id}>
                                            <TableCell className="font-semibold text-secondary">{inv.id}</TableCell>
                                            <TableCell className="text-gray-500">{inv.date}</TableCell>
                                            <TableCell className="font-medium">{inv.amount}</TableCell>
                                            <TableCell>
                                                <Badge variant={inv.status === 'Paid' ? 'success' : 'warning'}>
                                                    {inv.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Activity Timeline */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <History className="w-5 h-5 text-gray-400" />
                                <CardTitle>Activity History</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                                {client.history.map((event, index) => (
                                    <div key={event.id} className="relative flex items-center justify-between md:justify-start md:odd:flex-row-reverse group is-active">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-gray-50 text-secondary shadow absolute left-0 md:left-5 md:-ml-5 z-10">
                                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                        </div>
                                        <div className="ml-14 md:ml-10 bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex-1">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                                                <div className="font-bold text-gray-900">{event.action}</div>
                                                <time className="text-xs font-medium text-gray-400">{event.date}</time>
                                            </div>
                                            <div className="text-sm text-gray-500">Related to: <span className="font-semibold text-secondary">{event.target}</span></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ClientDetails;
