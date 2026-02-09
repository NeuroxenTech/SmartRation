import { MOCK_DATA } from './data';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
    login: async (identifier, password) => {
        await delay(800);
        // Admin/Operator login by username
        let user = MOCK_DATA.users.find(u => u.username === identifier && u.password === password);
        if (user) return { success: true, user };

        // Citizen login by Ration Card Number (simulated OTP flow just checks existence)
        // For demo, we accept any "OTP" if the card number exists
        user = MOCK_DATA.users.find(u => u.rationCardNumber === identifier);
        if (user) return { success: true, user };

        return { success: false, message: "Invalid credentials" };
    },

    getAllItems: async () => {
        return MOCK_DATA.items;
    },

    getUser: async (id) => {
        await delay(200);
        return MOCK_DATA.users.find(u => u.id === id);
    },

    getShop: async (shopId) => {
        await delay(300);
        return MOCK_DATA.shops.find(s => s.id === shopId);
    },

    getEntitlements: async (cardType) => {
        return MOCK_DATA.entitlements[cardType] || {};
    },

    getSlots: async (shopId) => {
        await delay(400);
        return MOCK_DATA.slots.filter(s => s.shopId === shopId);
    },

    bookSlot: async (userId, slotId) => {
        await delay(600);
        const slot = MOCK_DATA.slots.find(s => s.id === slotId);
        if (!slot) return { success: false, message: "Slot not found" };
        if (slot.booked >= slot.capacity) return { success: false, message: "Slot full" };

        // Check if user already has a pending slot
        // For demo simplicity, just allow booking
        slot.booked += 1;
        // We should record this booking somewhere, maybe mostly for Operator view
        // In MOCK_DATA structure, we might need a separate bookings array or put it in orders
        return { success: true, message: "Slot booked successfully" };
    },

    placeOrder: async (orderRequest) => {
        // orderRequest: { userId, shopId, items: {itemId: qty}, totalAmount }
        await delay(1000); // Simulate payment processing
        const newOrder = {
            id: `ord${Date.now()}`,
            status: 'paid', // Assumes mock payment success
            date: new Date().toISOString(),
            ...orderRequest
        };
        MOCK_DATA.orders.push(newOrder);

        // Deduct stock (Simulated)
        const shop = MOCK_DATA.shops.find(s => s.id === orderRequest.shopId);
        if (shop) {
            Object.entries(orderRequest.items).forEach(([itemId, qty]) => {
                if (shop.stock[itemId] >= qty) {
                    shop.stock[itemId] -= qty;
                }
            });
        }

        return { success: true, order: newOrder };
    },

    // Operator Actions
    getShopOrders: async (shopId) => {
        await delay(500);
        return MOCK_DATA.orders.filter(o => o.shopId === shopId);
    },

    getUserOrders: async (userId) => {
        await delay(500);
        return MOCK_DATA.orders.filter(o => o.userId === userId);
    },

    markOrderCollected: async (orderId) => {
        await delay(500);
        const order = MOCK_DATA.orders.find(o => o.id === orderId);
        if (order) {
            order.status = 'collected';
            return { success: true };
        }
        return { success: false, message: "Order not found" };
    }
};
