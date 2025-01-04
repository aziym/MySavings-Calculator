import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SavingsCalculator from './components/SavingsCalculator'


function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <SavingsCalculator />
    </div>
  )
}

export default App
