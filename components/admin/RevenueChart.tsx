'use client'

import React, { useEffect, useState } from 'react'

export interface DataPoint {
    month: string
    revenue: number
}

interface RevenueChartProps {
    data?: DataPoint[]
}

const defaultData: DataPoint[] = [
    { month: 'Jan', revenue: 4500 },
    { month: 'Feb', revenue: 5200 },
    { month: 'Mar', revenue: 4800 },
    { month: 'Apr', revenue: 6100 },
    { month: 'May', revenue: 5500 },
    { month: 'Jun', revenue: 6700 },
]

export function RevenueChart({ data = defaultData }: RevenueChartProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true)
    }, [])

    if (!mounted) return <div className="h-64 w-full animate-pulse bg-white/5 rounded-2xl" />

    const maxRevenue = Math.max(...data.map(d => d.revenue), 1000)
    const chartHeight = 240
    const barWidth = 32
    const gap = 32

    return (
        <div className="w-full">
            <div className="relative w-full overflow-hidden">
                <svg
                    viewBox={`0 0 ${data.length * (barWidth + gap + 40)} ${chartHeight + 60}`}
                    className="w-full h-full min-h-[300px]"
                    preserveAspectRatio="xMidYMid meet"
                >
                    <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.1" />
                        </linearGradient>
                    </defs>

                    {/* Grid Lines */}
                    {[0, 0.5, 1].map((p, i) => (
                        <g key={i}>
                            <line
                                x1="0"
                                y1={chartHeight * (1 - p)}
                                x2="100%"
                                y2={chartHeight * (1 - p)}
                                stroke="white"
                                strokeOpacity="0.04"
                                strokeWidth="1"
                            />
                            <text
                                x="0"
                                y={chartHeight * (1 - p) - 8}
                                fill="#3f3f46"
                                fontSize="10"
                                fontWeight="600"
                                className="uppercase tracking-widest"
                            >
                                GH₵{Math.round((maxRevenue * p) / 1000)}k
                            </text>
                        </g>
                    ))}

                    {/* Bars */}
                    {data.map((d, i) => {
                        const h = (d.revenue / maxRevenue) * chartHeight
                        const x = i * (barWidth + gap + 40) + 40
                        const y = chartHeight - h

                        return (
                            <g key={i} className="group cursor-pointer">
                                {/* Bar */}
                                <rect
                                    x={x}
                                    y={y}
                                    width={barWidth}
                                    height={h}
                                    fill="url(#barGradient)"
                                    fillOpacity="0.2"
                                    rx="8"
                                    className="transition-all duration-500 group-hover:fill-opacity-100"
                                />

                                {/* Value Text (Hover) */}
                                <text
                                    x={x + barWidth / 2}
                                    y={y - 12}
                                    fill="white"
                                    fontSize="11"
                                    fontWeight="700"
                                    textAnchor="middle"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                >
                                    GH₵{(d.revenue / 1000).toFixed(1)}k
                                </text>

                                {/* Month Label */}
                                <text
                                    x={x + barWidth / 2}
                                    y={chartHeight + 40}
                                    fill="#52525b"
                                    fontSize="11"
                                    fontWeight="600"
                                    textAnchor="middle"
                                    className="group-hover:fill-white transition-colors uppercase tracking-widest"
                                >
                                    {d.month}
                                </text>
                            </g>
                        )
                    })}
                </svg>
            </div>
        </div>
    )
}
