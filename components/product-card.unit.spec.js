import { fireEvent, render, screen } from '@testing-library/react';
import ProductCard from './product-card';

const product = {
  title: 'Relógio bonito',
  price: '22.00',
  image: '',
};

const addToCart = jest.fn();

const renderProductCard = () => {
  render(<ProductCard product={product} addToCart={addToCart} />);
};

describe('ProductCard', () => {
  beforeEach(() => {
    renderProductCard();
  });

  it('should render ProductCard', () => {
    expect(screen.getByTestId('product-card')).toBeInTheDocument();
  });

  it('should display proper content', () => {
    expect(screen.getByText(new RegExp(product.title, 'i'))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(product.price, 'i'))).toBeInTheDocument();
    expect(screen.getByTestId('image')).toHaveStyle({
      backgroundImage: product.image,
    });
  });

  it('should call props.addToCart() when button gets clicked', () => {
    const button = screen.getByRole('button');

    fireEvent.click(button);

    expect(addToCart).toHaveBeenCalledTimes(1);
    expect(addToCart).toHaveBeenCalledWith(product);
  });
});
