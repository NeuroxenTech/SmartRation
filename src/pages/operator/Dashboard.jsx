import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../be/service';
import { Card } from '../../components/ui';

export default function OperatorDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ orders: 0, slots: 0, stockLow: 0 });

    useEffect(() => {
        const fetchData = async () => {
            // Mock stats fetching
            const orders = await api.getShopOrders(user.shopId);
            const slots = await api.getSlots(user.shopId);
            const shop = await api.getShop(user.shopId);

            const pendingOrders = orders.filter(o => o.status === 'paid').length;
            const bookedSlots = slots.reduce((acc, s) => acc + s.booked, 0);
            // Count items with stock < 50
            const lowStock = Object.values(shop?.stock || {}).filter(q => q < 50).length;

            setStats({ orders: pendingOrders, slots: bookedSlots, stockLow: lowStock });
        };
        if (user) fetchData();
    }, [user]);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Shop Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-blue-50 border-blue-100">
                    <h3 className="text-blue-800 font-semibold">Pending Orders</h3>
                    <p className="text-4xl font-bold text-blue-600 mt-2">{stats.orders}</p>
                </Card>
                <Card className="bg-purple-50 border-purple-100">
                    <h3 className="text-purple-800 font-semibold">Today's Slot Bookings</h3>
                    <p className="text-4xl font-bold text-purple-600 mt-2">{stats.slots}</p>
                </Card>
                <Card className="bg-orange-50 border-orange-100">
                    <h3 className="text-orange-800 font-semibold">Low Stock Items</h3>
                    <p className="text-4xl font-bold text-orange-600 mt-2">{stats.stockLow}</p>
                </Card>
            </div>
        </div>
    );
}
