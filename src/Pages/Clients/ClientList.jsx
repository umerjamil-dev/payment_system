import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit2, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../Components/UI/Card';
import { Button } from '../../Components/UI/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../Components/UI/Table';
import { Badge } from '../../Components/UI/Badge';
import { useCRM } from '../../Context/CRMContext';
import { ClientModal } from '../../Components/Clients/ClientModal';
import { useNavigate } from 'react-router-dom';

const ClientList = () => {
    const { clients, addClient, updateClient, deleteClient } = useCRM();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const navigate = useNavigate();

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSaveClient = (data) => {
        if (editingClient) {
            updateClient(editingClient.id, data);
        } else {
            addClient(data);
        }
        setIsModalOpen(false);
    };

    const handleEdit = (client) => {
        setEditingClient(client);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingClient(null);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Clients Management</h2>
                    <p className="text-gray-500">View and manage your client database and history.</p>
                </div>
                <Button onClick={handleAddNew} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add New Client
                </Button>
            </div>

            <Card>
                <CardHeader className="border-b-0 pb-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
                        <div className="relative flex-1 max-w-md text-black">
                            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search by name, email or company..."
                                className=" text-black w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
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
                <CardContent className="p-0 overflow-x-auto">
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
                                            <Button onClick={() => navigate(`/clients/${client.id}`)} variant="ghost" size="icon" className="text-gray-400 hover:text-secondary">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button onClick={() => handleEdit(client)} variant="ghost" size="icon" className="text-gray-400 hover:text-blue-600">
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button onClick={() => deleteClient(client.id)} variant="ghost" size="icon" className="text-gray-400 hover:text-primary">
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

            <ClientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveClient}
                client={editingClient}
            />
        </div>
    );
};

export default ClientList;
