import React, { useState, useEffect, useRef } from 'react';
import FlashcardList from './FlashcardList';
import "./app.css"
import axios from "axios"


function App() {
  const [flashcards, setFlashcards] = useState([])
  const [categories, setCategories] = useState([])

  const categoryE1 = useRef()
  const amountE1 = useRef()

  useEffect(() => {
    axios
    .get('https://opentdb.com/api_category.php')
    .then(res => {
     setCategories(res.data.trivia_categories)
    })


  }, [])


  useEffect(() => {
    
  }, [])

  function decodeString(str) {
    const textArea = document.createElement('textarea')
    textArea.innerHTML = str
    return textArea.value
  }


  function handelSubmit(e) {
    e.preventDefault()
    axios
    .get('https://opentdb.com/api.php', {
        params: {
          amount : amountE1.current.value ,
          category : categoryE1.current.value
        }
    })
    .then(res => {
        setFlashcards(res.data.results.map((questionItem, index) => {
          const answer = decodeString(questionItem.correct_answer)
          const options = [
            ...questionItem.incorrect_answers.map(a => decodeString(a)), 
            answer
          ]
          return {
            id: `$(index)-$(Date.now()}` ,
            question: decodeString(questionItem.question),
            answer: answer,
            options: options.sort(() => Math.random() - .5)
            
            
          }
        }))
      
      })
  }

  return (
    <>
      <form className = "header" onSubmit = {handelSubmit}>
        <div className = "form-group">
          <label htmlFor = "category">Category</label>
          <select id = "category" ref = {categoryE1}>
            {categories.map(category => {
              return <option value = {category.id} key = {category.id}>{category.name}
              </option>

            })}  
          </select>
            
          
        </div>

        <div className = "form-group">
        <label htmlFor = "amount">Number Of Questions</label>
        <input type = "number" id = "amount" min = "1" step = "1" defaultValue = {10} ref = {amountE1} />

        </div>
      

        <div className = "form-group">
            <button className = "btn">Generate</button>
            
        </div>
      </form>
      <div className = 'container'>
      <FlashcardList flashcards = {flashcards} />
      </div>
    </>
  );
}

export default App;
