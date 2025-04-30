import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import VideoPlayer from './components/VideoPlayer'
import './App.css'

function App() {
 

  return (
    <>
    <div className="min-h-screen bg-black p-4">
      <h1 className="text-2xl text-white font-bold mb-4">Lecture Progress Tracker</h1>
      <VideoPlayer userId="user123" videoId="12" />
    </div>
    </>
  )
}

export default App
