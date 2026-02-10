import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../be/service';
import { Card, Button, Badge } from '../../components/ui';
import { Fingerprint, CheckCircle, Package } from 'lucide-react';

export default function Orders() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [scanning, setScanning] = useState(false);
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const allItems = await api.getAllItems();
                setItems(allItems);

                const userOrders = await api.getUserOrders(user.id);
                setOrders(userOrders.sort((a, b) => new Date(b.date) - new Date(a.date)));
            } catch (err) {
                console.error("Failed to fetch orders", err);
            }
        };
        fetchOrders();
    }, [user]);

    const handlePickup = async (orderId) => {
        setScanning(true);
        // Simulate biometric scan delay
        setTimeout(async () => {
            // Mark collected
            await api.markOrderCollected(orderId);
            setScanning(false);
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'collected' } : o));
            alert("Biometric Verified! Ration Collected.");
        }, 2000);
    };

    const getItemName = (id) => items.find(i => i.id === id)?.name || id;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
            <div className="space-y-4">
                {orders.map(order => (
                    <Card key={order.id} className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <div>
                            <p className="font-bold text-lg">Order #{order.id}</p>
                            <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                            <div className="mt-2 text-sm">
                                {Object.entries(order.items).map(([iid, qty]) => (
                                    <span key={iid} className="mr-3 bg-gray-100 px-2 py-1 rounded">
                                        {getItemName(iid)}: {qty}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Badge variant={order.status === 'collected' ? 'success' : 'warning'}>
                                {order.status.toUpperCase()}
                            </Badge>
                            {order.status === 'paid' && (
                                <Button
                                    onClick={() => handlePickup(order.id)}
                                    disabled={scanning}
                                    className={`flex items-center gap-2 ${scanning ? 'animate-pulse' : ''}`}
                                >
                                    <Fingerprint size={20} />
                                    {scanning ? 'Scanning...' : 'Pickup (Biometric)'}
                                </Button>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
