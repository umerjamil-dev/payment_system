import React from 'react';
import { DollarSign, Users, FileCheck, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../Components/UI/Card';
import { RevenueChart } from './RevenueChart';
import { InvoiceStatusChart } from './InvoiceStatusChart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../Components/UI/Table';
import { Badge } from '../../Components/UI/Badge';
import { useCRM } from '../../Context/CRMContext';

const StatCard = ({ title, value, icon: Icon, trendValue, colorClass }) => (
    <Card>
        <CardContent className="p-6">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <h3 className="text-2xl font-bold mt-1">{value}</h3>
                    <div className="flex items-center mt-2">
                        <ArrowUpRight className="w-4 h-4 text-emerald-500 mr-1" />
                        <span className="text-emerald-600 text-sm font-medium">
                            {trendValue}
                        </span>
                        <span className="text-gray-400 text-sm ml-1">vs last month</span>
                    </div>
                </div>
                <div className={`p-3 rounded-xl ${colorClass}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </CardContent>
    </Card>
);

const Dashboard = () => {
    const { invoices, getDashboardStats } = useCRM();
    const stats = getDashboardStats();

    const recentInvoices = invoices.slice(0, 5);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
                <p className="text-gray-500">Welcome back, Admin. Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`$${stats.totalRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    trendValue="+12%"
                    colorClass="bg-secondary"
                />
                <StatCard
                    title="Total Clients"
                    value={stats.totalClients}
                    icon={Users}
                    trendValue="+18%"
                    colorClass="bg-blue-500"
                />
                <StatCard
                    title="Invoices Paid"
                    value={stats.paidInvoicesCount}
                    icon={FileCheck}
                    trendValue="+5%"
                    colorClass="bg-emerald-500"
                />
                <StatCard
                    title="Pending Amount"
                    value={`$${stats.pendingAmount.toLocaleString()}`}
                    icon={AlertCircle}
                    trendValue="+2%"
                    colorClass="bg-primary"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Revenue Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RevenueChart data={stats.monthlyRevenue} />
                    </CardContent>
                </Card>

                {/* Invoice Status Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Invoice Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <InvoiceStatusChart data={stats.statusData} />
                    </CardContent>
                </Card>
            </div>

            {/* Recent Invoices Table */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Invoices</CardTitle>
                    <button className="text-primary text-sm font-semibold hover:underline">View All</button>
                </CardHeader>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice #</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentInvoices.map((inv) => (
                                <TableRow key={inv.id}>
                                    <TableCell className="font-semibold text-secondary">{inv.id}</TableCell>
                                    <TableCell>{inv.clientName}</TableCell>
                                    <TableCell>${inv.amount.toLocaleString()}</TableCell>
                                    <TableCell className="text-gray-500">{inv.date}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            inv.status === 'Paid' ? 'success' :
                                                inv.status === 'Pending' ? 'warning' : 'danger'
                                        }>
                                            {inv.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    );
};

export default Dashboard;
