import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ExperimentDetail from './pages/ExperimentDetail';
import ProtocolUpload from './pages/ProtocolUpload';
import Layout from './components/layout/Layout';
import ExperimentSteps from './pages/ExperimentSteps';
import { useNotification } from './contexts/NotificationContext';
import { useEffect } from 'react';

function App() {
  const { checkScheduledNotifications } = useNotification();
  
  // Check for notifications that need to be displayed every minute
  useEffect(() => {
    const interval = setInterval(() => {
      checkScheduledNotifications();
    }, 60000);
    
    // Initial check when component mounts
    checkScheduledNotifications();
    
    return () => clearInterval(interval);
  }, [checkScheduledNotifications]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/upload" element={<ProtocolUpload />} />
        <Route path="/experiments/:id" element={<ExperimentDetail />} />
        <Route path="/experiments/:id/steps" element={<ExperimentSteps />} />
      </Routes>
    </Layout>
  );
}

export default App;