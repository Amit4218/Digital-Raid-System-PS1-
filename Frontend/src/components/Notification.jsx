import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

const Notification = () => {
  // const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const calculateTimeDifference = (dateString) => {
    if (!dateString) return "just now";

    // Handle MongoDB extended JSON format
    const dateValue = dateString.$date || dateString;
    const now = new Date();
    const date = new Date(dateValue);

    // Handle invalid dates
    if (isNaN(date.getTime())) return "recently";

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
          `${import.meta.env.VITE_BASE_URL}/user/get-all-raids`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-access-key": import.meta.env.VITE_SECRET_ACCESS_KEY,
            },
          }
        );
        const data = await response.json();
        // console.log("Full API Response:", data); // Debug log

        if (data.raids && Array.isArray(data.raids)) {
          // console.log("Raw raids data:", data.raids); // Debug log

          const raidNotifications = data.raids
            .filter((raid) => {
              if (!raid) return false;

              // // Debug log for each raid
              // console.log("Checking raid:", {
              //   id: raid._id,
              //   raidType: raid.raidType,
              //   status: raid.status,
              //   approvalStatus: raid.unplannedRequestDetails?.approvalStatus,
              //   isUnplanned: raid.isUnplannedRequest,
              // });

              // Check if it's an approved unplanned raid
              const isUnplannedApproved =
                (raid.raidType?.includes("unplanned") ||
                  raid.isUnplannedRequest) &&
                raid.unplannedRequestDetails?.approvalStatus === "approved";

              // Check if it's pending
              const isPending = raid.status === "pending";

              return isUnplannedApproved && isPending;
            })
            .map((raid) => {
              const approvalDate =
                raid.unplannedRequestDetails?.approvalDate?.$date ||
                raid.unplannedRequestDetails?.approvalDate ||
                new Date().toISOString();

              return {
                id: raid._id?.$oid || raid._id || Math.random().toString(),
                message: `Approved unplanned raid: ${raid.description || "No description"
                  }`,
                time: calculateTimeDifference(approvalDate),
                read: false,
                raidData: raid,
              };
            });

          // console.log("Filtered Notifications:", raidNotifications);
          setNotifications(raidNotifications);
          setUnreadCount(raidNotifications.length);
        } else {
          console.log("No valid raids data found");
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
    const interval = setInterval(fetchNotifications, 300000);
    return () => clearInterval(interval);
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    setUnreadCount((prev) => prev - 1);
    // navigate("/admin/unplannedRaids");
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
        {/* Notification bell icon */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-72 max-h-80 bg-white rounded-md shadow-lg overflow-y-auto z-50">
          <div className="py-1">
            <div className="px-4 py-2 border-b border-gray-200 bg-gray-50 sticky top-0">
              <p className="text-sm font-medium text-gray-700">
                Approved Unplanned Raids
              </p>
            </div>

            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                      !notification.read ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex flex-col">
                      <p
                        className={`text-sm ${
                          !notification.read
                            ? "font-semibold text-gray-900"
                            : "text-gray-700"
                        }`}
                      >
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.time.includes("-")
                          ? "Starting soon"
                          : `Approved ${notification.time}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-3 text-center text-sm text-gray-500">
                No approved unplanned raids pending
              </div>
            )}

            {notifications.length > 0 && (
              <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 sticky bottom-0">
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800"
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
