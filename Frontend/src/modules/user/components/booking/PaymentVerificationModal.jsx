import React from 'react';
import { FiCheckCircle, FiShield, FiAlertCircle, FiPackage, FiPlusCircle, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const PaymentVerificationModal = ({ isOpen, onClose, booking, onPayOnline }) => {
  if (!isOpen || !booking) return null;

  const baseAmount = parseFloat(booking.basePrice) || 0;
  const discount = parseFloat(booking.discount) || 0;
  const tax = parseFloat(booking.tax) || 0;
  const convenienceFee = parseFloat(booking.visitationFee || booking.visitingCharges) || 0;

  // Extra items added by worker/vendor
  const extraItems = booking.workDoneDetails?.items || [];
  const extraTotal = extraItems.reduce((sum, item) => sum + (parseFloat(item.price) * (item.qty || 1)), 0);

  const finalTotal = booking.finalAmount || (baseAmount - discount + tax + convenienceFee + extraTotal);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="relative h-24 bg-gradient-to-br from-teal-600 to-emerald-700 flex items-center justify-center shrink-0">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-20 h-20 bg-white rounded-full -translate-x-10 -translate-y-10" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-10 translate-y-10" />
            </div>
            <div className="relative z-10 text-center flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
                <FiShield className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-white font-black text-lg tracking-tight">Payment & Verification</h3>
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <FiX className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto custom-scrollbar">
            {/* Price Breakdown Section */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-end mb-2">
                <h4 className="text-xs font-black text-gray-500 uppercase tracking-wider">Total Payable</h4>
                <p className="text-2xl font-black text-gray-900">₹{finalTotal.toLocaleString()}</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Base Amount</span>
                  <span className="font-medium">₹{baseAmount.toLocaleString()}</span>
                </div>
                {extraItems.length > 0 && (
                  <div className="pt-2 border-t border-gray-200 mt-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Extras Added</p>
                    {extraItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-gray-600">
                        <span>{item.title} x{item.qty || 1}</span>
                        <span>₹{(item.price * (item.qty || 1)).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <h4 className="text-xs font-black text-gray-900 uppercase mb-3">Select Payment Method</h4>

            <div className="space-y-4">
              {/* Option 2: Online */}
              <button
                onClick={onPayOnline}
                className="w-full py-4 rounded-xl bg-gray-900 text-white font-bold flex items-center justify-center gap-3 shadow-xl shadow-gray-200 active:scale-95 transition-all hover:bg-black"
              >
                <span>Pay Online Now</span>
                <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-medium">Razorpay / UPI</span>
              </button>

              <div className="relative py-1 text-center">
                <span className="text-[10px] text-gray-400 font-bold bg-white px-3 relative z-10 uppercase tracking-widest">OR</span>
                <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-100 z-0"></div>
              </div>

              {/* Option 1: Cash OTP */}
              <div className="bg-emerald-50 border-2 border-dashed border-emerald-100 rounded-2xl p-5 text-center relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-xs font-bold text-emerald-800 mb-1">Pay Cash to Professional</p>
                  <p className="text-[10px] text-emerald-600 mb-4 opacity-80">Share this OTP to confirm receipt</p>

                  <div className="flex justify-center gap-3">
                    {(booking.customerConfirmationOTP || booking.paymentOtp || '0000').toString().split('').map((digit, i) => (
                      <div key={i} className="w-10 h-12 bg-white shadow-sm border border-emerald-100 rounded-xl flex items-center justify-center">
                        <span className="text-xl font-black text-emerald-900">{digit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Warning Message */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3 mt-6">
              <FiAlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-900 leading-tight mb-1">Important</p>
                <p className="text-[10px] text-amber-700 leading-relaxed">
                  Only share the OTP if you are paying by CASH directly to the professional.
                </p>
              </div>
            </div>

            <button onClick={onClose} className="w-full mt-4 text-xs font-bold text-gray-400 hover:text-gray-600">
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PaymentVerificationModal;
