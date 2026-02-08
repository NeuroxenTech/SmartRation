import React from 'react';
import { Card, Button, Badge } from '../../components/ui';

export default function Users() {
    const users = [
        { id: "u3", name: "Senthil Kumar", type: "Citizen (PHH)", card: "1234567890", shop: "s1" },
        { id: "u4", name: "Lakshmi", type: "Citizen (NPHH)", card: "0987654321", shop: "s1" },
        { id: "u2", name: "Raju Shopkeeper", type: "Operator", card: "-", shop: "s1" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Beneficiaries & Users</h2>
                <Button>+ Add Beneficiary</Button>
            </div>

            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role/Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Card No</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Shop</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((u) => (
                            <tr key={u.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.card}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.shop}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-900 cursor-pointer">
                                    Edit
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
