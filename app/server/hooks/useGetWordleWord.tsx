'use client'
import { useQuery } from "@tanstack/react-query"
import GetWordleWord from "../GetWordleWord"
export const useGetWordleWord = (  ) => {
    return useQuery({
        queryKey : ['Wordle Word'],
        queryFn: () => GetWordleWord()
    })
}