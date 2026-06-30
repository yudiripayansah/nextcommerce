'use client'

import { useState } from 'react'

export default function ProductGallery({ images = [], featuredImage }) {
  const allImages = images.length > 0 ? images : featuredImage ? [featuredImage] : []
  const [active, setActive] = useState(0)

  if (allImages.length === 0) {
    return (
      <div className="aspect-square rounded-lg flex items-center justify-center" style={{ background: 'var(--color-surface)' }}>
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-border)' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    )
  }

  return (
    <div className="flex flex-col-reverse md:flex-row gap-3">
      {allImages.length > 1 && (
        <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:overflow-x-visible">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden border-2 transition-all"
              style={i === active
                ? { borderColor: 'var(--color-text)' }
                : { borderColor: 'transparent' }}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 aspect-square overflow-hidden rounded-lg" style={{ background: 'var(--color-surface)' }}>
        <img
          src={allImages[active]}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )
}
