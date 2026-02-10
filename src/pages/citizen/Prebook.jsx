import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../be/service';
import { Card, Button, Badge } from '../../components/ui';
import { ShoppingCart, Plus, Minus, CreditCard } from 'lucide-react';

export default function Prebook() {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [cart, setCart] = useState({});
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const itemsData = await api.getAllItems();
                setItems(itemsData);
            } catch (error) {
                console.error("Failed to load items", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const updateCart = (itemId, change) => {
        setCart(prev => {
            const current = prev[itemId] || 0;
            const newItemQty = Math.max(0, current + change); // No negative
            // In real app, check against entitlement limit here!
            return { ...prev, [itemId]: newItemQty };
        });
    };

    const calculateTotal = () => {
        return Object.entries(cart).reduce((total, [itemId, qty]) => {
            const item = items.find(i => i.id === itemId);
            return total + (item ? item.price * qty : 0);
        }, 0);
    };

    const handleRazorpayPayment = async () => {
        setProcessing(true);
        try {
            const orderItems = Object.fromEntries(
                Object.entries(cart).filter(([_, qty]) => qty > 0)
            );

            if (Object.keys(orderItems).length === 0) return;

            const total = calculateTotal();

            // 1. Create Order
            const orderRes = await api.createRazorpayOrder(total);

            const rzpKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
            if (!rzpKey) {
                alert("Configuration Error: Razorpay Key ID is not found. Please restart the development server for changes to take effect.");
                setProcessing(false);
                return;
            }

            if (!window.Razorpay) {
                alert("Razorpay SDK not loaded. Please check your internet connection.");
                setProcessing(false);
                return;
            }

            const options = {
                key: rzpKey,
                amount: orderRes.amount,
                currency: orderRes.currency,
                name: "SmartRation",
                description: "Ration Pre-booking Transaction",
                // order_id: orderRes.id, // Commented out: Mock Order ID is not valid on real Razorpay. Using standard checkout.
                handler: async function (response) {
                    try {
                        // 2. Verify Payment (Mock)
                        await api.verifyPayment(
                            response.razorpay_payment_id,
                            response.razorpay_order_id,
                            response.razorpay_signature
                        );

                        // 3. Place Order in System
                        const res = await api.placeOrder({
                            userId: user.id,
                            shopId: user.shopId,
                            items: orderItems,
                            totalAmount: total,
                            paymentId: response.razorpay_payment_id,
                            orderId: response.razorpay_order_id
                        });

                        if (res.success) {
                            setOrderSuccess(res.order);
                            setCart({});
                        }
                    } catch (err) {
                        alert("Payment verification failed: " + err.message);
                    } finally {
                        setProcessing(false);
                    }
                },
                prefill: {
                    name: user.name,
                    contact: user.mobile || "9999999999" // Mock contact
                },
                theme: {
                    color: "#3399cc"
                },
                modal: {
                    ondismiss: function () {
                        setProcessing(false); // Reset processing if modal is dismissed
                    }
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                alert("Payment Failed: " + response.error.description);
                setProcessing(false);
            });
            rzp1.open();

        } catch (err) {
            console.error("Order initiation failed", err);
            alert("Failed to initiate payment");
            setProcessing(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    if (orderSuccess) {
        return (
            <div className="max-w-md mx-auto text-center space-y-6 pt-10">
                <div className="bg-green-100 text-green-800 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center text-4xl">
                    ✅
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Payment Successful!</h2>
                <p className="text-gray-600">Your mock order has been confirmed.</p>
                <Card className="text-left space-y-2">
                    <p><strong>Order ID:</strong> {orderSuccess.id}</p>
                    <p><strong>Date:</strong> {new Date(orderSuccess.date).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> <Badge variant="success">Paid</Badge></p>
                    {orderSuccess.paymentId && <p className="text-xs text-gray-500">Ref: {orderSuccess.paymentId}</p>}
                </Card>
                <Button onClick={() => setOrderSuccess(null)}>Place Another Order</Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Pre-book Ration</h2>
            <p className="text-gray-500">Select items to pre-order and pick up at the shop.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Items List */}
                <div className="md:col-span-2 space-y-4">
                    {items.map(item => (
                        <Card key={item.id} className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="text-2xl bg-gray-50 p-2 rounded-md">{item.image}</div>
                                <div>
                                    <h3 className="font-semibold">{item.name}</h3>
                                    <p className="text-sm text-gray-500">₹{item.price} / {item.unit}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => updateCart(item.id, -1)}
                                    className="p-1 rounded-md bg-gray-100 hover:bg-gray-200"
                                    disabled={!cart[item.id]}
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="w-8 text-center font-medium">{cart[item.id] || 0}</span>
                                <button
                                    onClick={() => updateCart(item.id, 1)}
                                    className="p-1 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Cart Summary */}
                <div className="md:col-span-1">
                    <Card className="sticky top-20">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <ShoppingCart size={20} /> Cart Summary
                        </h3>
                        {Object.keys(cart).length === 0 && <p className="text-gray-400 text-sm">Cart is empty</p>}

                        <div className="space-y-2 mb-4">
                            {Object.entries(cart).map(([itemId, qty]) => {
                                if (qty === 0) return null;
                                const item = items.find(i => i.id === itemId);
                                return (
                                    <div key={itemId} className="flex justify-between text-sm">
                                        <span>{item?.name} x {qty}</span>
                                        <span>₹{(item?.price * qty).toFixed(2)}</span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="border-t pt-4 mt-4">
                            <div className="flex justify-between font-bold text-lg mb-4">
                                <span>Total</span>
                                <span>₹{calculateTotal().toFixed(2)}</span>
                            </div>
                            <Button
                                onClick={handleRazorpayPayment}
                                className="w-full bg-blue-600 hover:bg-blue-700"
                                disabled={calculateTotal() === 0 || processing}
                            >
                                {processing ? 'Processing...' : 'Pay with Razorpay'}
                            </Button>
                            <p className="text-xs text-center text-gray-400 mt-2">
                                <CreditCard size={12} className="inline mr-1" />
                                Secure Payment by Razorpay
                            </p>
                            <p className="text-[10px] text-center text-red-400 mt-1">
                                Note: If payment fails or takes too long, please try disabling AdBlocker.
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
