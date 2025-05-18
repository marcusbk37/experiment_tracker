import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { ExperimentProvider } from './contexts/ExperimentContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Toaster } from 'sonner';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ExperimentProvider>
        <NotificationProvider>
          <App />
          <Toaster position="top-right" richColors />
        </NotificationProvider>
      </ExperimentProvider>
    </BrowserRouter>
  </StrictMode>
);