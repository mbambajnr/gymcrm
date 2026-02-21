'use client'

import React, { useEffect, useState } from 'react'

interface DataPoint {
    month: string
    revenue: number
}

const mockData: DataPoint[] = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 48000 },
    { month: 'Apr', revenue: 61000 },
    { month: 'May', revenue: 55000 },
    { month: 'Jun', revenue: 67000 },
]

export function RevenueChart() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return <div className="h-80 w-full animate-pulse bg-white/5 rounded-[32px]" />

    const maxRevenue = Math.max(...mockData.map(d => d.revenue))
    const chartHeight = 200
    const barWidth = 40
    const gap = 20

    return (
        <div className="w-full bg-zinc-900/40 border border-white/10 rounded-[40px] p-8 backdrop-blur-md shadow-2xl transition-all hover:border-primary/20">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-black tracking-tight text-white">Revenue Performance</h3>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">Growth Intelligence</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-primary shadow-[0_0_10px_rgba(0,122,255,0.5)]" />
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Monthly Gross Revenue</span>
                </div>
            </div>

            <div className="relative w-full overflow-hidden">
                <svg
                    viewBox={`0 0 ${mockData.length * (barWidth + gap + 40)} ${chartHeight + 60}`}
                    className="w-full h-full min-h-[280px]"
                    preserveAspectRatio="xMidYMid meet"
                >
                    {/* Grid Lines */}
                    {[0, 0.5, 1].map((p, i) => (
                        <g key={i}>
                            <line
                                x1="0"
                                y1={chartHeight * (1 - p)}
                                x2="100%"
                                y2={chartHeight * (1 - p)}
                                stroke="white"
                                strokeOpacity="0.05"
                                strokeDasharray="4 4"
                            />
                            <text
                                x="0"
                                y={chartHeight * (1 - p) - 5}
                                fill="#52525b"
                                fontSize="10"
                                fontWeight="900"
                            >
                                ${Math.round((maxRevenue * p) / 1000)}k
                            </text>
                        </g>
                    ))}

                    {/* Bars */}
                    {mockData.map((d, i) => {
                        const h = (d.revenue / maxRevenue) * chartHeight
                        const x = i * (barWidth + gap + 40) + 40
                        const y = chartHeight - h

                        return (
                            <g key={i} className="group cursor-pointer">
                                {/* Bar Gradient Shadow */}
                                <rect
                                    x={x - 5}
                                    y={y}
                                    width={barWidth + 10}
                                    height={h}
                                    fill="url(#barGradient)"
                                    fillOpacity="0.1"
                                    className="transition-all duration-500 group-hover:fill-opacity-20"
                                />

                                {/* Main Bar */}
                                <rect
                                    x={x}
                                    y={y}
                                    width={barWidth}
                                    height={h}
                                    fill="#0070f3"
                                    rx="6"
                                    className="transition-all duration-500 group-hover:fill-white group-hover:filter group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                                />

                                {/* Value Text (Hover) */}
                                <text
                                    x={x + barWidth / 2}
                                    y={y - 12}
                                    fill="white"
                                    fontSize="12"
                                    fontWeight="900"
                                    textAnchor="middle"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                >
                                    ${(d.revenue / 1000).toFixed(1)}k
                                </text>

                                {/* Month Label */}
                                <text
                                    x={x + barWidth / 2}
                                    y={chartHeight + 30}
                                    fill="#71717a"
                                    fontSize="12"
                                    fontWeight="900"
                                    textAnchor="middle"
                                    className="group-hover:fill-white transition-colors"
                                >
                                    {d.month}
                                </text>
                            </g>
                        )
                    })}

                    <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0070f3" />
                            <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Average Monthly</span>
                        <span className="text-sm font-bold text-white">$54,666</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Peak Revenue</span>
                        <span className="text-sm font-bold text-primary">$67,000</span>
                    </div>
                </div>
                <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:text-white transition-colors">
                    View Detailed Analytics →
                </button>
            </div>
        </div>
    )
}
