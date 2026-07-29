// import { useState, useEffect } from 'react';
// import axios from 'axios';

// const AllUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Change this to your actual backend URL
//   const API_URL = 'http://localhost:5000/api/admin/alluser'; // ← update port & URL

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const response = await axios.get(API_URL, {
//           headers: {
//             // Add token if your admin route is protected
//             // Authorization: `Bearer ${localStorage.getItem('adminToken')}`
//           },
//         });

//         setUsers(response.data);
//       } catch (err) {
//         console.error('Error fetching users:', err);
//         setError(
//           err.response?.data?.message ||
//           'Failed to load users. Is backend running?'
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
//         <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
//         <p className="text-gray-700">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-10">
//       <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
//         All Users
//       </h1>

//       {users.length === 0 ? (
//         <div className="text-center text-gray-500 py-10">
//           No users found in the database.
//         </div>
//       ) : (
//         <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Name
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Email
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Role
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Joined
//                 </th>
//                 {/* Add more columns if your schema has more fields */}
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {users.map((user) => (
//                 <tr key={user._id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm font-medium text-gray-900">
//                       {user.name || '—'}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-900">{user.email}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span
//                       className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                         user.role === 'admin'
//                           ? 'bg-purple-100 text-purple-800'
//                           : 'bg-green-100 text-green-800'
//                       }`}
//                     >
//                       {user.role || 'user'}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {user.createdAt
//                       ? new Date(user.createdAt).toLocaleDateString()
//                       : '—'}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllUsers;

import { useState, useEffect } from "react";
import axios from "axios";

const AllUsers = () => {
  const [users, setUsers] = useState([]); // ← always start with empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "https://bitzo-server-2.onrender.com/api/admin/alluser"; // update if needed

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(API_URL, {
          // headers: { Authorization: `Bearer ${token}` } // if needed
        });

        // ────────────────────────────────────────────────
        // Most important fixes ↓↓↓
        const data = response.data;

        // Case 1: data is already array
        if (Array.isArray(data)) {
          setUsers(data);
        }
        // Case 2: data has nested users array (very common)
        else if (data && Array.isArray(data.users)) {
          setUsers(data.users);
        }
        // Case 3: data is object but has user list in another key
        else if (data && typeof data === "object") {
          // Try common key names
          const possibleKeys = ["users", "data", "result", "allUsers", "list"];
          for (const key of possibleKeys) {
            if (Array.isArray(data[key])) {
              setUsers(data[key]);
              break;
            }
          }
        }
        // Fallback: empty array
        else {
          setUsers([]);
          console.warn("API did not return an array:", data);
        }
        // ────────────────────────────────────────────────
      } catch (err) {
        console.error("Fetch error:", err);
        setError(
          err.response?.data?.message ||
            "Could not load users. Is server running?",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // ────────────────────────────────────────────────
  //  Safe rendering – never call .map on non-array
  // ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        All Users
      </h1>

      {users.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No users found</div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reward
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Paid
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name || "—"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role || "user"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.reward != null ? `${user.reward} ₹` : "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.totalPayment != null && user.totalPayment > 0
                      ? `₹${user.totalPayment.toLocaleString()}`
                      : "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-IN")
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
