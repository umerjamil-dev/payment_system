import React from 'react';
import { DollarSign, Users, FileCheck, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../Components/UI/Card';
import { RevenueChart } from './RevenueChart';
import { InvoiceStatusChart } from './InvoiceStatusChart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../Components/UI/Table';
import { Badge } from '../../Components/UI/Badge';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, colorClass }) => (
    <Card>
        <CardContent className="p-6">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <h3 className="text-2xl font-bold mt-1">{value}</h3>
                    <div className="flex items-center mt-2">
                        {trend === 'up' ? (
                            <ArrowUpRight className="w-4 h-4 text-emerald-500 mr-1" />
                        ) : (
                            <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                        )}
                        <span className={trend === 'up' ? 'text-emerald-600 text-sm font-medium' : 'text-red-600 text-sm font-medium'}>
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
    const recentInvoices = [
        { id: 'INV-001', client: 'Acme Corp', amount: '$2,500.00', date: 'Oct 24, 2023', status: 'Paid' },
        { id: 'INV-002', client: 'Global Tech', amount: '$1,200.00', date: 'Oct 23, 2023', status: 'Pending' },
        { id: 'INV-003', client: 'Nexus Ltd', amount: '$4,350.00', date: 'Oct 22, 2023', status: 'Overdue' },
        { id: 'INV-004', client: 'Bright Star', amount: '$850.00', date: 'Oct 21, 2023', status: 'Paid' },
        { id: 'INV-005', client: 'Sky Net', amount: '$1,800.00', date: 'Oct 20, 2023', status: 'Pending' },
    ];

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
                    value="$128,430"
                    icon={DollarSign}
                    trend="up"
                    trendValue="+12.5%"
                    colorClass="bg-secondary"
                />
                <StatCard
                    title="New Clients"
                    value="42"
                    icon={Users}
                    trend="up"
                    trendValue="+18.2%"
                    colorClass="bg-blue-500"
                />
                <StatCard
                    title="Invoices Paid"
                    value="156"
                    icon={FileCheck}
                    trend="up"
                    trendValue="+5.4%"
                    colorClass="bg-emerald-500"
                />
                <StatCard
                    title="Overdue Amount"
                    value="$12,850"
                    icon={AlertCircle}
                    trend="down"
                    trendValue="+2.1%"
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
                        <RevenueChart />
                    </CardContent>
                </Card>

                {/* Invoice Status Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Invoice Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <InvoiceStatusChart />
                    </CardContent>
                </Card>
            </div>

            {/* Recent Invoices Table */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Invoices</CardTitle>
                    <button className="text-primary text-sm font-semibold hover:underline">View All</button>
                </CardHeader>
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
                                <TableCell>{inv.client}</TableCell>
                                <TableCell>{inv.amount}</TableCell>
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
            </Card>
        </div>
    );
};

export default Dashboard;
