'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const STEPS = ['Details', 'Pick Tokens', 'Set Weights', 'Launch']

export default function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center mb-10">
      {STEPS.map((label, i) => {
        const step = i + 1
        const done = step < current
        const active = step === current
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                animate={{
                  background: done ? '#00FF87' : active ? '#00FF87' : '#1A1A1A',
                  borderColor: done || active ? '#00FF87' : '#333333',
                  scale: active ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
                className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-mono font-bold"
                style={{ color: done || active ? '#000' : '#666' }}
              >
                {done ? <Check size={14} /> : step}
              </motion.div>
              <span className={`text-xs font-medium hidden md:block ${active ? 'text-[#00FF87]' : 'text-[#888888]'}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <motion.div
                className="h-0.5 w-12 md:w-20 mx-1 md:mx-2 mb-4"
                animate={{ background: done ? '#00FF87' : '#222222' }}
                transition={{ duration: 0.3 }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
