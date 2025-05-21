import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Notification = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const calculateTimeDifference = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/admin/getRaids`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-access-key": import.meta.env.VITE_SECRET_ACCESS_KEY,
            },
          }
        );
        const data = await response.json();

        // console.log("API Response:", data);

        if (data.raids && Array.isArray(data.raids)) {
          const raidNotifications = data.raids
            .filter((raid) => raid.status === "pending") // Only show pending raids
            .map((raid) => {
              let message = "";
              let time = "";

              if (raid.raidType && raid.raidType.includes("unplanned")) {
                message = `Unplanned raid needs approval: ${
                  raid.description || "No description"
                }`;
                time =
                  raid.unplannedRequestDetails?.requestDate || raid.createdAt;
              } else {
                message = `New raid scheduled: ${
                  raid.description || "No description"
                }`;
                time = raid.scheduledDate || raid.createdAt;
              }

              return {
                id: raid._id,
                message,
                time: calculateTimeDifference(time),
                read: false,
                raidData: raid,
              };
            });

          // console.log("Generated Notifications:", raidNotifications);
          setNotifications(raidNotifications);
          setUnreadCount(raidNotifications.length);
        } else {
          // console.log("No raids data found in response");
          setNotifications([]);
          setUnreadCount(0);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications([]);
        setUnreadCount(0);
      }
    };

    fetchNotifications();

    // Optional: Set up refresh interval (e.g., every 5 minutes)
    const interval = setInterval(fetchNotifications, 300000);
    return () => clearInterval(interval);
  }, []);

  const markAllAsRead = () => {
  
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const markAsRead = (id) => {
    setNotifications((prevNotifications) => {
      const updatedNotifications = prevNotifications.map((notification) => {
        if (notification.id === id) {
          // Check if this is an unplanned raid before navigating
          if (notification.raidData.raidType.includes("unplanned")) {
            navigate("/admin/unplannedRaids");
          }
          return { ...notification, read: true };
        }
        return notification;
      });
      return updatedNotifications;
    });
    setUnreadCount((prev) => prev - 1);
  };


  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="p-2 text-white hover:bg-white/10 rounded-full relative"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
            clipRule="evenodd"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-72 h-80 bg-white rounded-md shadow-lg overflow-y-scroll no-scrollbar z-50">
          <div className="py-1">
            <div className="px-4 py-2 border-b border-gray-200 bg-gray-50 sticky -top-1">
              <p className="text-sm font-medium text-gray-700">Notifications</p>
            </div>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                    !notification.read ? "bg-blue-50" : ""
                  }`}
                >
                  <p
                    className={`text-sm ${
                      !notification.read ? "font-semibold" : "text-gray-800"
                    }`}
                  >
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {notification.time}
                  </p>
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-center text-sm text-gray-500">
                No pending raid notifications
              </div>
            )}
            {notifications.length > 0 && (
              <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 text-center sticky bottom-0">
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800 "
                >
                  Mark all as read
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
