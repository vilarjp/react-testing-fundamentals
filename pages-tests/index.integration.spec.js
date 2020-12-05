import { screen, render, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductList from '../pages';
import { makeServer } from '../miragejs/server';
import Response from 'miragejs';

const renderProductList = () => {
  render(<ProductList />);
};

describe('ProductList', () => {
  let server;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should render ProductList', () => {
    renderProductList();

    expect(screen.getByTestId('product-list')).toBeDefined();
  });

  it('should render the ProductCard component 10 times ', async () => {
    server.createList('product', 10);

    renderProductList();

    await waitFor(() => {
      expect(screen.getAllByTestId('product-card')).toHaveLength(10);
    });
  });

  it('should render "No products" message if there are no products ', () => {
    renderProductList();

    expect(screen.getByTestId('no-products')).toBeInTheDocument();
  });

  it('should display error message when promise rejects', async () => {
    server.get('products', () => {
      return new Response(500, {}, '');
    });

    renderProductList();

    await waitFor(() => {
      expect(screen.getByTestId('server-error')).toBeInTheDocument();
      expect(screen.queryByTestId('no-products')).not.toBeInTheDocument();
      expect(screen.queryAllByTestId('product-card')).toHaveLength(0);
    });
  });

  it('should filter the product list when a search is performed', async () => {
    const searchTerm = 'Relógio bonito';
    server.createList('product', 2);
    server.create('product', {
      title: searchTerm,
    });

    renderProductList();

    await waitFor(() => {
      expect(screen.getAllByTestId('product-card')).toHaveLength(3);
      expect(screen.getByText(/3 Products/i)).toBeInTheDocument();
    });

    const form = screen.getByRole('form');
    const input = screen.getByRole('searchbox');

    userEvent.type(input, searchTerm);
    fireEvent.submit(form);

    expect(screen.getAllByTestId('product-card')).toHaveLength(1);
    expect(screen.getByText(/1 Product$/i)).toBeInTheDocument();
  });

  it('should display the total quantity of products', async () => {
    server.createList('product', 10);

    renderProductList();

    await waitFor(() => {
      expect(screen.getByText(/10 Products/i)).toBeInTheDocument();
    });
  });

  it('should display product (singular) when there is only 1 product', async () => {
    server.createList('product', 1);

    renderProductList();

    await waitFor(() => {
      expect(screen.getByText(/1 Product$/i)).toBeInTheDocument();
    });
  });
});
