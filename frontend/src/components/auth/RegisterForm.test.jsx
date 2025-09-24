import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, test, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import RegisterForm from './RegisterForm.jsx';
import { AuthContext } from '../../context/AuthContext';

test('register form submits correct values', async () => {
  // 1. Mock the register function
  const mockRegister = vi.fn().mockResolvedValue({}); // simulate successful register

  // 2. Render the component inside AuthContext + Router
  render(
    <AuthContext.Provider value={{ register: mockRegister }}>
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    </AuthContext.Provider>
  );

  // 3. Find all input elements
  const firstNameInput = screen.getByPlaceholderText(/first name/i);
  const lastNameInput = screen.getByPlaceholderText(/last name/i);
  const emailInput = screen.getByPlaceholderText(/email/i);
  const passwordInput = screen.getByPlaceholderText(/^password$/i); // exact "Password"
  const repeatPasswordInput = screen.getByPlaceholderText(/repeat password/i);
  const phoneInput = screen.getByPlaceholderText(/phone number/i);
  const termsCheckbox = screen.getByRole('checkbox');
  const submitButton = screen.getByRole('button', { name: /register/i });

  // 4. Type values into inputs
  await userEvent.type(firstNameInput, 'John');
  await userEvent.type(lastNameInput, 'Doe');
  await userEvent.type(emailInput, 'user@example.com');
  await userEvent.type(passwordInput, 'secret');
  await userEvent.type(repeatPasswordInput, 'secret');
  await userEvent.type(phoneInput, '+48213213888');

  // 5. Click the terms checkbox
  await userEvent.click(termsCheckbox);

  // 6. Click submit
  await userEvent.click(submitButton);

  // 7. Ensure register was called once
  expect(mockRegister).toHaveBeenCalledTimes(1);

  // 8. Check that the FormData passed to register contains correct values
  const formData = mockRegister.mock.calls[0][0];
  expect(formData.get('first_name')).toBe('John');
  expect(formData.get('last_name')).toBe('Doe');
  expect(formData.get('email')).toBe('user@example.com');
  expect(formData.get('phone_number')).toBe('+48213213888');
  expect(formData.get('password')).toBe('secret');
  expect(formData.get('terms_accepted')).toBe('true');
});


test('register form submit without terms accepted', async () => {
  const mockRegister = vi.fn().mockResolvedValue({}); 

  render(
    <AuthContext.Provider value={{ register: mockRegister }}>
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    </AuthContext.Provider>
  );

  const firstNameInput = screen.getByPlaceholderText(/first name/i);
  const lastNameInput = screen.getByPlaceholderText(/last name/i);
  const emailInput = screen.getByPlaceholderText(/email/i);
  const passwordInput = screen.getByPlaceholderText(/^password$/i); // exact "Password"
  const repeatPasswordInput = screen.getByPlaceholderText(/repeat password/i);
  const phoneInput = screen.getByPlaceholderText(/phone number/i);
  const submitButton = screen.getByRole('button', { name: /register/i });

  await userEvent.type(firstNameInput, 'John');
  await userEvent.type(lastNameInput, 'Doe');
  await userEvent.type(emailInput, 'user@example.com');
  await userEvent.type(passwordInput, 'secret');
  await userEvent.type(repeatPasswordInput, 'secret');
  await userEvent.type(phoneInput, '+48213213888');
  await userEvent.click(submitButton);

  expect(mockRegister).not.toHaveBeenCalled();
});


test('register form submit different passwords', async () => {
  const mockRegister = vi.fn().mockResolvedValue({});

  render(
    <AuthContext.Provider value={{ register: mockRegister }}>
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    </AuthContext.Provider>
  );

  const firstNameInput = screen.getByPlaceholderText(/first name/i);
  const lastNameInput = screen.getByPlaceholderText(/last name/i);
  const emailInput = screen.getByPlaceholderText(/email/i);
  const passwordInput = screen.getByPlaceholderText(/^password$/i); // exact "Password"
  const repeatPasswordInput = screen.getByPlaceholderText(/repeat password/i);
  const phoneInput = screen.getByPlaceholderText(/phone number/i);
  const termsCheckbox = screen.getByRole('checkbox');
  const submitButton = screen.getByRole('button', { name: /register/i });

  await userEvent.type(firstNameInput, 'John');
  await userEvent.type(lastNameInput, 'Doe');
  await userEvent.type(emailInput, 'user@example.com');
  await userEvent.type(passwordInput, 'secret');
  await userEvent.type(repeatPasswordInput, 'not secret');
  await userEvent.type(phoneInput, '+48213213888');
  await userEvent.click(termsCheckbox);
  await userEvent.click(submitButton);

  expect(mockRegister).not.toHaveBeenCalled();
});