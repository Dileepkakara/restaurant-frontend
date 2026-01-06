// src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as customerApi from "@/api/customerApi";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [orderType, setOrderType] = useState("dinein");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load cart items from localStorage
    const savedCart = localStorage.getItem('customer_cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.05); // 5% tax
  const total = subtotal + tax;

  const placeOrder = async () => {
    if (cartItems.length === 0) return;

    setLoading(true);
    try {
      // Get restaurant and table IDs from localStorage or URL params
      const restaurantId = localStorage.getItem('current_restaurant_id') || '6748b8f8e4b0a1b2c3d4e5f6';
      const tableId = localStorage.getItem('current_table_id');

      const orderData = {
        table: tableId,
        items: cartItems.map(item => ({
          menuItem: item._id || item.id,
          quantity: item.quantity,
          price: item.price
        })),
        orderType,
        paymentMethod
      };

      const result = await customerApi.createOrder(restaurantId, orderData);

      // Clear cart
      localStorage.removeItem('customer_cart');

      // Navigate to order tracking
      navigate(`/order?orderId=${result.orderId}`);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(30_25%_98%)] flex justify-center px-3 py-6 md:py-10">
      {/* Mobile = phone-like; Desktop = centered wide card */}
      <div className="w-full max-w-md md:max-w-lg bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden flex flex-col md:rounded-2xl">
        {/* Header */}
        <header className="flex items-center gap-3 px-4 py-3 border-b md:py-4">
          <button className="text-gray-600 text-xl leading-none">&lt;</button>
          <h1 className="text-base md:text-lg font-semibold text-gray-800">
            Checkout
          </h1>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-4 py-4 space-y-5 md:space-y-6">
          {/* Order Type */}
          <section className="bg-[hsl(30_25%_98%)] rounded-2xl p-4 shadow-sm">
            <h2 className="text-sm md:text-base font-semibold text-gray-700 mb-3">
              Order Type
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {/* DINE IN */}
              <button
                onClick={() => setOrderType("dinein")}
                className={`flex flex-col items-center justify-center rounded-2xl border px-3 py-3 text-xs md:text-sm font-medium transition ${orderType === "dinein"
                    ? "border-orange-400 bg-white text-orange-500 shadow-sm"
                    : "border-gray-200 bg-transparent text-gray-600"
                  }`}
              >
                <span className="text-xl md:text-2xl mb-1">🍽️</span>
                <span>Dine In</span>
              </button>

              {/* TAKEAWAY */}
              <button
                onClick={() => setOrderType("takeaway")}
                className={`flex flex-col items-center justify-center rounded-2xl border px-3 py-3 text-xs md:text-sm font-medium transition ${orderType === "takeaway"
                    ? "border-orange-400 bg-white text-orange-500 shadow-sm"
                    : "border-gray-200 bg-transparent text-gray-600"
                  }`}
              >
                <span className="text-xl md:text-2xl mb-1">🛍️</span>
                <span>Takeaway</span>
              </button>
            </div>
          </section>

          {/* Payment Method */}
          <section className="bg-[hsl(30_25%_98%)] rounded-2xl p-4 shadow-sm">
            <h2 className="text-sm md:text-base font-semibold text-gray-700 mb-3">
              Payment Method
            </h2>

            <div className="space-y-2">
              {/* UPI */}
              <button
                onClick={() => setPaymentMethod("upi")}
                className={`w-full flex items-center justify-between rounded-2xl border px-3 py-3 text-sm md:text-base transition ${paymentMethod === "upi"
                    ? "border-orange-400 bg-white text-orange-500 shadow-sm"
                    : "border-gray-200 bg-white text-gray-700"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg md:text-xl">📱</span>
                  <span>UPI / Google Pay</span>
                </div>
                <span
                  className={`w-4 h-4 rounded-full border-2 ${paymentMethod === "upi"
                      ? "border-orange-500 bg-orange-500"
                      : "border-gray-300"
                    }`}
                />
              </button>

              {/* CARD */}
              <button
                onClick={() => setPaymentMethod("card")}
                className={`w-full flex items-center justify-between rounded-2xl border px-3 py-3 text-sm md:text-base transition ${paymentMethod === "card"
                    ? "border-orange-400 bg-white text-orange-500 shadow-sm"
                    : "border-gray-200 bg-white text-gray-700"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg md:text-xl">💳</span>
                  <span>Credit / Debit Card</span>
                </div>
                <span
                  className={`w-4 h-4 rounded-full border-2 ${paymentMethod === "card"
                      ? "border-orange-500 bg-orange-500"
                      : "border-gray-300"
                    }`}
                />
              </button>

              {/* COD */}
              <button
                onClick={() => setPaymentMethod("cod")}
                className={`w-full flex items-center justify-between rounded-2xl border px-3 py-3 text-sm md:text-base transition ${paymentMethod === "cod"
                    ? "border-orange-400 bg-white text-orange-500 shadow-sm"
                    : "border-gray-200 bg-white text-gray-700"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg md:text-xl">💵</span>
                  <span>Cash on Delivery</span>
                </div>
                <span
                  className={`w-4 h-4 rounded-full border-2 ${paymentMethod === "cod"
                      ? "border-orange-500 bg-orange-500"
                      : "border-gray-300"
                    }`}
                />
              </button>
            </div>
          </section>

          {/* Order Summary */}
          <section className="bg-[hsl(30_25%_98%)] rounded-2xl p-4 shadow-sm">
            <h2 className="text-sm md:text-base font-semibold text-gray-700 mb-3">
              Order Summary
            </h2>

            <div className="bg-white rounded-2xl border border-gray-100 divide-y text-sm md:text-base">
              {cartItems.map((item, index) => (
                <div key={item.id} className="flex justify-between items-center px-3 py-3">
                  <span>{item.name} x{item.quantity}</span>
                  <span className="font-medium">₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="px-3 py-2 flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="px-3 py-2 flex justify-between text-gray-500">
                <span>Taxes</span>
                <span>₹{tax}</span>
              </div>
              <div className="px-3 py-3 flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
          </section>
        </main>

        {/* Bottom Action */}
        <footer className="px-4 pb-5 pt-2 md:pb-6">
          <button
            onClick={placeOrder}
            disabled={loading || cartItems.length === 0}
            className="w-full rounded-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-3 md:py-4 text-sm md:text-base shadow-md disabled:cursor-not-allowed"
          >
            {loading ? 'Placing Order...' : `Place Order · ₹${total}`}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default CheckoutPage;
