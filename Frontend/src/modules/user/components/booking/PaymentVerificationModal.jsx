import React from 'react';
import { FiCheckCircle, FiShield, FiAlertCircle, FiPackage, FiPlusCircle, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const PaymentVerificationModal = ({ isOpen, onClose, booking }) => {
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
          className="bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl relative"
        >
          {/* Header with Background Pattern */}
          <div className="relative h-32 bg-gradient-to-br from-teal-600 to-emerald-700 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-20 h-20 bg-white rounded-full -translate-x-10 -translate-y-10" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-10 translate-y-10" />
            </div>
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-2 border border-white/30">
                <FiShield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-black text-xl tracking-tight">Payment Verification</h3>
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <FiX className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="p-6">
            {/* OTP Display Card */}
            <div className="bg-gray-900 rounded-[2rem] p-6 text-center mb-6 shadow-xl shadow-gray-200">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-3">Share this OTP with Partner</p>
              <div className="flex justify-center gap-3">
                {(booking.customerConfirmationOTP || booking.paymentOtp || '0000').toString().split('').map((digit, i) => (
                  <div key={i} className="w-12 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                    <span className="text-3xl font-black text-white">{digit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 text-emerald-400">
                <FiCheckCircle className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Secure Verification</span>
              </div>
            </div>

            {/* Price Breakdown Section */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-end">
                <h4 className="text-sm font-black text-gray-900 uppercase">Final Bill Breakdown</h4>
                <p className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full uppercase">CASH COLLECTION</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3">
                {/* Base Items */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 flex items-center gap-2">
                    <FiPackage className="w-4 h-4" /> Service Booking
                  </span>
                  <span className="font-bold text-gray-900">₹{baseAmount.toLocaleString()}</span>
                </div>

                {/* Extra Items List */}
                {extraItems.length > 0 && (
                  <div className="pt-2 border-t border-gray-200/50 space-y-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Added by Professional</p>
                    {extraItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 flex items-start gap-2">
                          <FiPlusCircle className="w-4 h-4 text-emerald-500 mt-0.5" />
                          <span className="flex-1">{item.title} (x{item.qty || 1})</span>
                        </span>
                        <span className="font-bold text-gray-900">₹{(item.price * (item.qty || 1)).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Total Line */}
                <div className="pt-3 border-t-2 border-dashed border-gray-200 flex justify-between items-center">
                  <span className="font-black text-gray-900">Total Amount to Pay</span>
                  <span className="text-2xl font-black text-gray-900 tracking-tight">₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Warning Message */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
              <FiAlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-900 leading-tight">Safety Protocol</p>
                <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                  Share this OTP <strong>only</strong> after you have verified the work quality and the final bill amount above.
                </p>
              </div>
            </div>

            {/* Confirm Received Button (Just for UX) */}
            <button
              onClick={onClose}
              className="w-full mt-6 py-4 rounded-2xl bg-gray-900 text-white font-bold text-sm shadow-xl active:scale-95 transition-transform"
            >
              I've Shared the OTP
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PaymentVerificationModal;
