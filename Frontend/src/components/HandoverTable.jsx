import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaSearch, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

const UserHandoverRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "handoverDate",
    direction: "desc",
  });

  // Get current user ID from localStorage or auth context
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUserHandoverRecords = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/user/handover-records`,
          {
            headers: {
              "x-access-key": import.meta.env.VITE_SECRET_ACCESS_KEY,
            },
            params: {
              userId: currentUserId,
            },
          }
        );

        if (response.data.success && response.data.data.length > 0) {
          // Process records where current user is the handoverFrom
          const userRecords = response.data.data.flatMap((record) =>
            record.custodyChain
              .filter(
                (chain) =>
                  chain.handoverFrom.userId?.toString() === currentUserId
              )
              .map((chain) => ({
                ...chain,
                exhibitType: record.exhibitType,
                exhibitId: record.exhibitId,
                recordId: record._id,
                handoverDate: new Date(chain.handoverDate).toLocaleString(),
              }))
          );

          setRecords(userRecords);
        } else {
          toast.info("No handover records found for your account");
        }
      } catch (error) {
        console.error("Error fetching handover records:", error);
        toast.error("Failed to load your handover records");
      } finally {
        setLoading(false);
      }
    };

    fetchUserHandoverRecords();
  }, [currentUserId]);

  // Sort functionality remains the same as previous example
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedRecords = [...records].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredRecords = sortedRecords.filter((record) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      record.exhibitType.toLowerCase().includes(searchTermLower) ||
      record.exhibitId.toLowerCase().includes(searchTermLower) ||
      record.purpose.toLowerCase().includes(searchTermLower) ||
      record.handoverTo.userId
        ?.toString()
        .toLowerCase()
        .includes(searchTermLower) ||
      record.handoverTo.externalDetails?.name
        .toLowerCase()
        .includes(searchTermLower)
    );
  });

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort />;
    return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600 text-lg">
          You haven't initiated any handovers yet.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gray-400 rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-[#27272A] to-[#3f3f46]">
          <h2 className="text-2xl font-bold text-white">
            Your Handover Records
          </h2>
          <p className="text-blue-100">All evidence transfers you initiated</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-300">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("handoverDate")}
                >
                  <div className="flex items-center">
                    Date & Time
                    <span className="ml-1">{getSortIcon("handoverDate")}</span>
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("exhibitType")}
                >
                  <div className="flex items-center">
                    Exhibit Type
                    <span className="ml-1">{getSortIcon("exhibitType")}</span>
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("exhibitId")}
                >
                  <div className="flex items-center">
                    Exhibit ID
                    <span className="ml-1">{getSortIcon("exhibitId")}</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transferred To
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("purpose")}
                >
                  <div className="flex items-center">
                    Purpose
                    <span className="ml-1">{getSortIcon("purpose")}</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-[#7d7d83] divide-y divide-gray-200">
              {filteredRecords.map((record, index) => (
                <tr key={index} className="hover:bg-gray-400">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.handoverDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.exhibitType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                    {record.exhibitId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.handoverTo.userId ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Officer-Id : {record.handoverTo.userId}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        External: {record.handoverTo.externalDetails.name}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.purpose}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.digitalSignatures.toSignature === "Pending" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Pending Signature
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Completed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-6">
            <p className="text-gray-500">
              No records match your search criteria.
            </p>
          </div>
        )}

        <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium">{filteredRecords.length}</span> of
            your records
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHandoverRecords;
