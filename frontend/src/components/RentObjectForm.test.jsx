import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, test, expect, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import RentObjectForm from './RentObjectForm';
import { AuthContext } from '../context/AuthContext';

let globalFetch;

beforeEach(() => {
  globalFetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok: true,
    json: async () => ({ id: 123 }) // mock response with a fake id
  });
});

afterEach(() => {
  globalFetch.mockRestore();
});

test('post correct rent object', async () => {
  render(
    <AuthContext.Provider>
      <MemoryRouter>
        <RentObjectForm />
      </MemoryRouter>
    </AuthContext.Provider>
  );

  const objectNameInput = screen.getByPlaceholderText(/object name/i);
  const rentalTypeInput = screen.getByLabelText(/rental type/i);
  const roomsInput = screen.getByLabelText(/rooms/i);
  const areaInput = screen.getByLabelText(/area/i);
  const addressInput = screen.getByLabelText(/address/i);
  const townInput = screen.getByLabelText(/town/i);
  const priceInput = screen.getByLabelText(/price per day/i);
  const descriptionInput = screen.getByLabelText(/description/i);
  const petsInput = screen.getByLabelText(/pets allowed/i);
  const parkingInput = screen.getByLabelText(/parking place/i);
  const resMinAdvanceInput = screen.getByLabelText(/Reservation minimum advance days/i);
  const resEditDeadlineInput = screen.getByLabelText(/Reservation edit deadline/i);
  const minIntervalInput = screen.getByLabelText(/Min. interval beetwen reservations/i);
  const submitButton = screen.getByRole('button', { name: /save/i });

  await userEvent.type(objectNameInput, 'ObjectName');
  await userEvent.selectOptions(rentalTypeInput, 'cottage');
  await userEvent.clear(roomsInput);
  await userEvent.type(roomsInput, '2');
  await userEvent.type(areaInput, '45');
  await userEvent.type(addressInput, 'secret st 12');
  await userEvent.type(townInput, 'Grudziądz');
  await userEvent.type(priceInput, '234');
  await userEvent.type(descriptionInput, 'something');
  await userEvent.click(petsInput);
  await userEvent.click(parkingInput);
  await userEvent.clear(resMinAdvanceInput);
  await userEvent.type(resMinAdvanceInput, '10');
  await userEvent.clear(resEditDeadlineInput);
  await userEvent.type(resEditDeadlineInput, '5');
  await userEvent.clear(minIntervalInput);
  await userEvent.type(minIntervalInput, '1');

  await userEvent.click(submitButton);

  const call = globalFetch.mock.calls[0];
  const options = call[1];
  const sentBody = options.body;

  expect(sentBody.get('name')).toBe('ObjectName');
  expect(sentBody.get('rental_type')).toBe('cottage');
  expect(sentBody.get('rooms')).toBe('2');
  expect(sentBody.get('area')).toBe('45');
  expect(sentBody.get('address')).toBe('secret st 12');
  expect(sentBody.get('town')).toBe('Grudziądz');
  expect(sentBody.get('day_price_cents')).toBe('23400');
  expect(sentBody.get('pets_allowed')).toBe('true');
  expect(sentBody.get('own_kitchen')).toBe('false');
  expect(sentBody.get('own_bathroom')).toBe('false');
  expect(sentBody.get('parking_place')).toBe('true');
  expect(sentBody.get('description')).toBe('something');
  expect(sentBody.get('reservation_edit_deadline')).toBe('5');
  expect(sentBody.get('reservation_break_days')).toBe('1');
  expect(sentBody.get('advance_days')).toBe('10');
});

test('post incorrect rent object', async () => {
  render(
    <AuthContext.Provider>
      <MemoryRouter>
        <RentObjectForm />
      </MemoryRouter>
    </AuthContext.Provider>
  );

  const objectNameInput = screen.getByPlaceholderText(/object name/i);
  const rentalTypeInput = screen.getByLabelText(/rental type/i);
  const roomsInput = screen.getByLabelText(/rooms/i);
  const areaInput = screen.getByLabelText(/area/i);
  const townInput = screen.getByLabelText(/town/i);
  const descriptionInput = screen.getByLabelText(/description/i);
  const petsInput = screen.getByLabelText(/pets allowed/i);
  const parkingInput = screen.getByLabelText(/parking place/i);
  const resMinAdvanceInput = screen.getByLabelText(/Reservation minimum advance days/i);
  const resEditDeadlineInput = screen.getByLabelText(/Reservation edit deadline/i);
  const minIntervalInput = screen.getByLabelText(/Min. interval beetwen reservations/i);
  const submitButton = screen.getByRole('button', { name: /save/i });

  await userEvent.type(objectNameInput, 'ObjectName');
  await userEvent.selectOptions(rentalTypeInput, 'cottage');
  await userEvent.clear(roomsInput);
  await userEvent.type(roomsInput, '2');
  await userEvent.type(areaInput, '45');
  await userEvent.type(townInput, 'Grudziądz');
  await userEvent.type(descriptionInput, 'something');
  await userEvent.click(petsInput);
  await userEvent.click(parkingInput);
  await userEvent.clear(resMinAdvanceInput);
  await userEvent.clear(resEditDeadlineInput);
  await userEvent.clear(minIntervalInput);

  await userEvent.click(submitButton);

  expect(globalFetch).not.toHaveBeenCalled();
});

test('updates existing rent object', async () => {
  const existingObject = {
    id: 123,
    name: 'Old Name',
    rental_type: 'room',
    rooms: 1,
    area: 15,
    address: 'Secret St 12',
    town: 'Grudziądz',
    day_price_cents: 20000,
    pets_allowed: false,
    own_kitchen: false,
    own_bathroom: false,
    parking_place: false,
    reservation_edit_deadline: 5,
    advance_days: 10,
    reservation_break_days: 1,
    description: 'old description'
  };

  render(
    <AuthContext.Provider>
      <MemoryRouter>
        <RentObjectForm object={existingObject} />
      </MemoryRouter>
    </AuthContext.Provider>
  );

  const nameInput = screen.getByPlaceholderText(/object name/i);
  await userEvent.clear(nameInput);
  await userEvent.type(nameInput, 'New Name');

  const descriptionInput = screen.getByLabelText(/description/i);
  await userEvent.clear(descriptionInput);
  await userEvent.type(descriptionInput, 'new description');

  const submitButton = screen.getByRole('button', { name: /save/i });
  await userEvent.click(submitButton);

  expect(globalFetch).toHaveBeenCalledTimes(1);
  const [url, options] = globalFetch.mock.calls[0];

  expect(url).toBe('https://127.0.0.1:8000/listings/123/');
  expect(options.method).toBe('PATCH');

  const body = options.body;
  expect(body.get('name')).toBe('New Name');
  expect(body.get('description')).toBe('new description');

  expect(body.get('rental_type')).toBe('room');
});