import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

export default function ImageGallery({ images = [], alt = '' }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);

  const prev = () => setActive(i => (i - 1 + images.length) % images.length);
  const next = () => setActive(i => (i + 1) % images.length);

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary group cursor-zoom-in" onClick={() => setZoom(true)}>
        <img src={images[active]} alt={alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <button onClick={e => { e.stopPropagation(); prev(); }} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-background/80 backdrop-blur rounded-full border border-border opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background">
          <ChevronLeft size={16} />
        </button>
        <button onClick={e => { e.stopPropagation(); next(); }} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-background/80 backdrop-blur rounded-full border border-border opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background">
          <ChevronRight size={16} />
        </button>
        <button onClick={e => { e.stopPropagation(); setZoom(true); }} className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur rounded-full border border-border opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn size={14} />
        </button>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {images.map((img, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={'shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ' + (i === active ? 'border-primary' : 'border-transparent hover:border-border')}>
              <img src={img} alt={`${alt} ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Zoom modal */}
      {zoom && (
        <div className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4" onClick={() => setZoom(false)}>
          <img src={images[active]} alt={alt} className="max-w-full max-h-full object-contain rounded-xl" />
          <button onClick={() => setZoom(false)} className="absolute top-4 right-4 p-2 bg-background/20 backdrop-blur rounded-full text-background hover:bg-background/40 transition-colors">✕</button>
        </div>
      )}
    </div>
  );
}
