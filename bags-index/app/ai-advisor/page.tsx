'use client'

import { motion } from 'framer-motion'
import AIAdvisor from '@/components/ai/AIAdvisor'

export default function AIAdvisorPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-4 py-10"
    >
      <div className="mb-8 text-center">
        <h1 className="font-mono text-3xl font-bold text-white mb-2">AI Index Advisor</h1>
        <p className="text-[#888888]">Tell Claude your goals — get a curated creator token basket in seconds.</p>
      </div>
      <AIAdvisor />
    </motion.div>
  )
}
