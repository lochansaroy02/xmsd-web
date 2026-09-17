import Bestsellers from '@/components/Bestsellers';
import Categories from '@/components/Categories';
import FeatureBanner from '@/components/FeatureBanner';
import Hero from '@/components/Hero';
import Story from '@/components/Story';
import TrustBar from '@/components/TrustBar';
import { getProducts } from '@/lib/api';
import { getBrandCategories } from '@/lib/categories';

export default async function HomePage() {
  const [products, categories] = await Promise.all([getProducts(), getBrandCategories()]);

  return (
    <>
      <Hero productCount={products.length} />
      <TrustBar />
      <Categories categories={categories} />
      <FeatureBanner />
      <Bestsellers products={products} />
      {/* <Lines /> */}
      {/* <Process /> */}
      <Story />
    </>
  );
}
