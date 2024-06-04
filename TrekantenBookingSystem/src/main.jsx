import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { SupabaseProvider } from './Providers/SupabaseProvider.jsx'
import ContextProvider from './Providers/ContextProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SupabaseProvider>
      <ContextProvider>
        <App />
      </ContextProvider>
    </SupabaseProvider>
  </React.StrictMode>,
)
