import "../css/app.css";
import "./bootstrap";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import BranchManagerDashboard from "./pages/BranchManagerDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import POS from "./pages/POS";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";
import Purchasing from "./pages/Purchasing";
import Support from "./pages/Support";
import SuperAdminTenants from "./pages/SuperAdminTenants";
import SuperAdminTickets from "./pages/SuperAdminTickets";
import SystemHealth from "./pages/SystemHealth";
import SuperAdminUsers from "./pages/SuperAdminUsers";
import Sales from "./pages/Sales";
import Reports from "./pages/Reports";
import Customers from "./pages/Customers";
import Suppliers from "./pages/Suppliers";
import UsersAndRoles from "./pages/UsersAndRoles";
import Settings from "./pages/Settings";
import Branches from "./pages/Branches";
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
                    
                    {/* Super Admin Routes */}
                    <Route path="/superadmin/dashboard" element={<ProtectedRoute allowedRoles={['super_admin']}><SuperAdminDashboard /></ProtectedRoute>} />
                    <Route path="/superadmin/tenants" element={<ProtectedRoute allowedRoles={['super_admin']}><SuperAdminTenants /></ProtectedRoute>} />
                    <Route path="/superadmin/users" element={<ProtectedRoute allowedRoles={['super_admin']}><SuperAdminUsers /></ProtectedRoute>} />
                    <Route path="/superadmin/tickets" element={<ProtectedRoute allowedRoles={['super_admin']}><SuperAdminTickets /></ProtectedRoute>} />
                    <Route path="/superadmin/health" element={<ProtectedRoute allowedRoles={['super_admin']}><SystemHealth /></ProtectedRoute>} />

                    {/* Tenant Admin / Staff Routes */}
                    <Route path="/tenant/dashboard" element={<ProtectedRoute allowedRoles={['tenant_admin', 'staff']}><Dashboard /></ProtectedRoute>} />
                    <Route path="/tenant/pos" element={<ProtectedRoute allowedRoles={['tenant_admin', 'staff', 'cashier', 'branch_manager']}><POS /></ProtectedRoute>} />
                    <Route path="/tenant/products" element={<ProtectedRoute allowedRoles={['tenant_admin', 'staff', 'branch_manager']}><Products /></ProtectedRoute>} />
                    <Route path="/tenant/inventory" element={<ProtectedRoute allowedRoles={['tenant_admin', 'staff', 'branch_manager']}><Inventory /></ProtectedRoute>} />
                    <Route path="/tenant/purchasing" element={<ProtectedRoute allowedRoles={['tenant_admin', 'staff', 'branch_manager']}><Purchasing /></ProtectedRoute>} />
                    <Route path="/tenant/sales" element={<ProtectedRoute allowedRoles={['tenant_admin', 'staff', 'branch_manager']}><Sales /></ProtectedRoute>} />
                    <Route path="/tenant/reports" element={<ProtectedRoute allowedRoles={['tenant_admin', 'staff', 'branch_manager']}><Reports /></ProtectedRoute>} />
                    <Route path="/tenant/customers" element={<ProtectedRoute allowedRoles={['tenant_admin', 'staff', 'branch_manager']}><Customers /></ProtectedRoute>} />
                    <Route path="/tenant/suppliers" element={<ProtectedRoute allowedRoles={['tenant_admin', 'staff', 'branch_manager']}><Suppliers /></ProtectedRoute>} />
                    <Route path="/tenant/branches" element={<ProtectedRoute allowedRoles={['tenant_admin', 'staff']}><Branches /></ProtectedRoute>} />
                    <Route path="/tenant/support" element={<ProtectedRoute allowedRoles={['tenant_admin', 'staff', 'branch_manager']}><Support /></ProtectedRoute>} />
                    <Route path="/tenant/users" element={<ProtectedRoute allowedRoles={['tenant_admin']}><UsersAndRoles /></ProtectedRoute>} />
                    <Route path="/tenant/settings" element={<ProtectedRoute allowedRoles={['tenant_admin']}><Settings /></ProtectedRoute>} />
                    
                    {/* Branch Manager Routes */}
                    <Route path="/tenant/branchmanager" element={<ProtectedRoute allowedRoles={['branch_manager']}><BranchManagerDashboard /></ProtectedRoute>} />

                    {/* Cashier Routes */}
                    <Route path="/cashier/dashboard" element={<ProtectedRoute allowedRoles={['cashier', 'tenant_admin', 'staff']}><Dashboard /></ProtectedRoute>} />
                    <Route path="/cashier/pos" element={<ProtectedRoute allowedRoles={['cashier', 'tenant_admin', 'staff']}><POS /></ProtectedRoute>} />
                    <Route path="/cashier/support" element={<ProtectedRoute allowedRoles={['cashier', 'tenant_admin', 'staff']}><Support /></ProtectedRoute>} />

                    {/* Legacy Routes (for backward compatibility) */}
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/pos" element={<ProtectedRoute allowedRoles={['tenant_admin', 'staff', 'cashier']}><POS /></ProtectedRoute>} />
                    <Route path="/products" element={<ProtectedRoute allowedRoles={['tenant_admin', 'staff']}><Products /></ProtectedRoute>} />
                    <Route path="/inventory" element={<ProtectedRoute allowedRoles={['tenant_admin', 'staff']}><Inventory /></ProtectedRoute>} />
                    <Route path="/purchasing" element={<ProtectedRoute allowedRoles={['tenant_admin', 'staff']}><Purchasing /></ProtectedRoute>} />
                    <Route path="/sales" element={<ProtectedRoute allowedRoles={['tenant_admin', 'staff']}><Sales /></ProtectedRoute>} />
                    <Route path="/reports" element={<ProtectedRoute allowedRoles={['tenant_admin', 'staff']}><Reports /></ProtectedRoute>} />
                    <Route path="/customers" element={<ProtectedRoute allowedRoles={['tenant_admin', 'staff']}><Customers /></ProtectedRoute>} />
                    <Route path="/suppliers" element={<ProtectedRoute allowedRoles={['tenant_admin', 'staff']}><Suppliers /></ProtectedRoute>} />
                    <Route path="/branches" element={<ProtectedRoute allowedRoles={['tenant_admin', 'staff']}><Branches /></ProtectedRoute>} />
                    <Route path="/support" element={<ProtectedRoute allowedRoles={['tenant_admin', 'staff', 'cashier']}><Support /></ProtectedRoute>} />
                    <Route path="/users" element={<ProtectedRoute allowedRoles={['tenant_admin']}><UsersAndRoles /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute allowedRoles={['tenant_admin']}><Settings /></ProtectedRoute>} />
                    <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['super_admin']}><SuperAdminDashboard /></ProtectedRoute>} />
                    <Route path="/admin/tenants" element={<ProtectedRoute allowedRoles={['super_admin']}><SuperAdminTenants /></ProtectedRoute>} />
                    <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['super_admin']}><SuperAdminUsers /></ProtectedRoute>} />
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
