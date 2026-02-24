'use client'

import React from 'react'
import Image from 'next/image'

const galleryImages = [
    { id: 1, src: '/client-1.jpeg', title: 'Digital Checkout Protocol', category: 'Efficiency', aspect: 'aspect-video' },
    { id: 2, src: '/client-2.jpeg', title: 'Elite Atmosphere', category: 'Environment', aspect: 'aspect-video' },
    { id: 3, src: '/client-3.jpeg', title: 'Endurance Mastery', category: 'Training', aspect: 'aspect-[3/4]' },
    { id: 4, src: '/client-4.jpeg', title: 'Olympic Standards', category: 'Elite', aspect: 'aspect-square' },
    { id: 5, src: '/client-5.jpeg', title: 'Strength Architecture', category: 'Performance', aspect: 'aspect-square' },
    { id: 6, title: 'Performance Lab', category: 'Intelligence', aspect: 'aspect-[3/4]' },
]

export default function ClientGallery() {
    return (
        <div className="w-full max-w-[1400px] px-10 py-40">
            <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
                <div className="max-w-xl">
                    <p className="text-[11px] font-black text-blue-500 uppercase tracking-[0.4em] mb-6">Social Proof Engine</p>
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-none text-white">
                        THE HUMAN <br /> <span className="text-zinc-500 underline decoration-blue-500/30 underline-offset-8">ELEMENT.</span>
                    </h2>
                </div>
                <p className="text-zinc-500 font-medium max-w-xs text-right hidden md:block">
                    Capturing the raw energy and absolute satisfaction of elite athletes using the GymFlow infrastructure.
                </p>
            </div>

            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                {galleryImages.map((img) => (
                    <div
                        key={img.id}
                        className={`relative group overflow-hidden rounded-[32px] bg-white/[0.02] border border-white/[0.05] break-inside-avoid shadow-2xl transition-all duration-700 hover:border-white/10 hover:shadow-blue-500/5 ${img.aspect}`}
                    >
                        {/* Image Container */}
                        {img.src ? (
                            <Image
                                src={img.src}
                                alt={img.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out grayscale group-hover:grayscale-0"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/10 to-transparent group-hover:scale-110 transition-transform duration-1000 ease-out" />
                        )}

                        {/* Glass Overlay on Hover */}
                        <div className="absolute inset-0 bg-[#010101]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 backdrop-blur-[2px]">
                            <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-2">{img.category}</p>
                                <h4 className="text-xl font-bold text-white tracking-tight">{img.title}</h4>
                            </div>
                        </div>

                        {/* Subtle Brand Tag */}
                        <div className="absolute top-6 right-6 h-8 w-8 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-700">
                            <div className="h-1 w-1 rounded-full bg-blue-500 animate-pulse" />
                        </div>

                        {!img.src && (
                            <div className="flex items-center justify-center h-full w-full">
                                <span className="text-[10px] font-black text-zinc-800 uppercase tracking-widest opacity-20 group-hover:opacity-40 transition-opacity">GymFlow Visual Media</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-20 flex justify-center">
                <button className="px-10 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.1] text-zinc-500 font-bold text-xs uppercase tracking-[0.2em] hover:bg-white/[0.05] hover:text-white transition-all">
                    View Full Archive
                </button>
            </div>
        </div>
    )
}
