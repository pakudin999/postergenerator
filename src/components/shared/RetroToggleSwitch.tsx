import React from 'react';

interface RetroToggleSwitchProps {
    id: string;
    checked: boolean;
    onChange: () => void;
}

export const RetroToggleSwitch: React.FC<RetroToggleSwitchProps> = ({
    id,
    checked,
    onChange,
}) => {
    return (
        <div className="retro-toggle-container">
            <input
                type="checkbox"
                id={id}
                checked={checked}
                onChange={onChange}
                className="retro-toggle-checkbox"
            />
            <label htmlFor={id} className="retro-toggle-label">
                <span className="retro-toggle-button"></span>
            </label>
        </div>
    );
};
