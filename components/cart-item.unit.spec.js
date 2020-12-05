import { fireEvent, render, screen } from '@testing-library/react';
import CartItem from './cart-item';

const product = {
  title: 'Relógio bonito',
  price: '22.00',
  image:
    'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1359&q=80',
};

const renderCartItem = () => {
  render(<CartItem product={product} />);
};

describe('CartItem', () => {
  beforeEach(() => {
    renderCartItem();
  });

  it('should render CartItem', () => {
    expect(screen.getByTestId('cart-item')).toBeInTheDocument();
  });

  it('should display proper content', () => {
    expect(screen.getByText(new RegExp(product.title, 'i'))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(product.price, 'i'))).toBeInTheDocument();
    expect(screen.getByTestId('image')).toHaveProperty('src', product.image);
    expect(screen.getByTestId('image')).toHaveProperty('alt', product.title);
  });

  it('should display 1 as initial quantity', () => {
    expect(screen.getByTestId('quantity').textContent).toBe('1');
  });

  it('should increase quantity by 1 when + is clicked', () => {
    const button = screen.getByTestId('+');

    fireEvent.click(button);

    expect(screen.getByTestId('quantity').textContent).toBe('2');
  });

  it('should decrease quantity by 1 when - is clicked', () => {
    fireEvent.click(screen.getByTestId('+'));

    expect(screen.getByTestId('quantity').textContent).toBe('2');

    fireEvent.click(screen.getByTestId('-'));

    expect(screen.getByTestId('quantity').textContent).toBe('1');
  });

  it('should not go below zero in quantity', () => {
    fireEvent.click(screen.getByTestId('+'));

    expect(screen.getByTestId('quantity').textContent).toBe('2');

    fireEvent.click(screen.getByTestId('-'));

    expect(screen.getByTestId('quantity').textContent).toBe('1');

    fireEvent.click(screen.getByTestId('-'));

    expect(screen.getByTestId('quantity').textContent).toBe('0');

    fireEvent.click(screen.getByTestId('-'));

    expect(screen.getByTestId('quantity').textContent).toBe('0');
  });
});
