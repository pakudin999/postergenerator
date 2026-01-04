import React from 'react';

interface TextAreaInputProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    rows?: number;
    placeholder?: string;
}

export const TextAreaInput: React.FC<TextAreaInputProps> = ({
    label,
    name,
    value,
    onChange,
    rows = 4,
    placeholder = '',
}) => {
    return (
        <div className="form-group">
            <label htmlFor={name} className="form-label">
                {label}
            </label>
            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                rows={rows}
                placeholder={placeholder}
                className="form-textarea"
            />
        </div>
    );
};
