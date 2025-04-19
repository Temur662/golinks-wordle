'use server'
import React from 'react'
export default async function GetWordleWord() {
    // Wordle .txt answers list from cfreshman github
    const url = 'https://wordle-game-api1.p.rapidapi.com/word';
    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': '28e354df00msh16df585736a6623p1f5c11jsnbce2d27c318f',
            'x-rapidapi-host': 'wordle-game-api1.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body : JSON.stringify({
            timezone: 'UTC + 0'
        })
    }

    const response = await fetch(url, options)
    .then(response => response.text())
    .then(data => {
        console.log(data)
        return data
    })

    return response
}
