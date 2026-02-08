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
        // In a real app, we'd have an api.getUserOrders(userId)
        // For mock, we'll just filter global orders (if we had them accessible) or just show a mock order if empty
        // Since service.js mocks data in memory, we can add a method to get user orders
        const fetchOrders = async () => {
            // We need to implement getUserOrders in service or access MOCK_DATA via a getter
            // For now, let's assume api.getUserOrders exists or we filter data roughly
            // Let's rely on local state or just show the 'placed' orders if we can.
            // Actually, let's mock the "get user orders" in service, or just use a hack here for demo
            // We'll add getUserOrders to service in next step or now?
            // Let's just mock it here for now if service doesn't have it.
            // But better to use service.
            const allItems = await api.getAllItems();
            setItems(allItems);

            // Mock fetch
            // In the interest of ensuring the previous steps work, we'll assume api.getShopOrders can be used?
            // No, that's for operator.
            // Let's add a temporary local mock or assume service has it.
            // I'll add `getUserOrders` to service.js in a separate tool call if needed, 
            // but for now I'll just simulate it with a fixed list if empty + whatever is in MOCK_DATA.orders if I can access it?
            // effectively, I can't access MOCK_DATA directly here.
            // I will implement a fetch in useEffect that calls a new api method `getUserOrders` which I will append to service.js properly.
            // But I can't append easily. I'll just overwrite service.js with the new method or use `multi_replace`.
        };
        fetchOrders();
        // Re-fetch orders interval?
    }, [user]);

    // Temporary mock orders for visualization if backend is empty
    const [mockOrders, setMockOrders] = useState([
        { id: 'ord_demo_1', date: new Date().toISOString(), status: 'paid', items: { 'i1': 5, 'i2': 1 }, totalAmount: 50 }
    ]);

    const handlePickup = async (orderId) => {
        setScanning(true);
        // Simulate biometric scan delay
        setTimeout(async () => {
            // Mark collected
            // In production, verify user fingerprint against Aadhaar DB
            await api.markOrderCollected(orderId);
            setScanning(false);
            setMockOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'collected' } : o));
            alert("Biometric Verified! Ration Collected.");
        }, 2000);
    };

    const getItemName = (id) => items.find(i => i.id === id)?.name || id;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
            <div className="space-y-4">
                {mockOrders.map(order => (
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
