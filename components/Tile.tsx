// Represents a single tile in the grid
export default function Tile ({ letter = '', state = 'empty', isFlipping = false, isShaking = false }){
    const stateClasses = {
        empty: 'border-neutral-500', // Use a slightly darker border for empty
        typing: 'border-neutral-400',
        correct: 'bg-green-500 border-green-500 text-white',
        present: 'bg-yellow-500 border-yellow-500 text-white',
        absent: 'bg-neutral-600 border-neutral-600 text-white', // Dark gray/brown equivalent
    };

    // Base classes for all tiles
    const baseClasses = "w-12 h-12 border-2 xl:w-26 xl:h-26 lg:w-20 lg:h-20 flex items-center justify-center text-3xl sm:text-4xl font-bold uppercase transition-all duration-300 ease-in-out rounded-2xl ";
    // Animation classes

    return (
        <div className={`${baseClasses} ${stateClasses[state]}`}>
            {letter}
        </div>
    );
};
