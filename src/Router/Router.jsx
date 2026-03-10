import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from '../Page'
import { MainLayout } from '../Components/Layout/MainLayout'
import ClientList from '../Pages/Clients/ClientList'
import ClientDetails from '../Pages/Clients/ClientDetails'
import InvoiceList from '../Pages/Invoices/InvoiceList'
import CreateInvoice from '../Pages/Invoices/CreateInvoice'

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='/clients' element={<ClientList />} />
          <Route path='/clients/:id' element={<ClientDetails />} />
          <Route path='/invoices' element={<InvoiceList />} />
          <Route path='/invoices/new' element={<CreateInvoice />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router