import React from 'react';

interface LoadingModalProps {
    isOpen: boolean;
    title: string;
    message: string;
}

export const LoadingModal: React.FC<LoadingModalProps> = ({ isOpen, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="loading-modal-content">
                <div className="loading-spinner"></div>
                <h3 className="loading-title">{title}</h3>
                <p className="loading-message">{message}</p>
            </div>
        </div>
    );
};
