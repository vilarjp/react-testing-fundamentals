import { fireEvent, render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';
import { setAutoFreeze } from 'immer';
import { useCartStore } from '../store';
import CartItem from './cart-item';

setAutoFreeze(false);

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
  it('should render CartItem', () => {
    renderCartItem();

    expect(screen.getByTestId('cart-item')).toBeInTheDocument();
  });

  it('should display proper content', () => {
    renderCartItem();

    expect(screen.getByText(new RegExp(product.title, 'i'))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(product.price, 'i'))).toBeInTheDocument();
    expect(screen.getByTestId('image')).toHaveProperty('src', product.image);
    expect(screen.getByTestId('image')).toHaveProperty('alt', product.title);
  });

  it('should call remove() when remove button is clicked', () => {
    const result = renderHook(() => useCartStore()).result;
    const removeSpy = jest.spyOn(result.current.actions, 'remove');

    renderCartItem();

    const button = screen.getByRole('button', { name: /remove/i });
    userEvent.click(button);

    expect(removeSpy).toHaveBeenCalledTimes(1);
    expect(removeSpy).toHaveBeenCalledWith(product);
  });

  it('should call increase() when + button is clicked', () => {
    const result = renderHook(() => useCartStore()).result;
    const increaseSpy = jest.spyOn(result.current.actions, 'increase');

    renderCartItem();

    const button = screen.getByTestId('+');
    userEvent.click(button);

    expect(increaseSpy).toHaveBeenCalledTimes(1);
    expect(increaseSpy).toHaveBeenCalledWith(product);
  });

  it('should call decrease() when - button is clicked', () => {
    const result = renderHook(() => useCartStore()).result;
    const decreaseSpy = jest.spyOn(result.current.actions, 'decrease');

    renderCartItem();

    const button = screen.getByTestId('-');
    userEvent.click(button);

    expect(decreaseSpy).toHaveBeenCalledTimes(1);
    expect(decreaseSpy).toHaveBeenCalledWith(product);
  });
});
