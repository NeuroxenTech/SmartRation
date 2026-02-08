import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../be/service';
import { Card, Badge } from '../../components/ui';

export default function CitizenDashboard() {
    const { user } = useAuth();
    const [entitlements, setEntitlements] = useState({});
    const [items, setItems] = useState([]);
    const [shop, setShop] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [entData, itemsData, shopData] = await Promise.all([
                    api.getEntitlements(user.cardType),
                    api.getAllItems(),
                    api.getShop(user.shopId)
                ]);
                setEntitlements(entData);
                setItems(itemsData);
                setShop(shopData);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchData();
    }, [user]);

    if (loading) return <div className="p-4 text-center">Loading dashboard...</div>;

    const getItemName = (id) => items.find(i => i.id === id)?.name || id;
    const getItemImage = (id) => items.find(i => i.id === id)?.image || '📦';
    const getItemUnit = (id) => items.find(i => i.id === id)?.unit || '';

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">My Entitlements</h2>
                    <p className="text-sm text-gray-500">Card Type: <span className="font-semibold text-blue-600">{user.cardType}</span></p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Assigned Shop</p>
                    <p className="font-medium">{shop?.name}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(entitlements).map(([itemId, qty]) => (
                    <Card key={itemId} className="flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="text-3xl bg-gray-50 p-2 rounded-full">{getItemImage(itemId)}</div>
                            <Badge variant="success">Available</Badge>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">{getItemName(itemId)}</h3>
                            <div className="flex justify-between items-end mt-2">
                                <div>
                                    <p className="text-xs text-gray-500">Monthly Quota</p>
                                    <p className="text-xl font-bold text-gray-800">{qty} <span className="text-sm font-normal text-gray-500">{getItemUnit(itemId)}</span></p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Collected:</span>
                                <span className="font-medium">0 {getItemUnit(itemId)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '0%' }}></div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Recent Activity or Shop Status could go here */}
            <Card>
                <h3 className="font-semibold mb-4">Shop Status</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(shop?.stock || {}).map(([itemId, qty]) => (
                        <div key={itemId} className="text-center p-2 bg-gray-50 rounded-md">
                            <p className="text-xs text-gray-500">{getItemName(itemId)}</p>
                            <p className={`font-bold ${qty < 50 ? 'text-red-500' : 'text-green-600'}`}>
                                {qty < 50 ? 'Low Stock' : 'In Stock'}
                            </p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
