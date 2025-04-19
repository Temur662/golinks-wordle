import React from 'react'


// Represents a single key on the virtual keyboard
const Key = ({ value, status = 'default', isWide = false, onClick }) => {
    const statusClasses = {
        default: 'bg-gray-700 hover:bg-neutral-800', // Adjusted default key color
        correct: 'bg-green-500 text-white',
        present: 'bg-yellow-500 text-white',
        absent: 'bg-neutral-700 text-white', // Darker gray for absent keys
    };

    const widthClass = isWide ? 'col-span-2' : 'col-span-1'; // Use grid span for width

    return (
        <button
            className={`h-14  ${widthClass} text-white rounded flex items-center justify-center uppercase font-semibold cursor-pointer transition-colors duration-150 ${statusClasses[status]}`}
            onClick={() => onClick(value)}
        >
            {value === 'Backspace' ? '⌫' : value}
        </button>
    );
};

// Represents the virtual keyboard
export default function Keyboard ({ keyStates, onKeyPress }) {
    const layout = [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace']
    ];

    return (
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto justify-center">
            {layout.map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-10 justify-center w-full gap-1 my-0.5">
                    {/* Add padding for the middle row to align keys */}
                    {(rowIndex === 1) && <div className="w-4 sm:w-5"></div>}

                    {row.map(key => (
                        <Key
                            key={key}
                            value={key}
                            status={keyStates[key.toLowerCase()] || 'default'}
                            isWide={key === 'Enter'}
                            onClick={onKeyPress}
                        />
                    ))}


                </div>
            ))}
        </div>
    );
};
