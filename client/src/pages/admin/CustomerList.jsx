import React, { useState, useEffect } from "react";
import axios from "axios";
import { authHeaders } from "../../utils/auth";
import { Search, Users, Calendar, Mail, UserCheck } from "lucide-react";
import toast from "react-hot-toast";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data } = await axios.get("/api/auth/users", authHeaders());
        setCustomers(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast.error("Failed to load customer list.");
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // Filter customers by name or email
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Customer Management</h2>
        <p className="text-gray-500 mt-1">View and manage registered customers of Saumya Stores.</p>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="input pl-11 h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
        
        <span className="text-sm font-medium text-gray-500">{filteredCustomers.length} Customers registered</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Customer Details</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Contact Phone</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Registration Date</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Account Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-6 py-4 h-16 bg-gray-50/50"></td>
                  </tr>
                ))
              ) : filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{customer.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono">ID: {customer._id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600 font-medium">
                        <Mail size={16} className="text-gray-400" />
                        <span>{customer.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-900">{customer.phone || "Not Provided"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-xs text-gray-500 font-bold">
                        <Calendar size={14} className="text-gray-400" />
                        <span>{new Date(customer.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
                        <UserCheck size={12} />
                        <span>Active Shopper</span>
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                       <div className="p-4 bg-gray-50 rounded-full">
                         <Users size={40} className="text-gray-300" />
                       </div>
                       <p className="text-gray-500 font-medium">No customers registered yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;
