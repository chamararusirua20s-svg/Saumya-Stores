import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  CreditCard,
  PackageCheck,
  PackageSearch,
  ReceiptText,
  ShoppingBag,
  Truck,
} from "lucide-react";
import axios from "axios";
import { authHeaders } from "../utils/auth";
import toast from "react-hot-toast";

const STATUS_STYLES = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Confirmed: "bg-sky-50 text-sky-700 border-sky-200",
  Processing: "bg-blue-50 text-blue-700 border-blue-200",
  Shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
  Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Failed: "bg-red-50 text-red-700 border-red-200",
  Refunded: "bg-purple-50 text-purple-700 border-purple-200",
};

const STATUS_ICONS = {
  Pending: ReceiptText,
  Confirmed: PackageCheck,
  Processing: Truck,
  Shipped: Truck,
  Delivered: PackageCheck,
  Cancelled: ReceiptText,
};

const formatCurrency = (value = 0) => `Rs. ${Number(value || 0).toFixed(2)}`;

const formatDate = (date) =>
  new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const normalizeStatus = (status) => {
  if (!status) return "";
  return String(status)
    .replace(/[_-]/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getOrderStatus = (order) => {
  const explicitStatus = order.orderStatus || order.status || order.deliveryStatus;
  if (explicitStatus) return normalizeStatus(explicitStatus);
  if (order.isCancelled) return "Cancelled";
  if (order.isDelivered) return "Delivered";
  if (order.shippedAt || order.isShipped) return "Shipped";
  return "Processing";
};

const StatusBadge = ({ status, icon: Icon }) => {
  const BadgeIcon = Icon || STATUS_ICONS[status] || ReceiptText;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${
        STATUS_STYLES[status] || "bg-gray-50 text-gray-700 border-gray-200"
      }`}
    >
      <BadgeIcon size={14} />
      {status}
    </span>
  );
};

const OrderThumbnails = ({ items }) => (
  <div className="flex -space-x-3">
    {items.slice(0, 4).map((item, index) => (
      <img
        key={`${item.product || item.name}-${index}`}
        src={item.image}
        alt={item.name}
        className="h-12 w-12 rounded-2xl border-2 border-white bg-gray-100 object-cover shadow-sm"
      />
    ))}
    {items.length > 4 && (
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-white bg-gray-900 text-xs font-bold text-white shadow-sm">
        +{items.length - 4}
      </span>
    )}
  </div>
);

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("/api/orders/myorders", authHeaders());
        const sorted = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        if (isMounted) setOrders(sorted);
      } catch (error) {
        console.error("Error fetching customer orders:", error);
        toast.error("Failed to fetch order history.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="container-custom py-12">
        <div className="mx-auto max-w-5xl space-y-8 animate-pulse">
          <div className="space-y-3">
            <div className="h-10 w-56 rounded-lg bg-gray-200"></div>
            <div className="h-5 w-80 rounded bg-gray-100"></div>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-44 rounded-3xl bg-white shadow-sm"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-10 sm:py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary-light px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary">
              <ReceiptText size={15} />
              Customer Orders
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
              Order History
            </h1>
            <p className="mt-2 text-gray-500">Track every grocery order and jump back to shopping anytime.</p>
          </div>
          <Link to="/shop" className="btn btn-primary inline-flex items-center justify-center gap-2 px-5 py-3">
            <ShoppingBag size={18} />
            Continue Shopping
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-3xl border border-gray-100 bg-white px-6 py-14 text-center shadow-sm sm:px-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-secondary-light text-primary">
              <PackageSearch size={40} />
            </div>
            <h3 className="mt-6 text-2xl font-extrabold text-gray-900">No orders yet</h3>
            <p className="mx-auto mt-2 max-w-md text-gray-500">
              Your order history will appear here after checkout. Fresh picks are waiting in the shop.
            </p>
            <Link to="/shop" className="btn btn-primary mt-8 inline-flex items-center justify-center gap-2 px-8 py-3.5">
              <ShoppingBag size={18} />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const paymentStatus = normalizeStatus(order.paymentStatus || (order.isPaid ? "Paid" : "Pending"));
              const orderStatus = getOrderStatus(order);
              const productSummary = order.orderItems
                .map((item) => `${item.name}${item.selectedVariant?.name ? ` - ${item.selectedVariant.name}` : ""} (${item.qty})`)
                .join(", ");

              return (
                <article
                  key={order._id}
                  className="group rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg sm:p-6"
                >
                  <div className="grid gap-5 lg:grid-cols-[auto_1fr_auto] lg:items-center">
                    <OrderThumbnails items={order.orderItems || []} />

                    <div className="min-w-0 space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 font-mono text-sm font-bold text-gray-900">
                          #{order._id}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500">
                          <Calendar size={16} className="text-gray-400" />
                          {formatDate(order.createdAt)}
                        </span>
                      </div>

                      <div>
                        <p className="line-clamp-2 text-sm font-semibold leading-6 text-gray-700">
                          {productSummary}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                          <span className="font-bold text-gray-500">
                            Total <strong className="ml-1 text-lg text-primary">{formatCurrency(order.totalPrice)}</strong>
                          </span>
                          <span className="inline-flex items-center gap-1.5 font-semibold text-gray-500">
                            <CreditCard size={16} className="text-gray-400" />
                            {order.paymentMethod || "Payment method unavailable"}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <StatusBadge status={paymentStatus} icon={CreditCard} />
                        <StatusBadge status={orderStatus} />
                      </div>
                    </div>

                    <Link
                      to={`/orders/${order._id}`}
                      className="btn btn-secondary inline-flex w-full items-center justify-center gap-2 px-5 py-3 font-bold group-hover:border-primary/30 group-hover:text-primary sm:w-auto"
                    >
                      View Details
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
