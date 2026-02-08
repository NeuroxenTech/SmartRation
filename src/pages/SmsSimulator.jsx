import React, { useState } from 'react';
import { processSms } from '../be/smsService';
import { Card, Button, Input } from '../components/ui';
import { MessageSquare, Send } from 'lucide-react';

export default function SmsSimulator() {
    const [mobile, setMobile] = useState('9876543210'); // Default demo usage
    const [input, setInput] = useState('');
    const [logs, setLogs] = useState([]);
    const [sending, setSending] = useState(false);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { sender: 'user', text: input, time: new Date() };
        setLogs(prev => [...prev, userMsg]);
        setSending(true);
        setInput('');

        try {
            const response = await processSms(mobile, userMsg.text);
            const systemMsg = { sender: 'system', text: response, time: new Date() };
            setLogs(prev => [...prev, systemMsg]);
        } catch (err) {
            setLogs(prev => [...prev, { sender: 'system', text: "Error processing SMS", time: new Date() }]);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <Card className="w-full max-w-md h-[600px] flex flex-col p-0 overflow-hidden shadow-xl">
                <div className="bg-blue-600 p-4 text-white flex items-center justify-between">
                    <h2 className="font-bold flex items-center gap-2"><MessageSquare /> SMS Simulator</h2>
                    <div className="flex items-center gap-2 bg-blue-700 px-2 py-1 rounded text-xs">
                        <span>Mobile:</span>
                        <input
                            className="bg-transparent border-none text-white w-24 outline-none placeholder-blue-300"
                            value={mobile}
                            onChange={e => setMobile(e.target.value)}
                            placeholder="Mobile No"
                        />
                    </div>
                </div>

                <div className="flex-1 bg-gray-50 p-4 overflow-y-auto space-y-4">
                    <div className="text-center text-xs text-gray-400">Type 'HI' to start</div>
                    {logs.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-lg p-3 text-sm whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                                }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {sending && <div className="text-gray-400 text-xs ml-2">Taking to server...</div>}
                </div>

                <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 flex gap-2">
                    <Input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1"
                        autoFocus
                    />
                    <Button type="submit" disabled={sending} size="icon" className="px-3">
                        <Send size={18} />
                    </Button>
                </form>
            </Card>

            <div className="mt-4 text-gray-500 text-sm">
                <p>Try: <strong>9876543210</strong> (Registered PPH User)</p>
                <p>Commands: HI, 1, 2, 3, 4</p>
            </div>
        </div>
    );
}
