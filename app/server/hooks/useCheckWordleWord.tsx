'use client'
import { useQuery } from "@tanstack/react-query"
import CheckWordleWord from "../CheckWordleGuess"
export const useCheckWordleWord = (guess : string) => {
    return useQuery({
        queryKey : ['Wordle Word'],
        queryFn: () => CheckWordleWord(guess)
    })
}