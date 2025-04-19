import React from 'react'

export default async function CheckIfValidWord(guess : string) {
  // Wordle .txt answers list from cfreshman github
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${guess}`;
  const options = {
      method: 'GET',
      headers : {
        'Content-Type': 'application/json'
      }
      }
      const response = await fetch(url, options)
      .then(response => response.json())
      .then(data => {
          console.log(data)
          if ( data?.title ) {
            console.log('Not Valid Word')
            return false
          }
          return true
      })

      return response
}
