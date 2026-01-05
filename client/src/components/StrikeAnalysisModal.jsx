import React from 'react';

export default function StrikeAnalysisModal({ strike, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
            <div className="bg-[#111] p-6 rounded">
                <div className="font-mono mb-4">
                    Strike: {strike?.strike_price}
                </div>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}
