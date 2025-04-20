import Tile from "./Tile";
// Represents a single row in the grid
export default function WordleRow ({ gameWin,  guess = '', feedback = [], wordLength = 5, isCurrentRow = false, currentGuess = '', rowIndex, shakeRowIndex }) {
    const letters = (isCurrentRow ? currentGuess : guess).padEnd(wordLength, ' ').split('');
    const isShaking = shakeRowIndex === rowIndex;

    return (
        <div className={`flex flex-row items-center justify-center gap-2`}>
            {letters.map((letter, index) => {
                let state = 'empty';
                if( isCurrentRow && gameWin ){
                    console.log('currentrow',isCurrentRow)
                    state = 'correct'
                }
                else if (isCurrentRow) {
                    if (letter !== ' ') state = 'typing';
                } else if (feedback && feedback[index]) {
                    state = feedback[index];
                }
                return (
                    <Tile
                        key={index}
                        letter={letter.trim()}
                        state={state}
                        isShaking={isShaking && !isCurrentRow}
                    />
                );
            })}
        </div>
    );
};
