import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api as insforge } from '../lib/api';

const CRMContext = createContext();

export const CRMProvider = ({ children }) => {
    const [clients, setClients] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [brands, setBrands] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    const [gateways, setGateways] = useState({
        stripe1: { enabled: true, name: 'Stripe Business', pubKey: '' },
        stripe2: { enabled: false, name: 'Stripe Personal', pubKey: '' },
        paypal: { enabled: true, name: 'PayPal Official', email: '' }
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [clientsRes, brandsRes, invoicesRes, configsRes, activitiesRes] = await Promise.all([
                insforge.database.from('clients').select('*'),
                insforge.database.from('brands').select('*'),
                insforge.database.from('invoices').select('*, clients!client_id(*), brands!brand_id(*), invoice_items(*)'),
                insforge.database.from('configurations').select('*'),
                insforge.database.from('activities').select('*')
            ]);

            if (clientsRes.error) throw clientsRes.error;
            if (brandsRes.error) throw brandsRes.error;
            if (invoicesRes.error) throw invoicesRes.error;
            if (configsRes.error) throw configsRes.error;
            if (activitiesRes.error) throw activitiesRes.error;

            setClients(clientsRes.data || []);
            setBrands(brandsRes.data || []);
            setInvoices(invoicesRes.data || []);
            setActivities(activitiesRes.data || []);

            const gatewayConfig = configsRes.data?.find(c => c.key === 'gateways');
            if (gatewayConfig) setGateways(gatewayConfig.value);
        } catch (error) {
            console.error('Fetch Error:', error);
            toast.error('Failed to sync with Backend');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const addActivity = async (activity) => {
        const { data, error } = await insforge.database.from('activities').insert([activity]).select();
        if (!error && data) {
            setActivities(prev => [data[0], ...prev]);
        }
    };

    const addToast = (message, type = 'success') => {
        if (type === 'success') toast.success(message);
        else if (type === 'error') toast.error(message);
        else toast(message);
    };

    const addClient = async (client) => {
        const { data, error } = await insforge.database.from('clients').insert([client]).select();
        if (error) {
            toast.error('Failed to add client');
            return null;
        }
        setClients(prev => [...data, ...prev]);
        toast.success('Client added successfully');
        return data[0];
    };

    const updateClient = async (id, updatedData) => {
        const { data, error } = await insforge.database.from('clients').update(updatedData).match({ id }).select();
        if (error) {
            toast.error('Update failed');
            return;
        }
        setClients(prev => prev.map(c => String(c.id) === String(id) ? data[0] : c));
        toast.success('Client updated');
    };

    const deleteClient = async (id) => {
        const { error } = await insforge.database.from('clients').delete().match({ id });
        if (error) {
            toast.error('Delete failed');
            return;
        }
        setClients(prev => prev.filter(c => String(c.id) !== String(id)));
        toast.success('Client removed');
    };

    const addBrand = async (brand) => {
        const { data, error } = await insforge.database.from('brands').insert([brand]).select();
        if (error) {
            toast.error('Failed to add brand');
            return null;
        }
        setBrands(prev => [...prev, ...data]);
        toast.success('Brand added successfully');
        return data[0];
    };

    const updateBrand = async (id, updatedData) => {
        const { data, error } = await insforge.database.from('brands').update(updatedData).match({ id }).select();
        if (error) {
            toast.error('Update failed');
            return;
        }
        setBrands(prev => prev.map(b => String(b.id) === String(id) ? data[0] : b));
        toast.success('Brand updated');
    };

    const deleteBrand = async (id) => {
        const { error } = await insforge.database.from('brands').delete().match({ id });
        if (error) {
            toast.error('Delete failed');
            return;
        }
        setBrands(prev => prev.filter(b => String(b.id) !== String(id)));
        toast.success('Brand deleted');
    };

    const updateGateways = async (newGateways) => {
        setGateways(newGateways);
        const { error } = await insforge.database.from('configurations').update({ value: newGateways }).match({ key: 'gateways' });
        if (error) {
            console.error('Failed to save configuration:', error);
            toast.error('Settings sync failed');
        } else {
            addToast('Payment gateways updated on backend');
        }
    };

    const addInvoice = async (invoice) => {
        const { items: invoiceItems, allowedGateways, clientId, ...rest } = invoice;

        // Map fields to DB names and remove frontend-only props
        const invoiceData = {
            ...rest,
            client_id: clientId,
            issue_date: invoice.issue_date,
            due_date: invoice.due_date,
            notes: invoice.notes,
            status: 'Pending'
        };

        // 1. Create Invoice Header
        const { data: invData, error: invError } = await insforge.database.from('invoices').insert([invoiceData]).select();

        if (invError) {
            console.error('Invoice Header Error:', invError);
            toast.error('Failed to create invoice header');
            return null;
        }

        const newInvId = invData[0].id;

        // 2. Create Invoice Items
        if (invoiceItems && invoiceItems.length > 0) {
            const itemsToInsert = invoiceItems.map(item => ({
                ...item,
                invoice_id: newInvId
            }));
            const { error: itemsError } = await insforge.database.from('invoice_items').insert(itemsToInsert);
            if (itemsError) console.error('Items error:', itemsError);
        }

        fetchData(); // Refresh all to get joined data
        toast.success('Invoice recorded on Backend');
        return invData[0];
    };

    const updateInvoiceStatus = async (invoiceId, status, paymentMethod = null) => {
        setInvoices(prev => prev.map(inv =>
            String(inv.id) === String(invoiceId) ? {
                ...inv,
                status,
                paidAt: status === 'Paid' ? new Date().toISOString() : inv.paidAt,
                paymentMethod: paymentMethod || inv.paymentMethod
            } : inv
        ));

        // Persist to Backend
        const updateData = {
            status,
            payment_method: paymentMethod
        };
        if (status === 'Paid') updateData.paid_at = new Date().toISOString();

        const { error } = await insforge.database.from('invoices').update(updateData).match({ id: invoiceId });
        if (error) {
            console.error('Update Status Error:', error);
            toast.error('Sync failed');
        } else {
            // Add to activity log if paid
            if (status === 'Paid') {
                const invoice = invoices.find(inv => String(inv.id) === String(invoiceId));
                const client = clients.find(c => String(c.id) === String(invoice?.client_id || invoice?.clientId));
                if (client) {
                    const newActivity = {
                        type: 'payment',
                        title: `Payment Received - ${invoiceId}`,
                        description: `Client ${client.name} paid ${invoice.total || invoice.amount} via ${paymentMethod || 'Manual'}`,
                        status: 'success'
                    };
                    addActivity(newActivity);
                }
                addToast(`Invoice ${invoiceId} marked as Paid!`, 'success');
            } else {
                addToast(`Invoice status updated to ${status}`);
            }
        }
    };

    const getDashboardStats = () => {
        const now = new Date();
        const thisMonth = now.getMonth();
        const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;

        // Revenue Stats
        const totalRevenue = invoices.reduce((acc, inv) => acc + (inv.status === 'Paid' ? Number(inv.total || 0) : 0), 0);
        const thisMonthRevenue = invoices
            .filter(inv => inv.status === 'Paid' && new Date(inv.created_at).getMonth() === thisMonth)
            .reduce((acc, inv) => acc + Number(inv.total || 0), 0);
        const lastMonthRevenue = invoices
            .filter(inv => inv.status === 'Paid' && new Date(inv.created_at).getMonth() === lastMonth)
            .reduce((acc, inv) => acc + Number(inv.total || 0), 0);

        const revTrend = lastMonthRevenue === 0 ? 100 : Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100);

        // Client Stats
        const totalClients = clients.length;
        const pendingClients = [...new Set(invoices
            .filter(inv => inv.status === 'Pending' || inv.status === 'Overdue' || inv.status === 'draft')
            .map(inv => String(inv.client_id || inv.clientId))
        )].length;

        const lastMonthPendingClients = [...new Set(invoices
            .filter(inv => (inv.status === 'Pending' || inv.status === 'Overdue' || inv.status === 'draft') && new Date(inv.created_at).getMonth() === lastMonth)
            .map(inv => String(inv.client_id || inv.clientId))
        )].length;

        const clientTrend = lastMonthPendingClients === 0 ? pendingClients * 10 : Math.round(((pendingClients - lastMonthPendingClients) / lastMonthPendingClients) * 100);

        // Pending Stats
        const pendingAmount = invoices.reduce((acc, inv) => acc + (inv.status === 'Pending' || inv.status === 'Overdue' || inv.status === 'draft' ? Number(inv.total || 0) : 0), 0);
        const lastMonthPendingAmount = invoices
            .filter(inv => (inv.status === 'Pending' || inv.status === 'Overdue' || inv.status === 'draft') && new Date(inv.created_at).getMonth() === lastMonth)
            .reduce((acc, inv) => acc + Number(inv.total || 0), 0);
        const pendingTrend = lastMonthPendingAmount === 0 ? 0 : Math.round(((pendingAmount - lastMonthPendingAmount) / lastMonthPendingAmount) * 100);

        const paidInvoicesCount = invoices.filter(inv => inv.status === 'Paid').length;
        const lastMonthPaidCount = invoices.filter(inv => inv.status === 'Paid' && new Date(inv.created_at).getMonth() === lastMonth).length;
        const paidTrend = lastMonthPaidCount === 0 ? 0 : Math.round(((paidInvoicesCount - lastMonthPaidCount) / lastMonthPaidCount) * 100);

        // Dynamic 6-Month Revenue
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyRevenue = Array.from({ length: 6 }).map((_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - (5 - i));
            const m = d.getMonth();
            const y = d.getFullYear();
            return {
                name: monthNames[m],
                revenue: invoices
                    .filter(inv => inv.status === 'Paid' && new Date(inv.created_at).getMonth() === m && new Date(inv.created_at).getFullYear() === y)
                    .reduce((acc, inv) => acc + Number(inv.total || 0), 0)
            };
        });

        const statusData = [
            { name: 'Paid', value: invoices.filter(i => i.status === 'Paid').reduce((a, b) => a + Number(b.total || 0), 0), color: '#10b981' },
            { name: 'Pending', value: (invoices.filter(i => i.status === 'Pending') || []).reduce((a, b) => a + Number(b.total || 0), 0), color: '#f59e0b' },
            { name: 'Overdue', value: (invoices.filter(i => i.status === 'Overdue') || []).reduce((a, b) => a + Number(b.total || 0), 0), color: '#CA1D2A' },
        ];

        return {
            totalRevenue,
            pendingAmount,
            totalClients,
            pendingClientsCount: pendingClients,
            paidInvoicesCount,
            monthlyRevenue,
            statusData,
            trends: {
                revenue: revTrend,
                clients: clientTrend,
                paid: paidTrend,
                pending: pendingTrend
            }
        };
    };

    return (
        <CRMContext.Provider value={{
            clients,
            invoices,
            addClient,
            updateClient,
            deleteClient,
            brands,
            addBrand,
            updateBrand,
            deleteBrand,
            gateways,
            updateGateways,
            addInvoice,
            updateInvoiceStatus,
            getDashboardStats,
            activities,
            addActivity
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
