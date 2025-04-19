'use client'
import Keyboard from "@/components/KeyBoard";
import WordleRow from "@/components/WordleRow";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useGetWordleWord } from "./server/hooks/useGetWordleWord";

//Constants 
const WORD_LENGTH = 5;
const MAX_TRIES = 6;
const FLIP_ANIMATION_DURATION = 600;
const DELAY_BETWEEN_FLIPS = 300; 

// Calculates feedback for a guess compared to the secret word
const calculateFeedback = (guess : string, secretWord : string) => {
  const feedback = Array(WORD_LENGTH).fill('absent');
  const secretLetters = secretWord.split('');
  const guessLetters = guess.split('');
  const usedSecretIndices = new Set();

  // First pass: Check for correct letters (Green)
  for (let i = 0; i < WORD_LENGTH; i++) {
      if (guessLetters[i] === secretLetters[i]) {
          feedback[i] = 'correct';
          usedSecretIndices.add(i);
      }
  }

  // Second pass: Check for present letters (Yellow)
  for (let i = 0; i < WORD_LENGTH; i++) {
      if (feedback[i] !== 'correct') {
          const letterIndex = secretLetters.findIndex(
              (secretLetter, index) => !usedSecretIndices.has(index) && secretLetter === guessLetters[i]
          );
          if (letterIndex !== -1) {
              feedback[i] = 'present';
              usedSecretIndices.add(letterIndex);
          }
      }
  }
  return feedback;
};

export default function Home() {
  // State 
  const [secretWord, setSecretWord] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]); // Array of guess strings
  const [feedbackList, setFeedbackList] = useState<string[]>([]); // Array of feedback arrays
  const [currentGuess, setCurrentGuess] = useState('');
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [keyStates, setKeyStates] = useState({}); // { q: 'absent', w: 'present', ... }
  const [message, setMessage] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // To disable input during animation/submit
  const [shakeRowIndex, setShakeRowIndex] = useState(null); // Index of row to shake
  //const { data : word, isLoading } = useGetWordleWord()
  // Effect for handling physical keyboard input
  useEffect(() => {
  const handleKeyDown = (event) => {
      if (isProcessing || isGameOver) return;

      const key = event.key.toLowerCase();

      if (key === 'enter') {
          handleEnter();
      } else if (key === 'backspace') {
          handleBackspace();
      } else if (key.length === 1 && key >= 'a' && key <= 'z') {
          handleLetter(key);
      }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isProcessing, isGameOver, currentGuess, guesses]);

  const handleLetter = useCallback((letter) => {
    if (currentGuess.length < WORD_LENGTH) {
        setCurrentGuess(prev => prev + letter);
    }
  }, [currentGuess]);

  const handleBackspace = useCallback(() => {
    setCurrentGuess(prev => prev.slice(0, -1));
  }, []);

  const handleEnter = useCallback(async () => {
    if (isProcessing || isGameOver) return;

    if (currentGuess.length !== WORD_LENGTH) {
        setMessage("Not enough letters!");
        setShakeRowIndex(currentRowIndex);
        return;
    }

    if (!validWords.has(currentGuess)) {
        setMessage("Not in word list!");
        setShakeRowIndex(currentRowIndex);
        return;
    }

    setIsProcessing(true); // Disable input
    setMessage(''); // Clear previous messages

    const feedback = calculateFeedback(currentGuess, secretWord);

    // --- Apply Flip Animation (Staggered) ---
    await new Promise(resolve => setTimeout(resolve, (FLIP_ANIMATION_DURATION + DELAY_BETWEEN_FLIPS) * WORD_LENGTH + 100));


    // Update guesses and feedback
    const newGuesses = [...guesses, currentGuess];
    const newFeedbackList = [...feedbackList, feedback];
    setGuesses(newGuesses);
    setFeedbackList(newFeedbackList);

    // Update keyboard states
    const newKeyStates = { ...keyStates };
    currentGuess.split('').forEach((letter, index) => {
        const currentStatus = newKeyStates[letter];
        const newStatus = feedback[index];
        // Determine best status: correct > present > absent
        if (newStatus === 'correct' || (newStatus === 'present' && currentStatus !== 'correct') || (newStatus === 'absent' && !currentStatus)) {
            newKeyStates[letter] = newStatus;
        } else if (!currentStatus) { // If no status yet, set to absent if applicable
            if (newStatus === 'absent') newKeyStates[letter] = 'absent';
        }
    });
    setKeyStates(newKeyStates);

    // Check win/loss condition
    if (currentGuess === secretWord) {
        setMessage("You Win!");
        setIsGameOver(true);
    } else if (newGuesses.length === MAX_TRIES) {
        setMessage(`Game Over! Word was: ${secretWord.toUpperCase()}`);
        setIsGameOver(true);
    } else {
        // Move to next row
        setCurrentRowIndex(prev => prev + 1);
        setCurrentGuess('');
        setIsProcessing(false); // Re-enable input
    }

    // If game ended, keep processing true to prevent further input until reset
    if (currentGuess === secretWord || newGuesses.length === MAX_TRIES) {
        // Keep isProcessing true or handle differently if needed
    } else {
        setIsProcessing(false); // Re-enable input for next guess
    }


  }, [currentGuess, secretWord, guesses, feedbackList, keyStates, isProcessing, isGameOver, currentRowIndex]);

  // Handler for virtual keyboard clicks
  const handleVirtualKeyPress = useCallback((key) => {
    if (isProcessing || isGameOver) return;
    const lowerKey = key.toLowerCase();

    if (lowerKey === 'enter') {
        handleEnter();
    } else if (lowerKey === 'backspace') {
        handleBackspace();
    } else if (lowerKey.length === 1 && lowerKey >= 'a' && lowerKey <= 'z') {
        handleLetter(lowerKey);
    }
  }, [handleEnter, handleBackspace, handleLetter, isProcessing, isGameOver]);



  return (
    <main className=" w-full h-screen flex flex-col space-y-10 items-center justify-center"
    style={{
      background : 'linear-gradient(to bottom, #4A3C3C, #8D6E63, #BCAAA4)'
    }}
    >
      {/* Header Bar */}
      <div className=" flex flex-row w-full justify-center items-center">
        <h1
        className=" text-white italic lg:text-5xl font-bold text-3xl"
        > 
          Wordle
        </h1>
      </div>
      
      <div className="max-w-xl w-full">
        <GameBoard 
          guesses={guesses}
          feedbackList={feedbackList}
          currentRowIndex={currentRowIndex}
          currentGuess={currentGuess}
          shakeRowIndex={shakeRowIndex}
        />
      </div>
      <div className="w-full flex items-center justify-center">
        <Keyboard keyStates={keyStates} onKeyPress={handleVirtualKeyPress} />
      </div>
    </main>
  );
}


// Represents the entire game grid
const GameBoard = ({ guesses, feedbackList, currentRowIndex, currentGuess, shakeRowIndex }) => {
  return (
      <div className="grid grid-rows-6 gap-1 mb-6 ">
          {Array.from({ length: MAX_TRIES }).map((_, i) => (
              <WordleRow
                  key={i}
                  rowIndex={i}
                  guess={guesses[i] || ''}
                  feedback={feedbackList[i] || []}
                  isCurrentRow={i === currentRowIndex}
                  currentGuess={currentGuess}
                  wordLength={WORD_LENGTH}
                  shakeRowIndex={shakeRowIndex}
              />
          ))}
      </div>
  );
};