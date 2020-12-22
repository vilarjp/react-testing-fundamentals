import { renderHook, act } from '@testing-library/react-hooks';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setAutoFreeze } from 'immer';
import { useCartStore } from '../store';
import { makeServer } from '../miragejs/server';
import Cart from './cart';

setAutoFreeze(false);

describe('Cart', () => {
  let server;
  let result;
  let add;
  let toggle;
  let reset;
  let spy;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
    result = renderHook(() => useCartStore()).result;
    add = result.current.actions.add;
    toggle = result.current.actions.toggle;
    reset = result.current.actions.reset;
    spy = jest.spyOn(result.current.actions, 'toggle');
  });

  afterEach(() => {
    server.shutdown();
    jest.clearAllMocks();
  });

  it('should add css class "hidden" in the component', () => {
    render(<Cart />);

    expect(screen.getByTestId('cart')).toHaveClass('hidden');
  });

  it('should call ->store.toggle() when toggle-button is clicked', () => {
    render(<Cart />);

    const button = screen.getByTestId('toggle-button');

    act(() => userEvent.click(button));

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should display 2 product cards', () => {
    const products = server.createList('product', 2);

    act(() => {
      for (const product of products) {
        add(product);
      }
    });

    render(<Cart />);

    expect(screen.getAllByTestId('cart-item')).toHaveLength(2);
  });

  it('should remove all products when clear cart button is clicked', () => {
    const products = server.createList('product', 2);

    act(() => {
      for (const product of products) {
        add(product);
      }
    });

    render(<Cart />);

    expect(screen.getAllByTestId('cart-item')).toHaveLength(2);

    const button = screen.getByRole('button', { name: /Clear cart/i });

    act(() => userEvent.click(button));

    expect(screen.queryAllByTestId('cart-item')).toHaveLength(0);
  });

  it('should not display clear cart button if no products are in the cart', () => {
    render(<Cart />);

    expect(screen.queryByRole('button', { name: /Clear cart/i })).not.toBeInTheDocument();
  });
});
