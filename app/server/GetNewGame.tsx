'use server'
import React from 'react'
import CheckIfValidWord from './CheckIfValidWord';
function getRandomInt(min: number, max:number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  // Example: Generate a random integer between 1 and 10
  let randomInt = getRandomInt(1, 10);

export default async function GetNewWordleGame() {
    // Wordle .txt answers list from cfreshman github
    const RandomNumber = getRandomInt(1,100)
    const url = 'https://wordle-game-api1.p.rapidapi.com/word';
    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': '28e354df00msh16df585736a6623p1f5c11jsnbce2d27c318f',
            'x-rapidapi-host': 'wordle-game-api1.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body : JSON.stringify({
            timezone: `UTC + ${RandomNumber}`
        })
    }

    const response = await fetch(url, options)
    .then(response => response.json())
    .then(data => {     
        data['offset'] = RandomNumber
        console.log(data)
        return data
    })
    
    return response
}
