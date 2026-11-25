import { useState, useEffect } from "react";
import axios from "axios";
import { authHeaders } from "../../utils/auth";
import { 
  ShoppingCart, 
  Search, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Truck,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");


  useEffect(() => {
    let isMounted = true;

    axios
      .get("/api/orders", authHeaders())
      .then(({ data }) => {
        if (isMounted) setOrders(data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredOrders = orders.filter(o => 
    o._id.toLowerCase().includes(keyword.toLowerCase()) || 
    o.user?.name.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Order Management</h2>
        <p className="text-gray-500 mt-1">Track and process customer orders effectively.</p>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search by Order ID or Customer Name..."
            className="input pl-11 h-11"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
        <div className="flex items-center space-x-4">
           <span className="text-sm font-medium text-gray-500">{filteredOrders.length} Orders total</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Order Details</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Total</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Payment</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => <tr key={i} className="animate-pulse"><td colSpan="6" className="h-20 bg-gray-50/50"></td></tr>)
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const paymentStatus = order.paymentStatus || (order.isPaid ? "Paid" : "Pending");
                  const isPaid = paymentStatus === "Paid" || order.isPaid;

                  return (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                         <div className="p-2 bg-gray-100 rounded-lg text-gray-400">
                            <ShoppingCart size={18} />
                         </div>
                         <div>
                            <p className="text-sm font-bold text-gray-900">#{order._id.substring(18).toUpperCase()}</p>
                            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider flex items-center">
                               <Calendar size={10} className="mr-1" />
                               {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                             {order.user?.name.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-gray-700">{order.user?.name}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-sm font-bold text-gray-900">Rs. {order.totalPrice.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        {order.paymentMethod === "Cash on Delivery" ? (
                          <div className="inline-flex items-center text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider w-fit">
                            CASH ON DELIVERY
                          </div>
                        ) : (
                          <div className="inline-flex items-center text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider w-fit">
                            ONLINE / CARD
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Status:</span>
                          {isPaid ? (
                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                              {paymentStatus}
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                              {paymentStatus}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                        {order.isDelivered ? (
                          <div className="flex items-center space-x-1.5 text-blue-600 bg-blue-50 px-3 py-1 rounded-full w-fit">
                             <CheckCircle2 size={12} />
                             <span className="text-[10px] font-bold uppercase tracking-wider">Delivered</span>
                          </div>
                       ) : (
                          <div className="flex items-center space-x-1.5 text-orange-600 bg-orange-50 px-3 py-1 rounded-full w-fit">
                             <Truck size={12} />
                             <span className="text-[10px] font-bold uppercase tracking-wider">Processing</span>
                          </div>
                       )}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <Link to={`/admin/orders/${order._id}`} className="p-2 text-gray-400 hover:text-primary transition-colors">
                          <Eye size={18} />
                       </Link>
                    </td>
                  </tr>
                  );
                })
              ) : (
                <tr><td colSpan="6" className="py-20 text-center text-gray-400">No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
