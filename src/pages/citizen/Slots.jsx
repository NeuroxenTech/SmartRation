import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../be/service';
import { Card, Button, Badge } from '../../components/ui';
import { Calendar, Clock, CheckCircle } from 'lucide-react';

export default function Slots() {
    const { user } = useAuth();
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const data = await api.getSlots(user.shopId);
                setSlots(data);
            } catch (err) {
                console.error("Failed to fetch slots", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSlots();
    }, [user]);

    const handleBook = async () => {
        if (!selectedSlot) return;
        const res = await api.bookSlot(user.id, selectedSlot.id);
        if (res.success) {
            setBookingSuccess(true);
            // Refresh slots
            const data = await api.getSlots(user.shopId);
            setSlots(data);
        } else {
            alert(res.message);
        }
    };

    // Group slots by date
    const groupedSlots = slots.reduce((acc, slot) => {
        if (!acc[slot.date]) acc[slot.date] = [];
        acc[slot.date].push(slot);
        return acc;
    }, {});

    if (bookingSuccess) {
        return (
            <div className="text-center p-10 max-w-lg mx-auto">
                <div className="bg-green-100 text-green-800 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-6">
                    <CheckCircle size={40} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Slot Booked!</h2>
                <p className="text-gray-600 mt-2">Your visit is confirmed for:</p>
                <Card className="mt-6 p-6">
                    <p className="text-lg font-semibold">{new Date(selectedSlot.date).toLocaleDateString()}</p>
                    <p className="text-xl font-bold text-blue-600">{selectedSlot.time}</p>
                </Card>
                <Button className="mt-8" onClick={() => { setBookingSuccess(false); setSelectedSlot(null); }}>
                    Book Another
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Book a Time Slot</h2>
                    <p className="text-sm text-gray-500">Avoid queues by booking a visit time.</p>
                </div>
            </div>

            <div className="space-y-8">
                {Object.entries(groupedSlots).map(([date, dateSlots]) => (
                    <div key={date}>
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                            <Calendar size={18} />
                            {new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {dateSlots.map(slot => {
                                const isFull = slot.booked >= slot.capacity;
                                const isSelected = selectedSlot?.id === slot.id;
                                return (
                                    <button
                                        key={slot.id}
                                        disabled={isFull}
                                        onClick={() => setSelectedSlot(slot)}
                                        className={`
                                p-3 rounded-lg border text-center transition-all
                                ${isSelected ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200 bg-white hover:border-blue-300'}
                                ${isFull ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'cursor-pointer'}
                            `}
                                    >
                                        <div className="text-sm font-medium mb-1">{slot.time}</div>
                                        <div className={`text-xs ${isFull ? 'text-red-500' : 'text-green-600'}`}>
                                            {isFull ? 'Full' : `${slot.capacity - slot.booked} Left`}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="sticky bottom-4 bg-white p-4 shadow-lg rounded-lg border border-gray-200 flex justify-between items-center">
                <div>
                    {selectedSlot ? (
                        <div>
                            <p className="text-sm text-gray-500">Selected</p>
                            <p className="font-bold">{selectedSlot.time} on {new Date(selectedSlot.date).toLocaleDateString()}</p>
                        </div>
                    ) : (
                        <p className="text-gray-500">Select a slot to proceed</p>
                    )}
                </div>
                <Button disabled={!selectedSlot} onClick={handleBook}>Confirm Booking</Button>
            </div>
        </div>
    );
}
