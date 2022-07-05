import React from 'react'
import { useState } from 'react'
import './App.css'
import axios from 'axios'
import { useEffect } from 'react'

const LongPulling = () => {
   const [messages, setMessages] = useState([])
   const [value, setValue] = useState('')


   useEffect(() => {
      subscribe()
   }, [])

   const subscribe = async () => {
      try {
         const { data } = await axios.get('http://localhost:5000/get-messages')
         setMessages(prev => [data, ...prev])
         await subscribe()
      } catch (e) {
         setTimeout(() => {
            subscribe()
         }, 500)
      }
   }

   const sendMessage = async () => {
      await axios.post('http://localhost:5000/new-messages', {
         message: value,
         id: Date.now()
      })
   }

   return (
      <div className='center'>
         <div className="form">
            <input value={value} onChange={e => setValue(e.target.value)} type="text" />
            <button onClick={sendMessage}>Send message</button>
         </div>
         <div className="messages">
            {messages.map((msg) =>
               <div className='message' key={msg.id}>{msg.message}</div>
            )}
         </div>
      </div>
   )
}

export default LongPulling