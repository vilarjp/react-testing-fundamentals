import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Search from './search';

const doSearch = jest.fn();

describe('Search', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a form', () => {
    render(<Search doSearch={doSearch} />);

    expect(screen.getByRole('form')).toBeInTheDocument();
  });

  it('should render an input type equal to search', () => {
    render(<Search doSearch={doSearch} />);

    expect(screen.getByRole('searchbox')).toHaveProperty('type', 'search');
  });

  it('should call props.doSearch() when form is submitted', () => {
    render(<Search doSearch={doSearch} />);

    const form = screen.getByRole('form');

    fireEvent.submit(form);

    expect(doSearch).toHaveBeenCalledTimes(1);
  });

  it('should call props.doSearch() with user input', () => {
    render(<Search doSearch={doSearch} />);

    const search = 'some text here';
    const form = screen.getByRole('form');
    const input = screen.getByRole('searchbox');

    userEvent.type(input, search);

    fireEvent.submit(form);

    expect(doSearch).toHaveBeenCalledWith(search);
  });

  it('should call props.doSearch() when search input is cleared', () => {
    render(<Search doSearch={doSearch} />);

    const search = 'some text here';
    const input = screen.getByRole('searchbox');

    userEvent.type(input, search);
    userEvent.clear(input);

    expect(doSearch).toHaveBeenCalledWith('');
    expect(doSearch).toHaveBeenCalledTimes(1);
  });
});
