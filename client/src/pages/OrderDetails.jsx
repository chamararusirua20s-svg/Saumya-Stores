import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  CreditCard,
  Home,
  MapPin,
  PackageCheck,
  Printer,
  ReceiptText,
  ShoppingBag,
  Truck,
  UserRound,
} from "lucide-react";
import axios from "axios";
import { authHeaders } from "../utils/auth";
import toast from "react-hot-toast";
import BrandLogo from "../components/BrandLogo";

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

const formatCurrency = (value = 0) => `Rs. ${Number(value || 0).toFixed(2)}`;

const formatDate = (date) =>
  new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
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

const StatusBadge = ({ status, icon: Icon = ReceiptText }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${
      STATUS_STYLES[status] || "bg-gray-50 text-gray-700 border-gray-200"
    }`}
  >
    <Icon size={14} />
    {status}
  </span>
);

const InfoTile = ({ icon: Icon, label, value, children }) => (
  <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
      <Icon size={15} className="text-primary" />
      {label}
    </div>
    <div className="mt-2 text-sm font-bold leading-6 text-gray-900">{children || value}</div>
  </div>
);

const OrderDetails = ({ showSuccessBanner = false }) => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`/api/orders/${id}`, authHeaders());
        if (isMounted) setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error(error.response?.data?.message || "Failed to fetch order details.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrder();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container-custom py-12">
        <div className="mx-auto max-w-5xl space-y-6 animate-pulse">
          <div className="h-11 w-44 rounded-xl bg-gray-200"></div>
          <div className="h-40 rounded-3xl bg-white"></div>
          <div className="h-96 rounded-3xl bg-white"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-custom py-20 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500">
          <ReceiptText size={38} />
        </div>
        <h1 className="mt-6 text-3xl font-extrabold text-gray-900">Order not found</h1>
        <p className="mx-auto mt-2 max-w-md text-gray-500">
          This order could not be loaded. It may have been removed or you may not have access to it.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/my-orders" className="btn btn-secondary inline-flex items-center justify-center gap-2 px-6 py-3">
            <ArrowLeft size={18} />
            Back to My Orders
          </Link>
          <Link to="/shop" className="btn btn-primary inline-flex items-center justify-center gap-2 px-6 py-3">
            Browse Products
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  const paymentStatus = normalizeStatus(order.paymentStatus || (order.isPaid ? "Paid" : "Pending"));
  const orderStatus = getOrderStatus(order);
  const cardLastFour = order.lastFourDigits ? `**** ${order.lastFourDigits}` : "";
  const shippingAddress = order.shippingAddress || {};

  return (
    <div className="container-custom py-10 sm:py-12 print:py-0">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-3 print:hidden sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/my-orders"
            className="inline-flex w-fit items-center gap-2 text-sm font-bold text-gray-500 transition-colors hover:text-primary"
          >
            <ArrowLeft size={18} />
            Back to My Orders
          </Link>
          <Link to="/shop" className="btn btn-primary inline-flex items-center justify-center gap-2 px-5 py-3">
            <ShoppingBag size={18} />
            Continue Shopping
          </Link>
        </div>

        {showSuccessBanner && (
          <div className="rounded-3xl border border-emerald-100 bg-white p-6 sm:p-8 text-center shadow-sm print:hidden space-y-3">
            <div className="flex justify-center">
              <BrandLogo size="lg" />
            </div>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-md">
              <Check size={30} strokeWidth={3} />
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-gray-900">Order Placed Successfully!</h1>
            <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-gray-500">
              Thank you for shopping with Saumya Stores. Your order is registered and ready for tracking.
            </p>
          </div>
        )}

        <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8 print:border-none print:p-0 print:shadow-none">
          <div className="flex flex-col gap-6 border-b border-gray-100 pb-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary-light px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary">
                <ReceiptText size={15} />
                Order Details
              </span>
              <h1 className="mt-4 break-all font-mono text-2xl font-extrabold text-gray-900 sm:text-3xl">
                #{order._id}
              </h1>
              <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-gray-500">
                <Calendar size={16} />
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              <StatusBadge status={paymentStatus} icon={CreditCard} />
              <StatusBadge status={orderStatus} icon={orderStatus === "Delivered" ? PackageCheck : Truck} />
            </div>
          </div>

          <div className="grid gap-4 py-6 md:grid-cols-2 lg:grid-cols-4">
            <InfoTile icon={UserRound} label="Customer" value={order.user?.name || "Customer"} />
            <InfoTile icon={Home} label="Delivery Address">
              <span>
                {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
              </span>
            </InfoTile>
            <InfoTile icon={CreditCard} label="Payment Method">
              <span>{order.paymentMethod || "Unavailable"}</span>
              {cardLastFour && <span className="mt-1 block font-mono text-xs text-gray-500">{cardLastFour}</span>}
            </InfoTile>
            <InfoTile icon={MapPin} label="Current Status" value={orderStatus} />
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-5 py-4 font-bold text-gray-500">Product</th>
                    <th className="px-5 py-4 text-center font-bold text-gray-500">Qty</th>
                    <th className="px-5 py-4 text-right font-bold text-gray-500">Unit Price</th>
                    <th className="px-5 py-4 text-right font-bold text-gray-500">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {order.orderItems.map((item, index) => (
                    <tr key={`${item.product || item.name}-${index}`} className="transition-colors hover:bg-gray-50/70">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt={item.name} className="h-14 w-14 rounded-2xl border object-cover" />
                          <div>
                            <p className="font-bold text-gray-900">{item.name}</p>
                            <p className="text-xs font-semibold text-gray-400">
                              {item.selectedVariant?.name || "Default"}
                              {item.selectedVariant?.sku ? ` / SKU: ${item.selectedVariant.sku}` : ""}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center font-bold text-gray-700">{item.qty}</td>
                      <td className="px-5 py-4 text-right font-semibold text-gray-600">{formatCurrency(item.price)}</td>
                      <td className="px-5 py-4 text-right font-extrabold text-gray-900">
                        {formatCurrency(item.qty * item.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-gray-100 md:hidden">
              {order.orderItems.map((item, index) => (
                <div key={`${item.product || item.name}-${index}`} className="p-4">
                  <div className="flex gap-3">
                    <img src={item.image} alt={item.name} className="h-16 w-16 rounded-2xl border object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-gray-900">{item.name}</p>
                      <p className="text-xs font-semibold text-gray-400">{item.selectedVariant?.name || "Default"}</p>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-xs font-semibold text-gray-500">
                        <span>Qty: {item.qty}</span>
                        <span>{formatCurrency(item.price)}</span>
                        <span className="text-right font-extrabold text-gray-900">{formatCurrency(item.qty * item.price)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <div className="w-full rounded-2xl bg-gray-50 p-5 text-sm font-semibold sm:max-w-sm">
              <div className="flex justify-between py-2 text-gray-500">
                <span>Products subtotal</span>
                <span className="text-gray-900">{formatCurrency(order.itemsPrice)}</span>
              </div>
              <div className="flex justify-between py-2 text-gray-500">
                <span>Tax</span>
                <span className="text-gray-900">{formatCurrency(order.taxPrice)}</span>
              </div>
              <div className="flex justify-between py-2 text-gray-500">
                <span>Delivery fee</span>
                <span className="text-gray-900">
                  {Number(order.shippingPrice || 0) === 0 ? "FREE" : formatCurrency(order.shippingPrice)}
                </span>
              </div>
              <div className="mt-3 flex justify-between border-t border-gray-200 pt-4 text-lg font-extrabold text-gray-900">
                <span>Grand total</span>
                <span className="text-2xl text-primary">{formatCurrency(order.totalPrice)}</span>
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-3 print:hidden sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={handlePrint}
            className="btn btn-secondary inline-flex items-center justify-center gap-2 px-6 py-3"
          >
            <Printer size={18} />
            Print Details
          </button>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/my-orders" className="btn btn-secondary inline-flex items-center justify-center gap-2 px-6 py-3">
              <ArrowLeft size={18} />
              Back to My Orders
            </Link>
            <Link to="/shop" className="btn btn-primary inline-flex items-center justify-center gap-2 px-6 py-3">
              Browse Products
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
