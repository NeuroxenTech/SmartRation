import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../be/service';
import { Card, Badge } from '../../components/ui';
import { Package, RefreshCw } from 'lucide-react';

export default function Stock() {
    const { user } = useAuth();
    const [shop, setShop] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [shopData, itemsData] = await Promise.all([
                api.getShop(user.shopId),
                api.getAllItems()
            ]);
            setShop(shopData);
            setItems(itemsData);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchData();
    }, [user]);

    if (loading) return <div className="p-8 text-center">Loading stock details...</div>;
    if (!shop) return <div className="p-8 text-center text-red-500">Shop details not found.</div>;

    const getItemDetails = (id) => items.find(i => i.id === id);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Shop Stock Status</h2>
                    <p className="text-sm text-gray-500">
                        Current availability at <strong>{shop.name}</strong>
                    </p>
                </div>
                <button
                    onClick={fetchData}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="Refresh Stock"
                >
                    <RefreshCw size={20} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(shop.stock).map(([itemId, quantity]) => {
                    const item = getItemDetails(itemId);
                    if (!item) return null;

                    const getStatusColor = (qty) => {
                        if (qty === 0) return 'bg-red-100 text-red-700 border-red-200';
                        if (qty < 50) return 'bg-orange-100 text-orange-700 border-orange-200';
                        return 'bg-green-100 text-green-700 border-green-200';
                    };

                    return (
                        <Card key={itemId} className="flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="text-3xl bg-gray-50 w-12 h-12 flex items-center justify-center rounded-full">
                                        {item.image}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">{item.name}</h3>
                                        <p className="text-xs text-gray-500">Unit: {item.unit}</p>
                                    </div>
                                </div>
                                <Badge variant={quantity > 0 ? 'success' : 'destructive'} size="sm">
                                    {quantity > 0 ? 'Available' : 'Out of Stock'}
                                </Badge>
                            </div>

                            <div className={`p-3 rounded-lg border text-center ${getStatusColor(quantity)}`}>
                                <p className="text-xs uppercase font-semibold opacity-70">Current Stock</p>
                                <p className="text-2xl font-bold">
                                    {quantity} <span className="text-sm font-normal">{item.unit}</span>
                                </p>
                            </div>
                        </Card>
                    );
                })}
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800 flex items-start gap-3">
                <Package className="shrink-0 mt-0.5" size={18} />
                <p>
                    Stock levels are updated in real-time as distribution happens.
                    Always check the stock status before visiting the Ration Shop to avoid inconvenience.
                </p>
            </div>
        </div>
    );
}
