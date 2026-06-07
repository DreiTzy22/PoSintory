import "../css/app.css";
import "./bootstrap";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import POS from "./pages/POS";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";
import Purchasing from "./pages/Purchasing";
import Support from "./pages/Support";
import SuperAdminTenants from "./pages/SuperAdminTenants";
import SuperAdminTickets from "./pages/SuperAdminTickets";
import SystemHealth from "./pages/SystemHealth";
import Sales from "./pages/Sales";
import Reports from "./pages/Reports";
import Customers from "./pages/Customers";
import Suppliers from "./pages/Suppliers";
import UsersAndRoles from "./pages/UsersAndRoles";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/not-found" element={<NotFound />} />
                    
                    {/* Common Routes */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />

                    {/* Tenant Admin / Staff Routes */}
                    <Route path="/pos" element={<ProtectedRoute allowedRoles={['tenant_admin', 'staff', 'cashier']}><POS /></ProtectedRoute>} />
                    <Route path="/products" element={<ProtectedRoute allowedRoles={['tenant_admin', 'staff']}><Products /></ProtectedRoute>} />
                    <Route path="/inventory" element={<ProtectedRoute allowedRoles={['tenant_admin', 'staff']}><Inventory /></ProtectedRoute>} />
                    <Route path="/purchasing" element={<ProtectedRoute allowedRoles={['tenant_admin', 'staff']}><Purchasing /></ProtectedRoute>} />
                    <Route path="/sales" element={<ProtectedRoute allowedRoles={['tenant_admin', 'staff']}><Sales /></ProtectedRoute>} />
                    <Route path="/reports" element={<ProtectedRoute allowedRoles={['tenant_admin', 'staff']}><Reports /></ProtectedRoute>} />
                    <Route path="/customers" element={<ProtectedRoute allowedRoles={['tenant_admin', 'staff']}><Customers /></ProtectedRoute>} />
                    <Route path="/suppliers" element={<ProtectedRoute allowedRoles={['tenant_admin', 'staff']}><Suppliers /></ProtectedRoute>} />
                    <Route path="/support" element={<ProtectedRoute allowedRoles={['tenant_admin', 'staff', 'cashier']}><Support /></ProtectedRoute>} />
                    <Route path="/users" element={<ProtectedRoute allowedRoles={['tenant_admin']}><UsersAndRoles /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute allowedRoles={['tenant_admin']}><Settings /></ProtectedRoute>} />

                    {/* Super Admin Routes */}
                    <Route path="/admin/tenants" element={<ProtectedRoute allowedRoles={['super_admin']}><SuperAdminTenants /></ProtectedRoute>} />
                    <Route path="/admin/tickets" element={<ProtectedRoute allowedRoles={['super_admin']}><SuperAdminTickets /></ProtectedRoute>} />
                    <Route path="/admin/health" element={<ProtectedRoute allowedRoles={['super_admin']}><SystemHealth /></ProtectedRoute>} />

                    {/* Fallback */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
};

const root = createRoot(document.getElementById("app"));
root.render(<App />);
