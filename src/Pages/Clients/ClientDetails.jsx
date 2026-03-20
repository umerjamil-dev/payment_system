import React from 'react';
import { Mail, Phone, MapPin, Building2, Calendar, ArrowLeft, FileText, History } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../Components/UI/Card';
import { Button } from '../../Components/UI/Button';
import { Badge } from '../../Components/UI/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../Components/UI/Table';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useCRM } from '../../Context/CRMContext';

const ClientDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { clients, invoices } = useCRM();

    const client = clients.find(c => String(c.id) === String(id));
    const clientInvoices = invoices.filter(inv => String(inv.clientId || inv.client_id) === String(id));

    if (!client) {
        return (
            <div className="text-center py-20">
                <h3 className="text-xl font-bold">Client not found</h3>
                <Link to="/clients" className="text-primary hover:underline">Back to clients</Link>
            </div>
        );
    }

    const totalSpent = clientInvoices
        .filter(inv => inv.status === 'Paid')
        .reduce((acc, inv) => acc + inv.amount, 0);

    const pendingAmount = clientInvoices
        .filter(inv => inv.status === 'Pending' || inv.status === 'Overdue')
        .reduce((acc, inv) => acc + inv.amount, 0);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="flex items-center text-sm text-gray-500 hover:text-primary transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back
                </button>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">Edit Client</Button>
                    <Button onClick={() => navigate('/invoices/new')} variant="primary" size="sm">Create Invoice</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Client Info Card */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="overflow-hidden border-none shadow-2xl">
                        <div className="h-32 bg-gradient-to-br from-secondary via-secondary/80 to-primary/20 relative">
                            <div className="absolute inset-0 mesh-gradient opacity-30" />
                        </div>
                        <CardContent className="p-8 pt-0 flex flex-col items-center text-center relative">
                            <div className="w-24 h-24 rounded-full bg-white text-secondary text-3xl flex items-center justify-center font-black -mt-12 mb-4 shadow-2xl ring-4 ring-white relative z-10 transition-transform hover:scale-105 duration-500">
                                {client.name.charAt(0)}
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{client.name}</h3>
                            <p className="text-slate-500 font-medium mb-4">{client.company}</p>
                            <Badge variant={client.status === 'Active' ? 'success' : 'default'} className="mb-6 px-4 py-1 uppercase tracking-widest text-[10px] font-black">
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

                    <Card className="relative overflow-hidden border-none shadow-2xl bg-[#0A0A0C] text-white group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full -translate-y-16 translate-x-16 blur-3xl group-hover:bg-secondary/40 transition-colors duration-700" />
                        <CardContent className="p-8 relative z-10">
                            <div className="space-y-8">
                                <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-md transition-all hover:bg-white/[0.07]">
                                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Portfolio Value</p>
                                    <h4 className="text-4xl font-black tracking-tighter text-white">${totalSpent.toLocaleString()}</h4>
                                </div>
                                <div className="p-6 bg-red-600/5 rounded-[2rem] border border-red-600/10 backdrop-blur-md transition-all hover:bg-red-600/[0.08]">
                                    <p className="text-red-400/80 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Active Receivables</p>
                                    <h4 className="text-4xl font-black tracking-tighter text-white">${pendingAmount.toLocaleString()}</h4>
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
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {clientInvoices.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-gray-500 py-8">No invoices found for this client.</TableCell>
                                        </TableRow>
                                    ) : (
                                        clientInvoices.map((inv) => (
                                            <TableRow key={inv.id}>
                                                <TableCell className="font-semibold text-secondary">{inv.id}</TableCell>
                                                <TableCell className="text-gray-500">{inv.date}</TableCell>
                                                <TableCell className="font-medium">${inv.amount.toLocaleString()}</TableCell>
                                                <TableCell>
                                                    <Badge variant={inv.status === 'Paid' ? 'success' : inv.status === 'Pending' ? 'warning' : 'danger'}>
                                                        {inv.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
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
                                { (client.history || []).map((event) => (
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
