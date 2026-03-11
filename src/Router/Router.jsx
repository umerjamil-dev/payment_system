import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { Home } from '../Page'
import { MainLayout } from '../Components/Layout/MainLayout'
import ClientList from '../Pages/Clients/ClientList'
import ClientDetails from '../Pages/Clients/ClientDetails'
import InvoiceList from '../Pages/Invoices/InvoiceList'
import CreateInvoice from '../Pages/Invoices/CreateInvoice'
import ClientPaymentView from '../Pages/Payments/ClientPaymentView'
import LoginPage from '../Pages/Auth/LoginPage'
import BrandList from '../Pages/Brands/BrandList'
import { useAuth } from '../Context/AuthContext'

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/pay/:invoiceId' element={<ClientPaymentView />} />

        <Route path='/' element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }>
          <Route index element={<Home />} />
          <Route path='clients' element={<ClientList />} />
          <Route path='clients/:id' element={<ClientDetails />} />
          <Route path='brands' element={<BrandList />} />
          <Route path='invoices' element={<InvoiceList />} />
          <Route path='invoices/new' element={<CreateInvoice />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router