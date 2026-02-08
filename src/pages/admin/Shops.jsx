import React from 'react';
import { Card, Button, Badge } from '../../components/ui';

export default function Shops() {
    // Mock data for demo
    const shops = [
        { id: "s1", name: "FPS - 105 Washermanpet", operator: "Raju Shopkeeper", status: "Active", stockLevel: "Good" },
        { id: "s2", name: "FPS - 108 Royapuram", operator: "Unassigned", status: "Inactive", stockLevel: "Empty" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Ration Shops</h2>
                <Button>+ Add New Shop</Button>
            </div>

            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shop ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operator</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {shops.map((shop) => (
                            <tr key={shop.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{shop.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shop.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shop.operator}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Badge variant={shop.status === 'Active' ? 'success' : 'default'}>{shop.status}</Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-900 cursor-pointer">
                                    Manage Stock
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
