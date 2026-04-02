import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { useTheme } from '../../context/ThemeContext';
import ImageGallery from '../../components/imagegallery/variation-1';
import ProductInfo from '../../components/productinfo/variation-1';
import ReviewsRatings from '../../components/reviewsratings/variation-1';
import RelatedProducts from '../../components/relatedproducts/variation-1';
import AISuggestions1 from '../../components/aisuggestions/variation-1';
import AISuggestions2 from '../../components/aisuggestions/variation-2';
import AISuggestions3 from '../../components/aisuggestions/variation-3';
import ProductCard from '../../components/ui/ProductCard';
import allProducts from '../../data/products.json';
import { ChevronRight } from 'lucide-react';

const aiMap = { 1: AISuggestions1, 2: AISuggestions2, 3: AISuggestions3 };

const SPEC_TABS = ['Description', 'Specifications', 'Reviews'];

export default function ProductDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { variation } = useTheme();
  const [activeTab, setActiveTab] = useState('Description');
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  const product = allProducts.find(p => p.slug === slug);
  const AI = aiMap[variation] || AISuggestions1;

  // Track recently viewed
  useEffect(() => {
    if (!product) return;
    const key = 'teknova-recently-viewed';
    const stored = JSON.parse(localStorage.getItem(key) || '[]');
    const updated = [product.id, ...stored.filter(id => id !== product.id)].slice(0, 5);
    localStorage.setItem(key, JSON.stringify(updated));
    const viewed = updated.map(id => allProducts.find(p => p.id === id)).filter(Boolean).filter(p => p.id !== product.id);
    setRecentlyViewed(viewed);
  }, [product]);

  if (!product) return (
    <Layout>
      <div className="pt-32 text-center">
        <p className="text-muted-foreground">Product not found.</p>
        <Link href="/products" className="text-primary hover:underline mt-4 inline-block">← Back to Products</Link>
      </div>
    </Layout>
  );

  const related = allProducts.filter(p => p.category === product.category && p.id !== product.id);
  const tabCls = (t) => `px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${activeTab === t
    ? (variation === 2 ? 'border-neon text-neon' : 'border-primary text-foreground')
    : 'border-transparent text-muted-foreground hover:text-foreground'}`;

  return (
    <>
      <Head>
        <title>{product.name} — Teknova</title>
        <meta name="description" content={product.description} />
      </Head>
      <Layout>
        <div className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight size={12} />
              <Link href="/products" className="hover:text-foreground transition-colors">Products</Link>
              <ChevronRight size={12} />
              <Link href={`/products?category=${product.category}`} className="hover:text-foreground transition-colors">{product.category}</Link>
              <ChevronRight size={12} />
              <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
            </nav>

            {/* Main grid: gallery + info */}
            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              <ImageGallery images={product.images || [product.image]} alt={product.name} />
              <ProductInfo product={product} />
            </div>

            {/* Tabs: Description / Specifications / Reviews */}
            <div className="border-b border-border mb-8">
              <div className="flex gap-0">
                {SPEC_TABS.map(t => (
                  <button key={t} onClick={() => setActiveTab(t)} className={tabCls(t)}>{t}</button>
                ))}
              </div>
            </div>

            <div className="mb-16 max-w-3xl">
              {activeTab === 'Description' && (
                <div>
                  <p className="text-muted-foreground leading-relaxed mb-4">{product.longDescription || product.description}</p>
                </div>
              )}
              {activeTab === 'Specifications' && product.specs && (
                <div className="grid sm:grid-cols-2 gap-3">
                  {Object.entries(product.specs).map(([k, v]) => (
                    <div key={k} className="flex justify-between py-2.5 border-b border-border text-sm">
                      <span className="text-muted-foreground font-medium">{k}</span>
                      <span className="text-foreground text-right max-w-[55%]">{v}</span>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'Reviews' && <ReviewsRatings product={product} />}
            </div>

            {/* Related Products */}
            {related.length > 0 && <RelatedProducts products={related} currentId={product.id} />}

            {/* AI Suggestions */}
            <AI />

            {/* Recently Viewed */}
            {recentlyViewed.length > 0 && (
              <section className="py-12">
                <h2 className={'font-heading text-2xl font-bold text-foreground mb-8 ' + (variation === 3 ? 'italic' : '')}>
                  {variation === 2 ? <span className="text-gradient-neon">Recently Viewed</span> : 'Recently Viewed'}
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {recentlyViewed.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
                </div>
              </section>
            )}

          </div>
        </div>
      </Layout>
    </>
  );
}

export async function getStaticPaths() {
  const products = require('../../data/products.json');
  return {
    paths: products.map(p => ({ params: { slug: p.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  return { props: {} };
}
