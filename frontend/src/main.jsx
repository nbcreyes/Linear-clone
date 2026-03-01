import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#ffffff',
            border: '1px solid #2e2e2e',
            fontSize: '13px',
          },
          success: {
            iconTheme: {
              primary: '#5e5ce6',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#f44336',
              secondary: '#ffffff',
            },
          },
        }}
      />
      <App />
    </QueryClientProvider>
  </StrictMode>,
)