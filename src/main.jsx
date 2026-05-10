import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import FloatingTimer from './components/FloatingTimer'
import './index.css'
import './App.css'

const isFloating = new URLSearchParams(window.location.search).get('floating') === '1'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isFloating ? <FloatingTimer /> : <App />}
  </React.StrictMode>,
)
