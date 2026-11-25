import { CalendarDays, CreditCard, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";

const formatPreviewNumber = (cardNumber) => {
  const digits = cardNumber.replace(/\D/g, "");
  const padded = (digits + "0000000000000000").slice(0, 16);
  return padded.match(/.{1,4}/g)?.join(" ") || "0000 0000 0000 0000";
};

const FieldError = ({ message }) => {
  if (!message) return null;
  return <p className="mt-1 text-xs font-semibold text-red-500">{message}</p>;
};

const CreditCardPayment = ({
  cardDetails,
  errors,
  onCardNameChange,
  onCardNumberChange,
  onCardExpiryChange,
  onCardCVCChange,
}) => {
  const { cardName, cardNumber, cardExpiry, cardCVC } = cardDetails;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
      <div className="xl:col-span-2">
        <div className="relative overflow-hidden rounded-3xl bg-gray-950 text-white p-6 shadow-xl shadow-primary/10 min-h-[230px] flex flex-col justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(39,174,96,0.55),_transparent_36%),radial-gradient(circle_at_bottom_left,_rgba(255,152,0,0.35),_transparent_32%)]"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/60 font-bold">Saumya Pay</p>
              <p className="text-sm font-bold">Demo Card</p>
            </div>
            <CreditCard className="w-8 h-8 text-primary-light" />
          </div>

          <div className="relative space-y-5">
            <div className="h-10 w-14 rounded-xl bg-gradient-to-br from-amber-200 to-amber-500 border border-white/20"></div>
            <p className="font-mono text-xl sm:text-2xl tracking-wider break-words">
              {formatPreviewNumber(cardNumber)}
            </p>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="col-span-2 min-w-0">
                <p className="uppercase tracking-widest text-white/50 font-bold text-[9px]">Card Holder</p>
                <p className="font-bold truncate">{cardName.trim() || "YOUR NAME"}</p>
              </div>
              <div className="text-right">
                <p className="uppercase tracking-widest text-white/50 font-bold text-[9px]">Expires</p>
                <p className="font-bold">{cardExpiry || "MM/YY"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-secondary-light border border-primary/10 px-4 py-3 text-xs font-bold text-primary">
          <ShieldCheck size={16} />
          <span>Demo payment only. CVV is never saved.</span>
        </div>
      </div>

      <div className="xl:col-span-3 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Card Holder Name</label>
          <div className="relative">
            <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              className={`input uppercase ${errors.cardName ? "border-red-300 focus:border-red-400 focus:ring-red-100" : ""}`}
              placeholder="e.g. JOHN DOE"
              value={cardName}
              onChange={(e) => onCardNameChange(e.target.value)}
              autoComplete="cc-name"
            />
          </div>
          <FieldError message={errors.cardName} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
          <div className="relative">
            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              inputMode="numeric"
              className={`input ${errors.cardNumber ? "border-red-300 focus:border-red-400 focus:ring-red-100" : ""}`}
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChange={onCardNumberChange}
              autoComplete="cc-number"
            />
          </div>
          <FieldError message={errors.cardNumber} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
            <div className="relative">
              <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                inputMode="numeric"
                className={`input ${errors.cardExpiry ? "border-red-300 focus:border-red-400 focus:ring-red-100" : ""}`}
                placeholder="MM/YY"
                value={cardExpiry}
                onChange={onCardExpiryChange}
                autoComplete="cc-exp"
              />
            </div>
            <FieldError message={errors.cardExpiry} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
            <div className="relative">
              <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                inputMode="numeric"
                className={`input ${errors.cardCVC ? "border-red-300 focus:border-red-400 focus:ring-red-100" : ""}`}
                placeholder="123"
                maxLength="3"
                value={cardCVC}
                onChange={onCardCVCChange}
                autoComplete="cc-csc"
              />
            </div>
            <FieldError message={errors.cardCVC} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCardPayment;
