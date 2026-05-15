import { useState, useCallback, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T): [T, (val: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      setStoredValue(prev => {
        const next = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value
        window.localStorage.setItem(key, JSON.stringify(next))
        return next
      })
    } catch (e) {
      console.warn(`[useLocalStorage] Failed to write key "${key}":`, e)
    }
  }, [key])

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (e) {
      console.warn(`[useLocalStorage] Failed to remove key "${key}":`, e)
    }
  }, [key, initialValue])

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === key) {
        try {
          setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue)
        } catch {
          setStoredValue(initialValue)
        }
      }
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}
