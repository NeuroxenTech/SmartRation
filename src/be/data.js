export const MOCK_DATA = {
    users: [
        {
            id: "u1",
            role: "admin",
            username: "admin",
            password: "password", // In real app, hash this
            name: "System Admin"
        },
        {
            id: "u2",
            role: "operator",
            username: "operator",
            password: "password",
            shopId: "s1",
            name: "Raju Shopkeeper"
        },
        {
            id: "u3",
            role: "citizen",
            rationCardNumber: "1234567890",
            mobile: "9876543210",
            name: "Senthil Kumar",
            familyMembers: 4,
            shopId: "s1",
            cardType: "PHH" // Priority Household
        },
        {
            id: "u4",
            role: "citizen",
            rationCardNumber: "0987654321",
            mobile: "9123456780",
            name: "Lakshmi",
            familyMembers: 2,
            shopId: "s1",
            cardType: "NPHH"
        }
    ],

    shops: [
        {
            id: "s1",
            name: "FPS - 105 Washermanpet",
            location: "Chennai, TN",
            operatorId: "u2",
            stock: {
                "i1": 500, // Rice
                "i2": 200, // Sugar
                "i3": 300, // Wheat
                "i4": 100, // Oil
                "i5": 150, // Dal
                "i6": 50,  // Kerosene
                "i7": 100  // Urad Dal
            }
        }
    ],

    items: [
        { id: "i1", name: "Rice", unit: "kg", price: 0, image: "🌾" },
        { id: "i2", name: "Sugar", unit: "kg", price: 13.50, image: "🍬" },
        { id: "i3", name: "Wheat", unit: "kg", price: 0, image: "🌾" },
        { id: "i4", name: "Palm Oil", unit: "ltr", price: 25, image: "🛢️" },
        { id: "i5", name: "Toor Dal", unit: "kg", price: 30, image: "🥣" },
        { id: "i6", name: "Kerosene", unit: "ltr", price: 15, image: "⛽" },
        { id: "i7", name: "Urad Dal", unit: "kg", price: 30, image: "🥣" }
    ],

    entitlements: {
        "PHH": {
            "i1": 20, // 20kg Rice
            "i2": 2,  // 2kg Sugar
            "i3": 10,
            "i4": 1,
            "i5": 2,
            "i6": 2,
            "i7": 1
        },
        "NPHH": {
            "i1": 10,
            "i2": 1,
            "i3": 5,
            "i4": 1,
            "i5": 1,
            "i6": 1,
            "i7": 0
        }
    },

    slots: [
        // Pre-generated slots for next 3 days
        // Structure: { id, shopId, date, time: "09:00 - 10:00", capacity: 5, booked: 0 }
    ],

    orders: [], // { id, userId, shopId, items: {itemId: qty}, status: 'pending'|'ready'|'collected', date, paymentStatus: 'pending'|'paid' }

    smsLogs: []
};

// Helper to generate slots
const generateSlots = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 3; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        dates.push(d.toISOString().split('T')[0]);
    }

    const times = ["09:00-10:00", "10:00-11:00", "11:00-12:00", "14:00-15:00", "15:00-16:00", "16:00-17:00"];
    let slotId = 1;

    dates.forEach(date => {
        times.forEach(time => {
            MOCK_DATA.slots.push({
                id: `sl${slotId++}`,
                shopId: "s1",
                date: date,
                time: time,
                capacity: 5,
                booked: 0
            });
        });
    });
};

generateSlots();
