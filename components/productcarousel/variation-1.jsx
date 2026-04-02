import ProductCard from '../ui/ProductCard';
import { useTheme } from '../../context/ThemeContext';
import products from '../../data/products.json';

const featured = products.filter(p => p.featured);

export default function ProductCarousel1() {
  const { variation } = useTheme();
  return (
    <section className={'py-20 ' + (variation === 2 ? 'bg-secondary' : 'bg-background')}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          {variation === 1 && <div className="text-center"><h2 className="font-heading text-3xl font-bold text-foreground mb-2">Featured Products</h2><p className="text-muted-foreground">Handpicked for you</p></div>}
          {variation === 2 && <div className="text-center"><h2 className="font-heading text-3xl font-bold tracking-wider uppercase mb-2"><span className="text-gradient-neon">Top Picks</span></h2><p className="text-muted-foreground">The gear everyone's talking about</p></div>}
          {variation === 3 && <div><span className="text-sm tracking-[0.3em] uppercase text-muted-foreground">Editor's Choice</span><h2 className="font-heading text-4xl font-semibold text-foreground mt-2 italic">Featured Collection</h2></div>}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.slice(0,4).map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}
