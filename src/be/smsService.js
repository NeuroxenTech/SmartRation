import { MOCK_DATA } from './data';

const MENU_TEXT = `Welcome to Ration Service / நியாய விலை கடை சேவை
1. View Entitlements / உரிமை விவரம்
2. Check Balance / இருப்பு நிலை
3. Book Slot / நேரம் முன்பதிவு
4. Check Shop Stock / கடை பொருள் நிலை

Reply with number`;

export const processSms = async (mobile, message) => {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 500));

    const user = MOCK_DATA.users.find(u => u.mobile === mobile);
    const text = message.trim();

    if (!user) {
        return "Error: Mobile number not registered. / பதிவு செய்யப்படாத எண்.";
    }

    // Main Menu Trigger
    if (text.toUpperCase() === 'HI' || text.toUpperCase() === 'HELLO' || text.toUpperCase() === 'MENU') {
        return MENU_TEXT;
    }

    // Option 1: Entitlements
    if (text === '1') {
        const ent = MOCK_DATA.entitlements[user.cardType];
        let reply = "Your Entitlements / உங்கள் உரிமைகள்:\n";
        const items = MOCK_DATA.items;
        Object.entries(ent).forEach(([iid, qty]) => {
            const item = items.find(i => i.id === iid);
            reply += `${item.name}: ${qty}${item.unit}\n`;
        });
        return reply;
    }

    // Option 2: Balance (For demo, same as entitlements as we don't track collected per month in simple mock yet)
    if (text === '2') {
        // Simplified: Assume strictly full balance for demo
        return "Remaining Balance / மீதமுள்ள அளவு:\nSame as Entitlements (Demo)\nபார்க்கவும் விருப்பம் 1";
    }

    // Option 3: Book Slot
    if (text === '3') {
        // Find next available slot
        const slots = MOCK_DATA.slots.filter(s => s.shopId === user.shopId && s.booked < s.capacity);
        if (slots.length === 0) return "No slots available. / நேரம் இல்லை.";
        const slot = slots[0];
        // Auto book first available
        slot.booked += 1;
        return `Slot Booked / முன்பதிவு செய்யப்பட்டது:\nDate: ${slot.date}\nTime: ${slot.time}\nShop: ${user.shopId}`;
    }

    // Option 4: Shop Stock
    if (text === '4') {
        const shop = MOCK_DATA.shops.find(s => s.id === user.shopId);
        let reply = "Shop Stock / கடை இருப்பு:\n";
        const items = MOCK_DATA.items;
        Object.entries(shop.stock).forEach(([iid, qty]) => {
            const item = items.find(i => i.id === iid);
            reply += `${item.name}: ${qty}\n`;
        });
        return reply;
    }

    return "Invalid Option. Type 'HI' for Menu. / தவறான பதிவு. 'HI' என டைப் செய்யவும்.";
};
