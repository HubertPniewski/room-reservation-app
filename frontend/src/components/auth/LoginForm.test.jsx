import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, test, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import LoginForm from './LoginForm';
import { AuthContext } from '../../context/AuthContext';


test('renders login form and submits values', async () => {
  const mockLogin = vi.fn(); // checks submission
  const mockPrevUrl = '/dashboard';

  render(
    <AuthContext.Provider value={{ login: mockLogin }}>
      <MemoryRouter>
        <LoginForm prevUrl={mockPrevUrl} />
      </MemoryRouter>
    </AuthContext.Provider>
  );

  const emailInput = screen.getByPlaceholderText(/email/i);
  const passwordInput = screen.getByPlaceholderText(/password/i);
  const button = screen.getByRole('button', { name: /log in/i });

  await userEvent.type(emailInput, 'user@example.com');
  await userEvent.type(passwordInput, 'secret');
  await userEvent.click(button);

  expect(mockLogin).toHaveBeenCalledWith('user@example.com', 'secret');
});


test('shows error message on invalid credentials', async () => {
  const mockLogin = vi.fn(() => {
    throw new Error('Invalid credentials');
  });

  render(
    <AuthContext.Provider value={{ login: mockLogin }}>
      <MemoryRouter>
        <LoginForm prevUrl="/dashboard" />
      </MemoryRouter>
    </AuthContext.Provider>
  );

  const emailInput = screen.getByPlaceholderText(/email/i);
  const passwordInput = screen.getByPlaceholderText(/password/i);
  const button = screen.getByRole('button', { name: /log in/i });

  await userEvent.type(emailInput, 'wrong@example.com');
  await userEvent.type(passwordInput, 'wrongpassword');
  await userEvent.click(button);

  expect(mockLogin).toHaveBeenCalledWith('wrong@example.com', 'wrongpassword');
  expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument();
});
