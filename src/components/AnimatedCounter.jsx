'use client'
import React, { useEffect, useState } from 'react'

export default function AnimatedCounter({ number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const startTime = Date.now()
    // Base duration of 50ms per 100 units
    const duration = (Math.abs(number) / 50) * 10
    const startValue = 0
    const endValue = number

    const animate = () => {
      const currentTime = Date.now()
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      const currentValue = Math.floor(startValue + (endValue - startValue) * progress)
      setCount(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [number])

  return (
    <span className="w-8 inline-block text-right transition-all duration-300">
      {count}
    </span>
  )
}
