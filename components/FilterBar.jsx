'use client'
import { Trophy, Clock, Star } from 'lucide-react'

export default function FilterBar({ activeFilter, setActiveFilter }) {
  const filters = [
    { id: 'league', label: 'By League', icon: Trophy },
    { id: 'time', label: 'By Kickoff Time', icon: Clock },
    { id: 'importance', label: 'By Importance', icon: Star },
  ]

  return (
    <div className="flex gap-2 p-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 w-fit mb-6">
      {filters.map((f) => {
        const Icon = f.icon
        const isActive = activeFilter === f.id
        return (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
              ${isActive ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'text-zinc-400 hover:text-white hover:bg-white/10'}`}
          >
            <Icon size={16} />
            {f.label}
          </button>
        )
      })}
    </div>
  )
}