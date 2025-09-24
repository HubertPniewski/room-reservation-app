import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';
import { vi, test, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

test('call onSearch with correct filters', async () => {
  const mockOnSearch = vi.fn();

  render(
    <MemoryRouter>
      <SearchBar onSearch={mockOnSearch} />
    </MemoryRouter>
  );

  // inputs
  const nameInput = screen.getByPlaceholderText(/Name of the object/i);
  const objectType = screen.getByLabelText(/Object type/i);
  const location = screen.getByPlaceholderText(/location/i);
  const petsCheckbox = screen.getByRole('checkbox', { name: /pets allowed/i});
  const bathroomCheckbox = screen.getByRole('checkbox', { name: /own bathroom/i});
  const searchButton = screen.getByRole('button', { name: /search/i });

  // inserting values
  await userEvent.type(nameInput, 'ObjName');
  await userEvent.selectOptions(objectType, 'cottage');
  await userEvent.type(location, 'Sosnowiec');
  await userEvent.click(petsCheckbox);
  await userEvent.click(bathroomCheckbox);

  // form submit
  await userEvent.click(searchButton);

  expect(mockOnSearch).toHaveBeenCalledTimes(1);
  expect(mockOnSearch).toHaveBeenNthCalledWith(1, 
    expect.objectContaining({
    name: 'ObjName',
    type: 'cottage',
    location: 'Sosnowiec',
    pets: true,
    kitchen: false,
    bathroom: true,
    parking: false,
    min_price: 0,
    min_rooms: 0,
    min_area: 0,
  }));
});

test('prevFilters prop pre-fills the inputs', async () => {
  const mockOnSearch = vi.fn();

  const prevFilters = {
    name: 'MyObj',
    type: 'apartment',
    location: 'Warsaw',
    pets: true,
    kitchen: false,
    bathroom: true,
    parking: true,
    min_price: 100,
    max_price: 2000,
    min_rooms: 1,
    max_rooms: 3,
    min_area: 10,
    max_area: 100,
    min_advance: 5,
    max_advance: 50,
    edit_deadline: 10,
  };

  render(<SearchBar onSearch={mockOnSearch} prevFilters={prevFilters} />);

  // Check that text inputs reflect prevFilters
  expect(screen.getByPlaceholderText(/Name of the object/i)).toHaveValue('MyObj');
  expect(screen.getByLabelText(/Object type/i)).toHaveValue('apartment');
  expect(screen.getByPlaceholderText(/location/i)).toHaveValue('Warsaw');

  // Check checkboxes
  expect(screen.getByRole('checkbox', { name: /pets allowed/i })).toBeChecked();
  expect(screen.getByRole('checkbox', { name: /own bathroom/i })).toBeChecked();
  expect(screen.getByRole('checkbox', { name: /own kitchen/i })).not.toBeChecked();
  expect(screen.getByRole('checkbox', { name: /parking place/i })).toBeChecked();

  // search to confirm callback receives correct filters
  const searchButton = screen.getByRole('button', { name: /search/i });
  await userEvent.click(searchButton);

  expect(mockOnSearch).toHaveBeenCalledWith(prevFilters);
});