import { useState, useEffect } from 'react';
import { useFetchProducts } from '../hooks/use-fetch-products';
import { useCartStore } from '../store';
import ProductCard from '../components/product-card';
import Search from '../components/search';

export default function Home() {
  const { products, error } = useFetchProducts();
  const [term, setTerm] = useState('');
  const [localProducts, setLocalProducts] = useState([]);
  const addToCart = useCartStore((store) => store.actions.add);

  useEffect(() => {
    if (term === '') {
      setLocalProducts(products);
    } else {
      setLocalProducts(
        products.filter(({ title }) => title.toLowerCase().includes(term.toLowerCase())),
      );
    }
  }, [products, term]);

  const renderProductList = () => {
    if (error) {
      return <h4 data-testid="server-error">Server is down</h4>;
    } else if (localProducts.length === 0) {
      return <h4 data-testid="no-products">No products</h4>;
    } else {
      return localProducts.map((product) => (
        <ProductCard addToCart={addToCart} product={product} key={product.id} />
      ));
    }
  };

  const renderQuantity = () => {
    if (localProducts.length === 1) {
      return '1 Product';
    } else {
      return `${localProducts.length} Products`;
    }
  };

  return (
    <main className="my-8" data-testid="product-list">
      <Search doSearch={(term) => setTerm(term)} />
      <div className="container mx-auto px-6">
        <h3 className="text-gray-700 text-2xl font-medium">Wrist Watch</h3>
        <span className="mt-3 text-sm text-gray-500">{renderQuantity()}</span>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
          {renderProductList()}
        </div>
      </div>
    </main>
  );
}
