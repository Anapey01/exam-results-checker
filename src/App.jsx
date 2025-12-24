import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import { ThemeProvider } from './components/ThemeToggle';
import Landing from './pages/Landing';
import SinglePurchase from './pages/SinglePurchase';
import BulkPurchase from './pages/BulkPurchase';
import Dashboard from './pages/Dashboard';
import FAQPage from './pages/FAQPage';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/single" element={<SinglePurchase />} />
            <Route path="/bulk" element={<BulkPurchase />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/contact" element={<Contact />} />
            {/* 404 - catch all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
