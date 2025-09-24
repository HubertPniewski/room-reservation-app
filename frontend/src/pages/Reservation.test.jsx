import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, test, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// mock react-router hooks
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
    useNavigate: () => mockNavigate,
  };
});

vi.mock('react-big-calendar', () => ({
  // fake calendar 
  Calendar: ({ onSelectSlot }) => (
    <div data-testid="calendar">
      <button onClick={() => onSelectSlot({ start: new Date('2024-01-15') })}>
        Mock Day 15
      </button>
      <button onClick={() => onSelectSlot({ start: new Date('2024-01-20') })}>
        Mock Day 20
      </button>
    </div>
  ),
  momentLocalizer: vi.fn(() => ({})),
}));

import Reservation from './Reservation';

test('happy path: select start/end, accept terms and confirm reservation', async () => {
  vi.setSystemTime(new Date('2024-01-01'));

  // mock fetch for: object, owner, reservations, and POST
  globalThis.fetch = vi
    .fn()
    // object fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 1,
        name: 'Test Object',
        day_price_cents: 100,
        advance_days: 0,
        max_advance_days: 999,
        check_in_start_hour: '12',
        check_in_end_hour: '18',
        check_out_start_hour: '8',
        check_out_end_hour: '11',
        reservation_edit_deadline: 1,
        owner: 2,
        reservation_break_days: 0,
      }),
    })
    // owner fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ first_name: 'John', last_name: 'Doe' }),
    })
    // reservations fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    })
    // POST reservation
    .mockResolvedValueOnce({ ok: true, json: async () => ({}) });

  // render component
  render(
    <AuthContext.Provider value={{ user: { id: 123 } }}>
      <MemoryRouter>
        <Reservation />
      </MemoryRouter>
    </AuthContext.Provider>
  );

  // wait for heading to show
  await screen.findByText(/Object reservation: Test Object/i);

  // simulate selecting start/end
  await userEvent.click(screen.getByText(/Select Start/i));
  await userEvent.click(screen.getByText('Mock Day 15'));

  await userEvent.click(screen.getByText(/Select End/i));
  await userEvent.click(screen.getByText('Mock Day 20'));

  // accept terms
  await userEvent.click(screen.getByRole('checkbox'));

  // confirm
  await userEvent.click(screen.getByRole('button', { name: /Confirm reservation/i }));

  await waitFor(() => {
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/reservations/'),
      expect.objectContaining({ method: 'POST' })
    );
    expect(mockNavigate).toHaveBeenCalledWith('/profile/');
  });
});

test('try reservation with selecting end date before start date', async () => {
  vi.setSystemTime(new Date('2024-01-01'));

  // mock fetch for: object, owner, reservations, and POST
  globalThis.fetch = vi
    .fn()
    // object fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 1,
        name: 'Test Object',
        day_price_cents: 100,
        advance_days: 0,
        max_advance_days: 999,
        check_in_start_hour: '12',
        check_in_end_hour: '18',
        check_out_start_hour: '8',
        check_out_end_hour: '11',
        reservation_edit_deadline: 1,
        owner: 2,
        reservation_break_days: 0,
      }),
    })
    // owner fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ first_name: 'John', last_name: 'Doe' }),
    })
    // reservations fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    })
    // POST reservation
    .mockResolvedValueOnce({ ok: true, json: async () => ({}) });

  // render component
  render(
    <AuthContext.Provider value={{ user: { id: 123 } }}>
      <MemoryRouter>
        <Reservation />
      </MemoryRouter>
    </AuthContext.Provider>
  );

  // wait for heading to show
  await screen.findByText(/Object reservation: Test Object/i);

  // simulate selecting start/end
  await userEvent.click(screen.getByText(/Select Start/i));
  await userEvent.click(screen.getByText('Mock Day 20'));

  await userEvent.click(screen.getByText(/Select End/i));
  await userEvent.click(screen.getByText('Mock Day 15'));

  // accept terms
  await userEvent.click(screen.getByRole('checkbox'));

  // confirm
  await userEvent.click(screen.getByRole('button', { name: /Confirm reservation/i }));

  await waitFor(() => {
    expect(globalThis.fetch).not.toHaveBeenCalledWith(
      expect.stringContaining('/reservations/'),
      expect.objectContaining({ method: 'POST' })
    );
    expect(mockNavigate).toHaveBeenCalledWith('/profile/');
  });
});

test('try reservation with terms not accepted', async () => {
  vi.setSystemTime(new Date('2024-01-01'));

  // mock fetch for: object, owner, reservations, and POST
  globalThis.fetch = vi
    .fn()
    // object fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 1,
        name: 'Test Object',
        day_price_cents: 100,
        advance_days: 0,
        max_advance_days: 999,
        check_in_start_hour: '12',
        check_in_end_hour: '18',
        check_out_start_hour: '8',
        check_out_end_hour: '11',
        reservation_edit_deadline: 1,
        owner: 2,
        reservation_break_days: 0,
      }),
    })
    // owner fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ first_name: 'John', last_name: 'Doe' }),
    })
    // reservations fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    })
    // POST reservation
    .mockResolvedValueOnce({ ok: true, json: async () => ({}) });

  // render component
  render(
    <AuthContext.Provider value={{ user: { id: 123 } }}>
      <MemoryRouter>
        <Reservation />
      </MemoryRouter>
    </AuthContext.Provider>
  );

  // wait for heading to show
  await screen.findByText(/Object reservation: Test Object/i);

  // simulate selecting start/end
  await userEvent.click(screen.getByText(/Select Start/i));
  await userEvent.click(screen.getByText('Mock Day 15')); // calls onSelectSlot start

  await userEvent.click(screen.getByText(/Select End/i));
  await userEvent.click(screen.getByText('Mock Day 20')); // calls onSelectSlot end

  // confirm
  await userEvent.click(screen.getByRole('button', { name: /Confirm reservation/i }));

  await waitFor(() => {
    expect(globalThis.fetch).not.toHaveBeenCalledWith(
      expect.stringContaining('/reservations/'),
      expect.objectContaining({ method: 'POST' })
    );
    expect(mockNavigate).toHaveBeenCalledWith('/profile/');
  });
});

test('try reservation with selecting time period overlaping another reservation', async () => {
  vi.setSystemTime(new Date('2024-01-01'));

  // mock fetch for: object, owner, reservations, and POST
  globalThis.fetch = vi
    .fn()
    // object fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 1,
        name: 'Test Object',
        day_price_cents: 100,
        advance_days: 0,
        max_advance_days: 999,
        check_in_start_hour: '12',
        check_in_end_hour: '18',
        check_out_start_hour: '8',
        check_out_end_hour: '11',
        reservation_edit_deadline: 1,
        owner: 2,
        reservation_break_days: 0,
      }),
    })
    // owner fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ first_name: 'John', last_name: 'Doe' }),
    })
    // reservations fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [{
        id: 5,
        object: 1,
        user: 1,
        created_at: "2023-12-24T08:42:05.443Z",
        start_date: "2024-01-12",
        end_date: "2024-01-18",
        day_price_cents: 15000
      },],
    })
    // POST reservation
    .mockResolvedValueOnce({ ok: true, json: async () => ({}) });

  // render component
  render(
    <AuthContext.Provider value={{ user: { id: 123 } }}>
      <MemoryRouter>
        <Reservation />
      </MemoryRouter>
    </AuthContext.Provider>
  );

  // wait for heading to show
  await screen.findByText(/Object reservation: Test Object/i);

  // simulate selecting start/end
  await userEvent.click(screen.getByText(/Select Start/i));
  await userEvent.click(screen.getByText('Mock Day 15'));

  await userEvent.click(screen.getByText(/Select End/i));
  await userEvent.click(screen.getByText('Mock Day 20'));

  // accept terms
  await userEvent.click(screen.getByRole('checkbox'));

  // confirm
  await userEvent.click(screen.getByRole('button', { name: /Confirm reservation/i }));

  await waitFor(() => {
    expect(globalThis.fetch).not.toHaveBeenCalledWith(
      expect.stringContaining('/reservations/'),
      expect.objectContaining({ method: 'POST' })
    );
    expect(mockNavigate).toHaveBeenCalledWith('/profile/');
  });
});