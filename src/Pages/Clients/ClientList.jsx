import React, { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, Eye, Edit2, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../Components/UI/Card';
import { Button } from '../../Components/UI/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../Components/UI/Table';
import { Badge } from '../../Components/UI/Badge';

const ClientList = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const clients = [
        { id: 1, name: 'John Doe', email: 'john@example.com', company: 'Acme Corp', status: 'Active', phone: '+1 234 567 890' },
        { id: 2, name: 'Sarah Wilson', email: 'sarah@globaltech.com', company: 'Global Tech', status: 'Active', phone: '+1 987 654 321' },
        { id: 3, name: 'Michael Brown', email: 'm.brown@nexus.com', company: 'Nexus Ltd', status: 'Inactive', phone: '+1 555 123 456' },
        { id: 4, name: 'Emily Davis', email: 'emily@brightstar.io', company: 'Bright Star', status: 'Active', phone: '+1 444 987 654' },
        { id: 5, name: 'David Miller', email: 'david@skynet.com', company: 'Sky Net', status: 'Active', phone: '+1 777 333 222' },
    ];

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Clients Management</h2>
                    <p className="text-gray-500">View and manage your client database and history.</p>
                </div>
                <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add New Client
                </Button>
            </div>

            <Card>
                <CardHeader className="border-b-0 pb-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search by name, email or company..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                Filters
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Client Name</TableHead>
                                <TableHead>Company</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredClients.map((client) => (
                                <TableRow key={client.id}>
                                    <TableCell>
                                        <div className="font-semibold text-gray-900">{client.name}</div>
                                    </TableCell>
                                    <TableCell>{client.company}</TableCell>
                                    <TableCell className="text-gray-500">{client.email}</TableCell>
                                    <TableCell className="text-gray-500">{client.phone}</TableCell>
                                    <TableCell>
                                        <Badge variant={client.status === 'Active' ? 'success' : 'default'}>
                                            {client.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-secondary">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-blue-600">
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
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

export default ClientList;
