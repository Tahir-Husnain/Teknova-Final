import Link from 'next/link';
import { useTheme } from '../../context/ThemeContext';
import { Sparkles } from 'lucide-react';
import ProductCard from '../ui/ProductCard';
import products from '../../data/products.json';

export default function AISuggestions3() {
  const { variation } = useTheme();
  const suggested = products.filter(p => p.new).slice(0, 3);

  return (
    <section className={'py-20 ' + (variation === 2 ? 'bg-secondary' : 'bg-background')}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles size={20} className={variation === 2 ? 'text-neon' : 'text-primary'} />
            <span className="text-sm font-medium tracking-wider uppercase text-muted-foreground">AI Picks</span>
          </div>
          {variation === 2 && <h2 className="font-heading text-3xl font-bold"><span className="text-gradient-neon">Recommended For You</span></h2>}
          {variation === 3 && <h2 className="font-heading text-3xl font-semibold text-foreground italic">Recommended For You</h2>}
          {variation === 1 && <h2 className="font-heading text-3xl font-bold text-foreground">Recommended For You</h2>}
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {suggested.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}
