import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { ExperimentStep } from '../types';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string; // ISO string
  experimentId: string;
  stepIndex: number;
  shown: boolean;
}

interface NotificationContextType {
  scheduleNotification: (
    experimentId: string,
    stepIndex: number,
    step: ExperimentStep
  ) => void;
  checkScheduledNotifications: () => void;
  clearNotifications: (experimentId: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : [];
  });

  // Save notifications to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const scheduleNotification = useCallback(
    (experimentId: string, stepIndex: number, step: ExperimentStep) => {
      const id = `${experimentId}-${stepIndex}-${Date.now()}`;
      
      const newNotification: Notification = {
        id,
        title: 'Experiment Step Reminder',
        message: step.description,
        time: step.scheduledTime || new Date().toISOString(),
        experimentId,
        stepIndex,
        shown: false,
      };
      
      setNotifications((prev) => [...prev, newNotification]);
      
      // If the browser supports notifications and permission is granted, schedule a push notification
      if ('Notification' in window && Notification.permission === 'granted') {
        const timeDiff = new Date(step.scheduledTime || new Date()).getTime() - new Date().getTime();
        
        // Only schedule if in the future
        if (timeDiff > 0) {
          setTimeout(() => {
            new Notification('Lab Experiment Reminder', {
              body: step.description,
              icon: '/vite.svg',
            });
          }, timeDiff);
        }
      }
    },
    []
  );

  const checkScheduledNotifications = useCallback(() => {
    const now = new Date();
    
    setNotifications((prev) => {
      let updated = false;
      const updatedNotifications = prev.map((notification) => {
        // If the notification time has passed and it hasn't been shown yet
        if (
          !notification.shown &&
          new Date(notification.time).getTime() <= now.getTime()
        ) {
          updated = true;
          
          // Show the notification
          toast(notification.title, {
            description: notification.message,
            icon: <AlertCircle className="h-5 w-5 text-primary-500" />,
            duration: 10000,
          });
          
          return { ...notification, shown: true };
        }
        return notification;
      });
      
      return updated ? updatedNotifications : prev;
    });
  }, []);

  const clearNotifications = useCallback((experimentId: string) => {
    setNotifications((prev) => 
      prev.filter((notification) => notification.experimentId !== experimentId)
    );
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        scheduleNotification,
        checkScheduledNotifications,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};