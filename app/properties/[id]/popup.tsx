"use client"


import React, { useState } from 'react';
import { updateStatus } from './UpdateStatusButton';

interface StatusUpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStatusChange: (newStatus: 'ACTIVE' | 'RESERVED' | 'COMPLETED') => void;
}

const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({ isOpen, onClose, onStatusChange }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-neutral-800 p-4 rounded shadow">
                <h4 className="text-lg font-bold">Update Home Status</h4>
                <div className="space-y-4 mt-4">
                    <button onClick={() => onStatusChange('ACTIVE')} className="block w-full text-center py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Active</button>
                    <button onClick={() => onStatusChange('RESERVED')} className="block w-full text-center py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">Reserved</button>
                    <button onClick={() => onStatusChange('COMPLETED')} className="block w-full text-center py-2 bg-green-500 text-white rounded hover:bg-green-600">Completed</button>
                    <button onClick={onClose} className="block w-full text-center py-2 bg-gray-300 text-black rounded hover:bg-gray-400">Close</button>
                </div>
            </div>
        </div>
    );
};

interface ProductPageProps {
    productId: number;
}

const PropertiesPage: React.FC<ProductPageProps> = ({ productId }) => {
    const [isModalOpen, setModalOpen] = useState(false);

    const handleStatusChange = (newStatus: 'ACTIVE' | 'RESERVED' | 'COMPLETED') => {
        updateStatus(productId, newStatus);
        setModalOpen(false);
    };

    return (
        <div>
            <button onClick={() => setModalOpen(true)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Update</button>
            <StatusUpdateModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onStatusChange={handleStatusChange}
            />
        </div>
    );
};

export default PropertiesPage;
