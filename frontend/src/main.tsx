"use client";

import { ErrorBoundary } from "react-error-boundary";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
    <App />
      </ErrorBoundary>
  </StrictMode>,
)
