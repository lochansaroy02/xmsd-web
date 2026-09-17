import HeaderNav from './HeaderNav';
import { getBrandCategories, toLinks } from '@/lib/categories';

export default async function Header() {
  const categories = await getBrandCategories();
  return <HeaderNav categories={toLinks(categories)} />;
}
