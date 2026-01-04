import React, { ReactNode } from 'react';

interface InfoButtonProps {
    title: string;
    children: ReactNode;
}

export const InfoButton: React.FC<InfoButtonProps> = ({ title, children }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="info-button"
                aria-label="Information"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    ></div>
                    <div className="info-tooltip">
                        <h4 className="font-bold text-orange-400 mb-2">{title}</h4>
                        <div className="text-sm text-slate-300 space-y-2">{children}</div>
                    </div>
                </>
            )}
        </div>
    );
};
