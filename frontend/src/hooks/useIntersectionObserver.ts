import { useEffect, useRef, useState, useCallback } from 'react'

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {},
): [React.RefCallback<Element>, boolean, IntersectionObserverEntry | undefined] {
  const { threshold = 0, root = null, rootMargin = '0%', freezeOnceVisible = false } = options
  const [entry, setEntry] = useState<IntersectionObserverEntry>()
  const frozen = entry?.isIntersecting && freezeOnceVisible

  const observerRef = useRef<IntersectionObserver | null>(null)

  const ref = useCallback((node: Element | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }
    if (frozen || !node) return

    observerRef.current = new IntersectionObserver(
      ([e]) => setEntry(e),
      { threshold, root, rootMargin },
    )
    observerRef.current.observe(node)
  }, [frozen, root, rootMargin, threshold])

  useEffect(() => () => observerRef.current?.disconnect(), [])

  return [ref, !!entry?.isIntersecting, entry]
}

export function useLazyLoad(): [React.RefCallback<Element>, boolean] {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
    freezeOnceVisible: true,
  })
  return [ref, isVisible]
}
