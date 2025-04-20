'use server'
import React from 'react'
export default async function CheckWordleWord(guess : string, offset? : number) {
    // Wordle .txt answers list from cfreshman github
    const url = 'https://wordle-game-api1.p.rapidapi.com/guess';
    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': '28e354df00msh16df585736a6623p1f5c11jsnbce2d27c318f',
            'x-rapidapi-host': 'wordle-game-api1.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body : JSON.stringify({
            word : guess,
            timezone: `UTC + ${offset ? offset : 0}`
        })
        }

        const response = await fetch(url, options)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            return data
        })

        return response
}
