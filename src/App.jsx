import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import CvCatalogue from './pages/CvCatalogue';
import CvOrder from './pages/CvOrder';
import CvOrderStatus from './pages/CvOrderStatus';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminMessages from './pages/admin/Messages';
import AdminServices from './pages/admin/Services';
import AdminRealisations from './pages/admin/Realisations';
import AdminEntreprise from './pages/admin/Entreprise';
import AdminTeam from './pages/admin/Team';
import AdminClients from './pages/admin/Clients';
import AdminFinances from './pages/admin/Finances';
import AdminCvTemplates from './pages/admin/CvTemplates';
import AdminCvOrders from './pages/admin/CvOrders';

function PublicLayout({ children }) {
  return (
    <div className="app">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
      <Route path="/a-propos" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/realisations" element={<PublicLayout><Portfolio /></PublicLayout>} />
      <Route path="/cv" element={<PublicLayout><CvCatalogue /></PublicLayout>} />
      <Route path="/cv/commande/:slug" element={<PublicLayout><CvOrder /></PublicLayout>} />
      <Route path="/cv/suivi/:reference" element={<PublicLayout><CvOrderStatus /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="realisations" element={<AdminRealisations />} />
        <Route path="entreprise" element={<AdminEntreprise />} />
        <Route path="equipe" element={<AdminTeam />} />
        <Route path="clients" element={<AdminClients />} />
        <Route path="finances" element={<AdminFinances />} />
        <Route path="cv-modeles" element={<AdminCvTemplates />} />
        <Route path="cv-commandes" element={<AdminCvOrders />} />
      </Route>
    </Routes>
  );
}

export default App;
