import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCRM } from '../../Context/CRMContext';
import toast from 'react-hot-toast';
import { StripeModal } from '../../Components/Payments/StripeModal';
import { PayPalModal } from '../../Components/Payments/PayPalModal';
import {
  Download, CheckCircle2, AlertCircle,
  ShieldCheck, Mail, Building2, Calendar,
  CreditCard, Lock, ArrowRight,
  BadgeCheck, Printer, Sparkles, Check
} from 'lucide-react';

/* ─── Inject styles once ─────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

  .inv-root * { box-sizing: border-box; }

  .inv-root {
    --ink: #0D0D12;
    --ink-2: #3A3A4A;
    --ink-3: #7A7A8C;
    --ink-4: #B8B8C8;
    --surface: #FFFFFF;
    --surface-2: #F7F7FA;
    --surface-3: #EFEFF5;
    --accent: #5B4FE9;
    --accent-2: #8B7FF5;
    --accent-glow: rgba(91,79,233,.18);
    --success: #10B97B;
    --danger: #EF4444;
    --border: rgba(0,0,0,.07);
    --border-soft: rgba(0,0,0,.04);
    --shadow-sm: 0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04);
    --shadow-md: 0 4px 16px rgba(0,0,0,.08), 0 2px 6px rgba(0,0,0,.04);
    --shadow-lg: 0 20px 60px rgba(0,0,0,.1), 0 8px 24px rgba(0,0,0,.06);
    --shadow-xl: 0 40px 100px rgba(0,0,0,.12), 0 16px 40px rgba(0,0,0,.08);
    --r-sm: 10px;
    --r-md: 16px;
    --r-lg: 24px;
    --r-xl: 32px;
    font-family: 'DM Sans', sans-serif;
    background: #F2F2F8;
    min-height: 100vh;
    color: var(--ink);
  }

  /* ── Heading font ── */
  .serif { font-family: 'DM Serif Display', serif; }

  /* ── Page wrapper ── */
  .inv-page {
    padding: 48px 20px 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  /* ── Top action bar ── */
  .inv-topbar {
    width: 100%;
    max-width: 860px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .inv-topbar-brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .inv-topbar-logo {
    width: 36px; height: 36px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 14px; color: #fff;
    box-shadow: var(--shadow-sm);
  }
  .inv-topbar-name {
    font-size: 15px;
    font-weight: 600;
    color: var(--ink);
    letter-spacing: -.3px;
  }
  .inv-topbar-actions { display: flex; gap: 10px; }

  .inv-btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 18px;
    border-radius: var(--r-sm);
    font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all .2s;
    border: none;
  }
  .inv-btn-ghost {
    background: rgba(255,255,255,.8);
    color: var(--ink-2);
    border: 1px solid var(--border);
    backdrop-filter: blur(10px);
  }
  .inv-btn-ghost:hover { background: #fff; box-shadow: var(--shadow-sm); }
  .inv-btn-dark {
    background: var(--ink);
    color: #fff;
  }
  .inv-btn-dark:hover { background: #1a1a28; box-shadow: var(--shadow-md); }
  .inv-btn-accent {
    background: var(--accent);
    color: #fff;
    box-shadow: 0 4px 14px var(--accent-glow);
  }
  .inv-btn-accent:hover { background: #4A3ED8; box-shadow: 0 6px 20px var(--accent-glow); transform: translateY(-1px); }

  /* ── Card ── */
  .inv-card {
    width: 100%;
    max-width: 860px;
    background: var(--surface);
    border-radius: var(--r-xl);
    box-shadow: var(--shadow-xl);
    overflow: hidden;
  }

  /* ── Header band ── */
  .inv-header {
    padding: 48px 52px 40px;
    background: var(--ink);
    color: #fff;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 32px;
    align-items: start;
    position: relative;
    overflow: hidden;
  }
  .inv-header::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 70% 120% at 100% -20%, rgba(91,79,233,.35) 0%, transparent 65%),
                radial-gradient(ellipse 50% 80% at -10% 110%, rgba(91,79,233,.15) 0%, transparent 60%);
    pointer-events: none;
  }
  .inv-header-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(255,255,255,.08);
    border: 1px solid rgba(255,255,255,.12);
    border-radius: 999px;
    padding: 5px 14px;
    font-size: 11px; font-weight: 600; letter-spacing: .06em;
    text-transform: uppercase; color: rgba(255,255,255,.7);
    margin-bottom: 20px;
  }
  .inv-header-badge span { width: 6px; height: 6px; border-radius: 50%; background: var(--accent-2); }
  .inv-header-title {
    font-size: 13px; font-weight: 500; letter-spacing: .08em;
    text-transform: uppercase; color: rgba(255,255,255,.45);
    margin-bottom: 6px;
  }
  .inv-header-company {
    font-family: 'DM Serif Display', serif;
    font-size: 36px; line-height: 1.1; color: #fff;
    margin-bottom: 24px;
  }
  .inv-header-ids {
    display: flex; gap: 0;
  }
  .inv-header-id-chip {
    padding: 10px 20px;
    background: rgba(255,255,255,.06);
    border: 1px solid rgba(255,255,255,.1);
    display: flex; flex-direction: column; gap: 3px;
  }
  .inv-header-id-chip:first-child { border-radius: 10px 0 0 10px; }
  .inv-header-id-chip:last-child  { border-radius: 0 10px 10px 0; border-left: none; }
  .inv-header-id-label {
    font-size: 9px; font-weight: 700; letter-spacing: .1em;
    text-transform: uppercase; color: rgba(255,255,255,.35);
  }
  .inv-header-id-val {
    font-size: 13px; font-weight: 700; color: rgba(255,255,255,.9);
    font-family: 'DM Mono', monospace;
    letter-spacing: .02em;
  }
  .inv-header-right {
    display: flex; flex-direction: column; align-items: flex-end; gap: 20px;
    position: relative; z-index: 1;
  }
  .inv-qr {
    width: 80px; height: 80px;
    padding: 8px;
    background: rgba(255,255,255,.08);
    border: 1px solid rgba(255,255,255,.12);
    border-radius: 14px;
  }
  .inv-qr img { width: 100%; height: 100%; display: block; }
  .inv-word-invoice {
    font-family: 'DM Serif Display', serif;
    font-size: 52px; line-height: 1;
    letter-spacing: -.02em; text-align: right;
    user-select: none;
  }

  /* ── Status pill ── */
  .inv-status-pill {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 12px; font-weight: 700; letter-spacing: .04em;
    text-transform: uppercase;
  }
  .inv-status-pill.paid   { background: rgba(16,185,123,.12); color: var(--success); }
  .inv-status-pill.unpaid { background: rgba(239,68,68,.1);   color: var(--danger); }
  .inv-status-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; animation: pulse-dot 2s infinite; }
  @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.7)} }

  /* ── Meta grid ── */
  .inv-meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-bottom: 1px solid var(--border);
  }
  .inv-meta-col {
    padding: 36px 52px;
  }
  .inv-meta-col:first-child { border-right: 1px solid var(--border); }
  .inv-label {
    font-size: 10px; font-weight: 700; letter-spacing: .1em;
    text-transform: uppercase; color: var(--ink-3);
    margin-bottom: 6px;
  }
  .inv-value { font-size: 14px; font-weight: 500; color: var(--ink); }
  .inv-meta-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border-soft); }
  .inv-meta-row:last-child { border-bottom: none; }

  .inv-client-name {
    font-family: 'DM Serif Display', serif;
    font-size: 26px; color: var(--ink); margin: 12px 0 6px;
  }
  .inv-client-sub { font-size: 14px; color: var(--ink-3); margin-bottom: 16px; }
  .inv-contact-row {
    display: flex; align-items: center; gap: 8px;
    font-size: 13px; color: var(--ink-2); margin-bottom: 7px;
  }
  .inv-contact-icon {
    width: 28px; height: 28px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    color: var(--ink-3); flex-shrink: 0;
  }

  /* ── Items table ── */
  .inv-table-wrap { overflow-x: auto; }
  table.inv-table { width: 100%; border-collapse: collapse; }
  .inv-table thead tr {
    background: var(--surface-2);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }
  .inv-table th {
    padding: 14px 52px;
    font-size: 10px; font-weight: 700; letter-spacing: .1em;
    text-transform: uppercase; color: var(--ink-3);
    text-align: left;
  }
  .inv-table th.right { text-align: right; }
  .inv-table th.center { text-align: center; }
  .inv-table tbody tr { border-bottom: 1px solid var(--border-soft); transition: background .15s; }
  .inv-table tbody tr:last-child { border-bottom: none; }
  .inv-table tbody tr:hover { background: var(--surface-2); }
  .inv-table td { padding: 22px 52px; vertical-align: middle; }
  .inv-table td.right { text-align: right; }
  .inv-table td.center { text-align: center; }
  .inv-item-name { font-size: 15px; font-weight: 600; color: var(--ink); margin-bottom: 3px; }
  .inv-item-sub  { font-size: 12px; color: var(--ink-4); }
  .inv-item-price, .inv-item-qty { font-size: 14px; font-weight: 500; color: var(--ink-2); }
  .inv-item-total { font-size: 16px; font-weight: 700; color: var(--ink); }

  /* ── Totals band ── */
  .inv-totals-band {
    display: grid;
    grid-template-columns: 1fr 360px;
    border-top: 1px solid var(--border);
    background: var(--surface-2);
  }
  .inv-notes-col {
    padding: 36px 52px;
    border-right: 1px solid var(--border);
  }
  .inv-note-box {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: var(--r-md);
    padding: 20px 22px;
    font-size: 13px; color: var(--ink-2); line-height: 1.7;
    font-style: italic;
  }
  .inv-note-author { margin-top: 12px; font-size: 11px; font-weight: 700; letter-spacing: .05em; color: var(--ink-4); font-style: normal; text-transform: uppercase; }
  .inv-totals-col { padding: 36px 52px; display: flex; flex-direction: column; justify-content: flex-end; }
  .inv-total-row { display: flex; justify-content: space-between; align-items: center; padding: 9px 0; }
  .inv-total-label { font-size: 13px; font-weight: 500; color: var(--ink-3); }
  .inv-total-val   { font-size: 14px; font-weight: 600; color: var(--ink-2); }
  .inv-divider { border: none; border-top: 1px solid var(--border); margin: 8px 0; }
  .inv-grand-row { display: flex; justify-content: space-between; align-items: baseline; margin-top: 4px; }
  .inv-grand-label { font-size: 13px; font-weight: 700; color: var(--accent); letter-spacing: .04em; text-transform: uppercase; }
  .inv-grand-val { font-family: 'DM Serif Display', serif; font-size: 42px; color: var(--ink); letter-spacing: -.02em; line-height: 1; }

  /* ── Payment section ── */
  .inv-payment-section { padding: 52px; border-top: 1px solid var(--border); }
  .inv-payment-header { text-align: center; margin-bottom: 36px; }
  .inv-payment-title { font-family: 'DM Serif Display', serif; font-size: 28px; color: var(--ink); margin-bottom: 8px; }
  .inv-payment-sub { font-size: 13px; color: var(--ink-3); }

  .inv-paid-box {
    max-width: 460px; margin: 0 auto;
    background: linear-gradient(135deg, rgba(16,185,123,.06), rgba(16,185,123,.02));
    border: 1px solid rgba(16,185,123,.2);
    border-radius: var(--r-xl);
    padding: 48px 40px;
    text-align: center;
  }
  .inv-paid-icon {
    width: 72px; height: 72px;
    background: rgba(16,185,123,.1);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px; color: var(--success);
  }
  .inv-paid-title { font-family: 'DM Serif Display', serif; font-size: 26px; color: var(--ink); margin-bottom: 8px; }
  .inv-paid-sub   { font-size: 14px; color: var(--ink-3); margin-bottom: 28px; }

  .inv-gateways {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 14px;
    max-width: 540px; margin: 0 auto;
  }
  .inv-gateway-btn {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 20px;
    border-radius: var(--r-md);
    cursor: pointer; border: none;
    transition: all .22s; position: relative; overflow: hidden;
    font-family: 'DM Sans', sans-serif;
  }
  .inv-gateway-stripe {
    background: linear-gradient(135deg, #635BFF, #4F46E5);
    color: #fff;
    box-shadow: 0 6px 20px rgba(99,91,255,.3);
  }
  .inv-gateway-stripe:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(99,91,255,.4); }
  .inv-gateway-paypal {
    background: linear-gradient(135deg, #003087, #0070E0);
    color: #fff;
    box-shadow: 0 6px 20px rgba(0,112,224,.25);
  }
  .inv-gateway-paypal:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0,112,224,.35); }
  .inv-gateway-left { display: flex; align-items: center; gap: 12px; }
  .inv-gateway-icon { width: 38px; height: 38px; background: rgba(255,255,255,.15); border-radius: 10px; display: flex; align-items: center; justify-content: center; }
  .inv-gateway-method { font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; opacity: .6; margin-bottom: 2px; }
  .inv-gateway-name   { font-size: 16px; font-weight: 700; letter-spacing: -.3px; }
  .inv-gateway-arrow  { opacity: .5; transition: all .2s; }
  .inv-gateway-btn:hover .inv-gateway-arrow { opacity: 1; transform: translateX(3px); }

  .inv-cards-row {
    display: flex; align-items: center; justify-content: center; gap: 20px;
    margin-top: 36px; padding-top: 36px;
    border-top: 1px solid var(--border);
    filter: grayscale(1); opacity: .3;
  }
  .inv-cards-row img { height: 20px; }

  /* ── Footer ── */
  .inv-footer {
    background: var(--ink);
    color: rgba(255,255,255,.55);
    padding: 40px 52px;
    display: grid; grid-template-columns: 1fr 1fr 1fr;
    gap: 32px;
    border-top: 3px solid var(--accent);
  }
  .inv-footer-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .inv-footer-logo-icon { width: 32px; height: 32px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: #fff; }
  .inv-footer-logo-name { font-size: 14px; font-weight: 700; color: #fff; }
  .inv-footer-desc { font-size: 12px; line-height: 1.7; color: rgba(255,255,255,.35); max-width: 180px; }
  .inv-footer-heading { font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: rgba(255,255,255,.25); margin-bottom: 14px; }
  .inv-footer-row { display: flex; align-items: center; gap: 9px; font-size: 12px; margin-bottom: 9px; color: rgba(255,255,255,.5); }
  .inv-footer-icon { width: 26px; height: 26px; background: rgba(255,255,255,.06); border-radius: 7px; display: flex; align-items: center; justify-content: center; }
  .inv-footer-addr { font-size: 12px; line-height: 1.8; }

  /* ── Legal bar ── */
  .inv-legal {
    display: flex; align-items: center; justify-content: center;
    flex-wrap: wrap; gap: 20px;
    padding: 24px; margin-top: 8px;
    font-size: 11px; font-weight: 500; color: var(--ink-4);
    letter-spacing: .04em;
  }
  .inv-legal-badge { display: flex; align-items: center; gap: 5px; }

  /* ── Loading ── */
  .inv-loading {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: #F2F2F8;
  }
  .inv-spinner {
    width: 44px; height: 44px;
    border: 3px solid #E0E0EC;
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin .8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Not found ── */
  .inv-notfound {
    min-height: 100vh; background: #F2F2F8;
    display: flex; align-items: center; justify-content: center; padding: 24px;
  }
  .inv-notfound-card {
    background: #fff; border-radius: var(--r-xl); padding: 64px 56px;
    text-align: center; max-width: 440px;
    box-shadow: var(--shadow-xl);
  }
  .inv-notfound-icon { width: 72px; height: 72px; background: rgba(239,68,68,.08); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; color: var(--danger); }
  .inv-notfound-title { font-family: 'DM Serif Display', serif; font-size: 30px; color: var(--ink); margin-bottom: 12px; }
  .inv-notfound-desc  { font-size: 14px; color: var(--ink-3); line-height: 1.7; margin-bottom: 32px; }

  /* ── Print ── */
  @media print {
    .no-print { display: none !important; }
    .inv-root { background: #fff; }
    .inv-card { box-shadow: none; border-radius: 0; }
  }

  /* ── Responsive ── */
  @media (max-width: 640px) {
    .inv-header { padding: 32px 24px; grid-template-columns: 1fr; }
    .inv-header-right { align-items: flex-start; }
    .inv-meta { grid-template-columns: 1fr; }
    .inv-meta-col { padding: 28px 24px; border-right: none !important; }
    .inv-meta-col + .inv-meta-col { border-top: 1px solid var(--border); }
    .inv-table th, .inv-table td { padding: 16px 24px; }
    .inv-totals-band { grid-template-columns: 1fr; }
    .inv-notes-col { padding: 28px 24px; border-right: none; border-bottom: 1px solid var(--border); }
    .inv-totals-col { padding: 28px 24px; }
    .inv-payment-section { padding: 32px 24px; }
    .inv-footer { grid-template-columns: 1fr; padding: 32px 24px; gap: 24px; }
    .inv-topbar { flex-direction: column; align-items: flex-start; }
  }
`;

function InjectStyles() {
  useEffect(() => {
    if (!document.getElementById('inv-styles')) {
      const el = document.createElement('style');
      el.id = 'inv-styles';
      el.textContent = STYLES;
      document.head.appendChild(el);
    }
    return () => { };
  }, []);
  return null;
}

const ClientPaymentView = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const { invoices, clients, brands, gateways, updateInvoiceStatus } = useCRM();
  const [isStripeOpen, setIsStripeOpen] = useState(false);
  const [isPayPalOpen, setIsPayPalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [invoice, setInvoice] = useState(null);
  const [client, setClient] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      let foundInvoice = invoices.find(inv =>
        inv.id?.toString().toLowerCase() === invoiceId?.trim().toLowerCase() ||
        inv.uuid?.toString().toLowerCase() === invoiceId?.trim().toLowerCase()
      );
      if (foundInvoice) {
        setInvoice(foundInvoice);
        setClient(clients.find(c => c.id === foundInvoice.client_id || c.id === foundInvoice.clientId));
      }
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [invoiceId, invoices, clients]);

  const handlePaymentSuccess = (methodName) => {
    updateInvoiceStatus(invoiceId, 'Paid', methodName);
    toast.success('Payment settled. Thank you for your partnership.');
  };

  const handleDownloadPDF = async () => {
    setPdfLoading(true);
    const element = document.getElementById('ledger-invoice');
    const opt = {
      margin: 0,
      filename: `Invoice-${(1010 + Number(invoice.id))}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    try {
      if (!window.html2pdf) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        document.head.appendChild(script);
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          setTimeout(() => reject(new Error('timeout')), 10000);
        });
      }
      await new Promise(r => setTimeout(r, 500));
      await window.html2pdf().set(opt).from(element).save();
      toast.success('Invoice exported successfully!');
    } catch (err) {
      console.error('PDF Export Error:', err);
      // html2canvas fails on oklch colors. Fallback to native print.
      toast.error('Direct PDF export failed. Opening print dialog instead.');
      setTimeout(() => window.print(), 1000);
    } finally {
      setPdfLoading(false);
    }
  };

  const brand = brands?.find(b => b.id === invoice?.brand_id || b.id === invoice?.brandId) || brands?.[0] || { name: 'Nexus', color: '#5B4FE9' };

  /* ─── Loading ─────────────────────────────────────────────────────────── */
  if (isLoading) return (
    <div className="inv-root">
      <InjectStyles />
      <div className="inv-loading">
        <div className="inv-spinner" />
      </div>
    </div>
  );

  /* ─── Not found ────────────────────────────────────────────────────────── */
  if (!invoice) return (
    <div className="inv-root">
      <InjectStyles />
      <div className="inv-notfound">
        <div className="inv-notfound-card">
          <div className="inv-notfound-icon"><AlertCircle size={32} /></div>
          <h2 className="inv-notfound-title">Invoice Not Found</h2>
          <p className="inv-notfound-desc">
            This invoice could not be located. It may have been archived or the link may be incorrect.
          </p>
          {/* <button className="inv-btn inv-btn-dark" style={{ width: '100%', justifyContent: 'center', padding: '14px' }} onClick={() => navigate('/')}>
            Return Home
          </button> */}
        </div>
      </div>
    </div>
  );

  const isPaid = invoice.status === 'Paid';
  const total = invoice.total || invoice.amount;
  const invNum = `#${(1010 + Number(invoice.id))}`;
  const acctId = `ACT-${invoice.id.toString().split('-')[1]?.toUpperCase() || '74632'}`;
  const issueDate = new Date(invoice.issue_date || invoice.created_at || invoice.date).toLocaleDateString(undefined, { dateStyle: 'long' });
  const dueDate = new Date(invoice.due_date || (new Date(invoice.created_at || invoice.date).getTime() + 7 * 24 * 60 * 60 * 1000)).toLocaleDateString(undefined, { dateStyle: 'long' });
  const items = invoice.invoice_items || invoice.items || [];

  let parsedGateways = null;
  if (invoice?.allowedGateways) {
    try {
      parsedGateways = typeof invoice.allowedGateways === 'string' ? JSON.parse(invoice.allowedGateways) : invoice.allowedGateways;
    } catch (e) {
      console.warn('Could not parse allowedGateways', e);
    }
  }

  const isStripeActive = gateways?.stripe1?.enabled && (!parsedGateways || parsedGateways?.stripe1 || parsedGateways?.stripe2);
  const isPayPalActive = gateways?.paypal?.enabled && (!parsedGateways || parsedGateways?.paypal);

  let paymentMethodDisplay = 'Bank Transfer / Manual';
  if (isStripeActive && isPayPalActive) paymentMethodDisplay = 'Credit Card / PayPal';
  else if (isStripeActive) paymentMethodDisplay = 'Credit Card (Stripe)';
  else if (isPayPalActive) paymentMethodDisplay = 'PayPal';

  const finalPaymentMethod = isPaid 
    ? (invoice.paymentMethod || invoice.payment_method || invoice.payment_mode || 'Card / Online') 
    : paymentMethodDisplay;

  return (
    <div className="inv-root">
      <InjectStyles />
      <div className="inv-page">

        {/* ── Top Bar ── */}
        <div className="inv-topbar no-print">
          <div className="inv-topbar-brand">
            <div className="inv-topbar-logo" style={{ background: brand.color }}>
              {brand.logo
                ? <img src={brand.logo} alt={brand.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                : brand.name.charAt(0)
              }
            </div>
            <span className="inv-topbar-name">{brand.name}</span>
          </div>
          <div className="inv-topbar-actions">
            <button className="inv-btn inv-btn-ghost" onClick={() => window.print()}>
              <Printer size={14} /> Print
            </button>

          </div>
        </div>

        {/* ── Invoice Card ── */}
        <div className="inv-card" id="ledger-invoice">

          {/* ── Header ── */}
          <div className="inv-header">
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="inv-header-badge">
                <span />{brand.name} invoice
              </div>
              <p className="inv-header-title">Issued To</p>
              <div className="inv-header-company">{client?.name || 'Valued Partner'}</div>
              <div className="inv-header-ids">
                <div className="inv-header-id-chip">
                  <span className="inv-header-id-label">Invoice No</span>
                  <span className="inv-header-id-val">{invNum.substring(1)}</span>
                </div>
                <div className="inv-header-id-chip">
                  <span className="inv-header-id-label">Account ID</span>
                  <span className="inv-header-id-val">{acctId}</span>
                </div>
                <div className="inv-header-id-chip" style={{ borderRadius: '0 10px 10px 0', borderLeft: 'none' }}>
                  <span className="inv-header-id-label">Status</span>
                  <span className="inv-header-id-val">{invoice.status}</span>
                </div>
              </div>
            </div>
            <div className="inv-header-right">
              <div className="inv-word-invoice text-white">INVOICE</div>
              <div className={`inv-status-pill ${isPaid ? 'paid' : 'unpaid'}`} style={{ color: isPaid ? '#10B97B' : '#EF4444' }}>
                <span className="inv-status-dot" />
                {isPaid ? 'Settled' : 'Awaiting Payment'}
              </div>
            </div>

          </div>

          {/* ── Meta info ── */}
          <div className="inv-meta">
            {/* Dates */}
            <div className="inv-meta-col">
              <p className="inv-label" style={{ marginBottom: 16 }}>Payment Details</p>
              <div className="inv-meta-row">
                <span className="inv-label" style={{ margin: 0 }}>Issue Date</span>
                <span className="inv-value">{issueDate}</span>
              </div>
              <div className="inv-meta-row">
                <span className="inv-label" style={{ margin: 0 }}>Due Date</span>
                <span className="inv-value">{dueDate}</span>
              </div>
              <div className="inv-meta-row">
                <span className="inv-label" style={{ margin: 0 }}>Currency</span>
                <span className="inv-value">USD — US Dollar</span>
              </div>
              <div className="inv-meta-row" style={{ marginTop: 12 }}>
                <span className="inv-label" style={{ margin: 0 }}>Payment Method</span>
                <span className="inv-value">{finalPaymentMethod}</span>
              </div>
            </div>

            {/* Client */}
            <div className="inv-meta-col">
              <p className="inv-label">Bill To</p>
              <div className="inv-client-name">{client?.name || 'Valued Partner'}</div>
              <div className="inv-client-sub">{client?.company || 'Organization Partner'}</div>
              {client?.email && (
                <div className="inv-contact-row">
                  <span className="inv-contact-icon"><Mail size={12} /></span>
                  {client.email}
                </div>
              )}
              {client?.phone && (
                <div className="inv-contact-row">
                  <span className="inv-contact-icon"><Building2 size={12} /></span>
                  {client.phone}
                </div>
              )}
            </div>
          </div>

          {/* ── Items Table ── */}
          <div className="inv-table-wrap">
            <table className="inv-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th className="center">Rate</th>
                  <th className="center">Qty</th>
                  <th className="right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="inv-item-name">{item.description}</div>
                      <div className="inv-item-sub">Professional Services</div>
                    </td>
                    <td className="center">
                      <span className="inv-item-price">${Number(item.price).toLocaleString()}</span>
                    </td>
                    <td className="center">
                      <span className="inv-item-qty">{item.quantity}</span>
                    </td>
                    <td className="right">
                      <span className="inv-item-total">${(item.quantity * item.price).toLocaleString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Totals ── */}
          <div className="inv-totals-band">
            <div className="inv-notes-col">
              <p className="inv-label" style={{ marginBottom: 14 }}>Notes</p>
              <div className="inv-note-box">
                {invoice.notes || `Thank you for choosing ${brand.name}. We are committed to excellence in every transaction and partnership we cultivate.`}
                <div className="inv-note-author">— {brand.name} Team</div>
              </div>
            </div>
            <div className="inv-totals-col">
              <div className="inv-total-row">
                <span className="inv-total-label">Subtotal</span>
                <span className="inv-total-val">${Number(total).toLocaleString()}</span>
              </div>
              <div className="inv-total-row">
                <span className="inv-total-label">Tax (VAT 0%)</span>
                <span className="inv-total-val">$0.00</span>
              </div>
              <hr className="inv-divider" />
              <div className="inv-grand-row">
                <span className="inv-grand-label">Total Due</span>
                <span className="inv-grand-val">${Number(total).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* ── Payment Section ── */}
          <div className="inv-payment-section no-print">
            <div className="inv-payment-header">
              <h3 className="inv-payment-title">Complete Your Payment</h3>
              <p className="inv-payment-sub">Choose a secure payment method to settle this invoice instantly.</p>
            </div>

            {isPaid ? (
              <div className="inv-paid-box">
                <div className="inv-paid-icon"><CheckCircle2 size={34} /></div>
                <div className="inv-paid-title">Payment Complete</div>
                <p className="inv-paid-sub">This invoice has been settled and archived.</p>
                <button className="inv-btn inv-btn-accent" onClick={handleDownloadPDF} style={{ margin: '0 auto' }}>
                  <Download size={14} /> Download Receipt
                </button>
              </div>
            ) : (
              <>
                <div className="inv-gateways">
                  {isStripeActive && (
                    <button className="inv-gateway-btn inv-gateway-stripe" onClick={() => setIsStripeOpen(true)}>
                      <div className="inv-gateway-left">
                        <div className="inv-gateway-icon"><CreditCard size={18} color="#fff" /></div>
                        <div style={{ textAlign: 'left' }}>
                          <div className="inv-gateway-method">Pay with Card</div>
                          <div className="inv-gateway-name">Stripe Pay</div>
                        </div>
                      </div>
                      <ArrowRight size={16} className="inv-gateway-arrow" />
                    </button>
                  )}
                  {isPayPalActive && (
                    <button className="inv-gateway-btn inv-gateway-paypal" onClick={() => setIsPayPalOpen(true)}>
                      <div className="inv-gateway-left">
                        <div className="inv-gateway-icon">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" style={{ height: 14, filter: 'brightness(0) invert(1)' }} />
                        </div>
                        <div style={{ textAlign: 'left' }}>
                          <div className="inv-gateway-method">Express Checkout</div>
                          <div className="inv-gateway-name">PayPal</div>
                        </div>
                      </div>
                      <ArrowRight size={16} className="inv-gateway-arrow" />
                    </button>
                  )}
                </div>

                <div className="inv-cards-row">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" />
                </div>
              </>
            )}
          </div>

          {/* ── Footer ── */}
          <footer className="inv-footer">
            <div>
              <div className="inv-footer-logo">
                <div className="inv-footer-logo-icon" style={{ background: brand.color }}>
                  {brand.logo
                    ? <img src={brand.logo} alt={brand.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    : brand.name.charAt(0)
                  }
                </div>
                <span className="inv-footer-logo-name">{brand.name}</span>
              </div>
              <p className="inv-footer-desc">Advanced Business Solutions for Modern Enterprises.</p>
            </div>
            <div>
              <p className="inv-footer-heading">Contact</p>
              <div className="inv-footer-row">
                <span className="inv-footer-icon"><Mail size={11} /></span>
                support@{brand.name.toLowerCase()}.com
              </div>
              <div className="inv-footer-row">
                <span className="inv-footer-icon"><Calendar size={11} /></span>
                Mon–Fri · 9:00–18:00
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p className="inv-footer-heading">Headquarters</p>
              <p className="inv-footer-addr">
                1234 Business Avenue<br />
                Suite 500, Innovation District<br />
                Corporate Tower, United States
              </p>
            </div>
          </footer>
        </div>

        {/* ── Legal Bar ── */}
        <div className="inv-legal">
          <span>&copy; {new Date().getFullYear()} {brand.name} · All Rights Reserved</span>
          <span className="inv-legal-badge"><ShieldCheck size={12} /> PCI Certified</span>
          <span className="inv-legal-badge"><Lock size={12} /> SSL Encrypted</span>
          <span className="inv-legal-badge"><BadgeCheck size={12} /> Fraud Protected</span>
        </div>
      </div>

      <StripeModal
        isOpen={isStripeOpen}
        onClose={() => setIsStripeOpen(false)}
        onPaymentSuccess={() => handlePaymentSuccess('Stripe')}
        amount={total}
        invoiceId={invoice.id}
      />

      <PayPalModal
        isOpen={isPayPalOpen}
        onClose={() => setIsPayPalOpen(false)}
        onPaymentSuccess={() => handlePaymentSuccess('PayPal')}
        amount={total}
        invoiceId={invoice.id}
      />
    </div>
  );
};

export default ClientPaymentView;