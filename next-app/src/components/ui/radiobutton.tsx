import React from "react";

interface RadioButton {
    label: string;
    options: string[];
    selectedValue: string;
    onChange: (value: string) => void;
}

export default function CustomRadioGroup({
    label,
    options,
    selectedValue,
    onChange,
}: RadioButton) {
    const handleToggle = (value: string) => {
        // kalau nilai sama, maka hapus (nonaktif)
        onChange(selectedValue === value ? "" : value);
    };

    return (
        <div className="space-y-2">
            <p className="font-medium text-gray-700">{label}</p>
            <div className="flex flex-wrap gap-3">
                {options.map((option) => (
                    <div
                        key={option}
                        onClick={() => handleToggle(option)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-colors ${
                            selectedValue === option
                                ? "bg-blue-100 border-blue-600 text-blue-700"
                                : "border-gray-300 text-gray-700 hover:border-gray-400"
                        }`}
                    >
                        <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                selectedValue === option
                                    ? "border-blue-600"
                                    : "border-gray-400"
                            }`}
                        >
                            {selectedValue === option && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full" />
                            )}
                        </div>
                        <span className="text-sm">{option}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
