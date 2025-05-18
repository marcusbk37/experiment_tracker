import React, { useState } from 'react';
import { Bell, X } from 'lucide-react';
import { format } from 'date-fns';

const mockNotifications = [
  {
    id: '1',
    title: 'Cell Culture Check',
    message: 'Time to check and feed your cell cultures',
    time: new Date(Date.now() - 15 * 60000).toISOString(),
    read: false,
  },
  {
    id: '2',
    title: 'Media Change',
    message: 'Transfer cell cultures to fresh medium',
    time: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
    read: true,
  },
];

const NotificationCenter: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const formatTime = (time: string) => {
    return format(new Date(time), 'h:mm a');
  };

  return (
    <>
      {/* Toggle button that's fixed to the bottom right on mobile */}
      <button
        type="button"
        className="fixed bottom-4 right-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg md:hidden"
        onClick={() => setOpen(!open)}
      >
        <Bell className="h-6 w-6" />
        {notifications.some((n) => !n.read) && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold">
            {notifications.filter((n) => !n.read).length}
          </span>
        )}
      </button>

      {/* Notification panel */}
      <div
        className={`fixed inset-y-0 right-0 z-30 w-full max-w-sm transform bg-white shadow-xl transition-transform duration-200 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-medium">Notifications</h3>
          <button
            type="button"
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          {notifications.length > 0 ? (
            <>
              <div className="mb-4 flex justify-between">
                <span className="text-sm text-gray-500">
                  {notifications.filter((n) => !n.read).length} unread
                </span>
                <button
                  type="button"
                  className="text-sm text-primary-600 hover:underline"
                  onClick={clearAll}
                >
                  Clear all
                </button>
              </div>

              <ul className="space-y-3">
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className={`rounded-md border p-3 ${
                      notification.read ? 'bg-white' : 'bg-primary-50'
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex justify-between">
                      <h4 className="font-medium">{notification.title}</h4>
                      <span className="text-xs text-gray-500">
                        {formatTime(notification.time)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {notification.message}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <Bell className="mb-4 h-12 w-12 text-gray-300" />
              <p className="text-center text-gray-500">
                No notifications to display
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Desktop: hidden column on the right */}
      <div className="hidden md:block md:w-64 md:border-l md:bg-white">
        <div className="border-b p-4">
          <h3 className="text-lg font-medium">Notifications</h3>
        </div>

        <div className="p-4">
          {notifications.length > 0 ? (
            <>
              <div className="mb-4 flex justify-between">
                <span className="text-sm text-gray-500">
                  {notifications.filter((n) => !n.read).length} unread
                </span>
                <button
                  type="button"
                  className="text-sm text-primary-600 hover:underline"
                  onClick={clearAll}
                >
                  Clear all
                </button>
              </div>

              <ul className="space-y-3">
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className={`rounded-md border p-3 ${
                      notification.read ? 'bg-white' : 'bg-primary-50'
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex justify-between">
                      <h4 className="font-medium">{notification.title}</h4>
                      <span className="text-xs text-gray-500">
                        {formatTime(notification.time)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {notification.message}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <Bell className="mb-4 h-12 w-12 text-gray-300" />
              <p className="text-center text-gray-500">
                No notifications to display
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationCenter;