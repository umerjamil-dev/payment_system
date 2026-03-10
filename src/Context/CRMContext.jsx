import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CRMContext = createContext();

export const CRMProvider = ({ children }) => {
    const [clients, setClients] = useState(() => {
        const saved = localStorage.getItem('nexus_clients');
        return saved ? JSON.parse(saved) : [
            {
                id: '1', name: 'John Doe', email: 'john@example.com', company: 'Acme Corp', status: 'Active', phone: '+1 234 567 890', joinedDate: 'Jan 15, 2023', address: '123 Business Ave, New York, NY 10001', history: [
                    { id: 1, action: 'Invoice Generated', target: 'INV-001', date: 'Oct 24, 2023 10:30 AM' },
                ]
            },
        ];
    });

    const [invoices, setInvoices] = useState(() => {
        const saved = localStorage.getItem('nexus_invoices');
        return saved ? JSON.parse(saved) : [
            { id: 'INV-001', clientId: '1', clientName: 'Acme Corp', amount: 2500, status: 'Paid', date: '2023-10-24', dueDate: '2023-11-24' },
        ];
    });

    useEffect(() => {
        localStorage.setItem('nexus_clients', JSON.stringify(clients));
    }, [clients]);

    useEffect(() => {
        localStorage.setItem('nexus_invoices', JSON.stringify(invoices));
    }, [invoices]);

    const addToast = (message, type = 'success') => {
        if (type === 'success') toast.success(message);
        else if (type === 'error') toast.error(message);
        else toast(message);
    };

    const addClient = (client) => {
        const newClient = {
            ...client,
            id: Date.now().toString(),
            joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            history: [{ id: Date.now(), action: 'Profile Created', target: 'System', date: new Date().toLocaleString() }],
            status: 'Active'
        };
        setClients((prev) => [newClient, ...prev]);
        addToast('Client added successfully');
        return newClient;
    };

    const updateClient = (id, updatedData) => {
        setClients((prev) => prev.map(c => c.id === id ? { ...c, ...updatedData } : c));
        addToast('Client updated');
    };

    const deleteClient = (id) => {
        setClients((prev) => prev.filter(c => c.id !== id));
        addToast('Client deleted', 'error');
    };

    const addInvoice = (invoice) => {
        const newInvoice = {
            ...invoice,
            id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
            status: 'Pending',
            date: new Date().toISOString().split('T')[0]
        };
        setInvoices((prev) => [newInvoice, ...prev]);

        // Add to client history
        setClients((prev) => prev.map(c =>
            c.id === invoice.clientId
                ? { ...c, history: [{ id: Date.now(), action: 'Invoice Generated', target: newInvoice.id, date: new Date().toLocaleString() }, ...c.history] }
                : c
        ));

        addToast('Invoice created successfully');
        return newInvoice;
    };

    const updateInvoiceStatus = (invoiceId, status, paymentMethod = null) => {
        setInvoices(prev => prev.map(inv =>
            inv.id === invoiceId ? {
                ...inv,
                status,
                paidAt: status === 'Paid' ? new Date().toISOString() : inv.paidAt,
                paymentMethod: paymentMethod || inv.paymentMethod
            } : inv
        ));

        // Add to activity log if paid
        if (status === 'Paid') {
            const invoice = invoices.find(inv => inv.id === invoiceId);
            const client = clients.find(c => c.id === invoice?.clientId);
            if (client) {
                const newActivity = {
                    id: Date.now(),
                    type: 'payment',
                    title: `Payment Received - ${invoiceId}`,
                    description: `Client ${client.name} paid ${invoice.amount} via ${paymentMethod || 'Manual'}`,
                    date: 'Just now',
                    status: 'success'
                };
                // In a real app, we'd update a separate activities state
                console.log('Activity Logged:', newActivity);
            }
            addToast(`Invoice ${invoiceId} marked as Paid!`, 'success');
        }
    };


    const getDashboardStats = () => {
        const totalRevenue = invoices.reduce((acc, inv) => acc + (inv.status === 'Paid' ? inv.amount : 0), 0);
        const pendingAmount = invoices.reduce((acc, inv) => acc + (inv.status === 'Pending' || inv.status === 'Overdue' ? inv.amount : 0), 0);
        const totalClients = clients.length;
        const paidInvoicesCount = invoices.filter(inv => inv.status === 'Paid').length;

        // Monthly revenue for chart (simplified)
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyRevenue = monthNames.map(month => ({
            name: month,
            revenue: invoices
                .filter(inv => inv.status === 'Paid' && monthNames[new Date(inv.date).getMonth()] === month)
                .reduce((acc, inv) => acc + inv.amount, 0)
        }));

        const statusData = [
            { name: 'Paid', value: invoices.filter(i => i.status === 'Paid').reduce((a, b) => a + b.amount, 0), color: '#10b981' },
            { name: 'Pending', value: invoices.filter(i => i.status === 'Pending').reduce((a, b) => a + b.amount, 0), color: '#f59e0b' },
            { name: 'Overdue', value: invoices.filter(i => i.status === 'Overdue').reduce((a, b) => a + b.amount, 0), color: '#CA1D2A' },
        ];

        return { totalRevenue, pendingAmount, totalClients, paidInvoicesCount, monthlyRevenue, statusData };
    };

    return (
        <CRMContext.Provider value={{
            clients,
            invoices,
            addClient,
            updateClient,
            deleteClient,
            addInvoice,
            updateInvoiceStatus,
            getDashboardStats
        }}>
            {children}
        </CRMContext.Provider>
    );
};

export const useCRM = () => {
    const context = useContext(CRMContext);
    if (!context) throw new Error('useCRM must be used within a CRMProvider');
    return context;
};
