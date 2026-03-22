import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../UI/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../UI/Card';
import { useCRM } from '../../Context/CRMContext';

export const ClientModal = ({ isOpen, onClose, onSave, client }) => {
    const { brands } = useCRM();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        phone: '',
        address: '',
    });

    useEffect(() => {
        if (client) {
            setFormData(client);
        } else {
            setFormData({ name: '', email: '', company: '', phone: '', address: '' });
        }
    }, [client, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <Card className="w-full max-w-lg animate-in zoom-in-95 duration-300">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{client ? 'Edit Client' : 'Add New Client'}</CardTitle>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4 text-black">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                required
                                type="text"
                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <input
                                    required
                                    type="email"
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Phone</label>
                                <input
                                    type="text"
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Brand</label>
                            <select
                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            >
                                <option value="">Select Brand</option>
                                {brands.map((brand) => (
                                    <option key={brand.id} value={brand.name}>
                                        {brand.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Address</label>
                            <textarea
                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none h-20"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                            <Button type="submit">{client ? 'Update Client' : 'Add Client'}</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
