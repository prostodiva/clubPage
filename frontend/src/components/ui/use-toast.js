// Inspired by react-hot-toast library
import { createContext, useContext, useState } from "react"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

const ToastContext = createContext({})

export const ToastProvider = ToastContext.Provider

export const useToast = () => {
  const context = useContext(ToastContext)

  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }

  return context
}

export function toast({ ...props }) {
  const { addToast } = useToast()

  addToast({ ...props })
}

export function useToastStore(reducerOptions = {}) {
  const [state, setState] = useState([])

  function addToast(toast) {
    setState((state) => {
      if (state.length >= TOAST_LIMIT) {
        return [...state.slice(1), toast]
      }
      return [...state, toast]
    })
  }

  function dismissToast(toastId) {
    setState((state) => {
      const newState = state.filter((toast) => toast.id !== toastId)
      return newState
    })
  }

  return {
    toasts: state,
    addToast,
    dismissToast,
  }
} 