import React from 'react'
import { useState } from 'react'
import './App.css'
import axios from 'axios'
import { useEffect } from 'react'
import { useRef } from 'react'

const WebSock = () => {
   const [messages, setMessages] = useState([])
   const [value, setValue] = useState('')
   const socket = useRef()
   const [connected, setConnected] = useState(false)
   const [username, setUsername] = useState('')


   function connect() {
      socket.current = new WebSocket('ws://localhost:5000')
      socket.current.onopen = () => {
         setConnected(true)
         const message = {
            event: 'connection',
            username,
            id: Date.now()
         }
         socket.current.send(JSON.stringify(message))
         console.log('connected successfully')
      }

      socket.current.onmessage = (event) => {
         const message = JSON.parse(event.data)
         setMessages(prev => [message, ...prev])
      }

      socket.current.onclose = () => {
         console.log('Socket closed')
      }

      socket.current.onerror = () => {
         console.log('Error')
      }

   }



   const sendMessage = async () => {
      const message = {
         username,
         message: value,
         id: Date.now(),
         event: 'message'
      }
      socket.current.send(JSON.stringify(message))
      setValue('')
   }

   if (!connected) {
      return (
         <div className="center">
            <div className="form">
               <input type='text' value={username} onChange={e => setUsername(e.target.value)} placeholder='Input your username' />
               <button onClick={connect}>Log in</button>
            </div>
         </div>
      )
   }

   return (
      <div className='center'>
         <div className="form">
            <input value={value} onChange={e => setValue(e.target.value)} type="text" />
            <button onClick={sendMessage}>Send message</button>
         </div>
         <div className="messages">
            {messages.map((msg) =>
               <div key={msg.id}>{msg.event === 'connection' ? <div className='connection_message'>User {msg.username} connected</div> : <div className='message'>{msg.username}. {msg.message}</div>}</div>
            )}
         </div>
      </div>
   )
}

export default WebSock