import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const Client = new QueryClient();
createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={Client}>
    <App />
  </QueryClientProvider>,
)
