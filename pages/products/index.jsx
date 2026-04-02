import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { useTheme } from '../../context/ThemeContext';
import FiltersSidebar1 from '../../components/filterssidebar/variation-1';
import FiltersSidebar2 from '../../components/filterssidebar/variation-2';
import FiltersSidebar3 from '../../components/filterssidebar/variation-3';
import ProductGrid1 from '../../components/productgrid/variation-1';
import ProductGrid2 from '../../components/productgrid/variation-2';
import ProductGrid3 from '../../components/productgrid/variation-3';
import allProducts from '../../data/products.json';
import { SlidersHorizontal } from 'lucide-react';

const sidebars = { 1: FiltersSidebar1, 2: FiltersSidebar2, 3: FiltersSidebar3 };
const grids    = { 1: ProductGrid1,    2: ProductGrid2,    3: ProductGrid3    };

const SORT_OPTIONS = [
  { value: 'featured',   label: 'Featured' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Best Rating' },
  { value: 'newest',     label: 'Newest' },
];

export default function ProductsPage() {
  const { variation } = useTheme();
  const router = useRouter();
  const { category: qCat, q } = router.query;

  const [filters, setFilters] = useState({ category: qCat || '', brands: [], priceMin: null, priceMax: null });
  const [sort, setSort] = useState('featured');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const Sidebar = sidebars[variation] || FiltersSidebar1;
  const Grid    = grids[variation]    || ProductGrid1;

  const handleFilter = (key, value) => {
    if (key === 'price') setFilters(p => ({ ...p, priceMin: value?.min ?? null, priceMax: value?.max ?? null }));
    else setFilters(p => ({ ...p, [key]: value }));
  };
  const clearFilters = () => setFilters({ category: '', brands: [], priceMin: null, priceMax: null });

  const filtered = useMemo(() => {
    let list = [...allProducts];
    const search = q?.toString().toLowerCase();
    if (search) list = list.filter(p =>
      p.name.toLowerCase().includes(search) ||
      p.brand.toLowerCase().includes(search) ||
      p.category.toLowerCase().includes(search));
    if (filters.category) list = list.filter(p => p.category === filters.category);
    if (filters.brands?.length) list = list.filter(p => filters.brands.includes(p.brand));
    if (filters.priceMin != null) list = list.filter(p => p.price >= filters.priceMin);
    if (filters.priceMax != null && filters.priceMax !== Infinity) list = list.filter(p => p.price <= filters.priceMax);
    if (sort === 'price-asc')  list.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sort === 'rating')     list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [filters, sort, q]);

  const selectCls = variation === 2
    ? 'bg-secondary border border-border text-foreground text-sm px-3 py-2 rounded-lg outline-none'
    : 'bg-card border border-border text-foreground text-sm px-3 py-2 rounded-xl outline-none';

  return (
    <>
      <Head><title>{filters.category ? `${filters.category} — Teknova` : 'All Products — Teknova'}</title></Head>
      <Layout>
        <div className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <h1 className={'font-heading text-3xl font-bold text-foreground ' + (variation === 3 ? 'italic' : '')}>
                  {variation === 2
                    ? <span className="text-gradient-neon">{filters.category || 'All Products'}</span>
                    : (filters.category || 'All Products')}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">{filtered.length} products</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <SlidersHorizontal size={16} /> {sidebarOpen ? 'Hide' : 'Show'} Filters
                </button>
                <select value={sort} onChange={e => setSort(e.target.value)} className={selectCls}>
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-8">
              {sidebarOpen && <Sidebar filters={filters} onFilterChange={handleFilter} onClear={clearFilters} />}
              <div className="flex-1 min-w-0"><Grid products={filtered} /></div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
