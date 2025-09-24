import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, test, expect, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ReviewForm from './ReviewForm';
import { AuthContext } from '../context/AuthContext';

let globalFetch;

beforeEach(() => {
  globalFetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok: true,
    json: async () => ({ id: 123 }) 
  });
});

afterEach(() => {
  globalFetch.mockRestore();
});

test('post correct review', async () => {
  render(
    <AuthContext.Provider>
      <MemoryRouter>
        <ReviewForm object={{ id: 42 }} />
      </MemoryRouter>
    </AuthContext.Provider>
  );

  const thirdStar = screen.getByTestId('3rate');
  const postButton = screen.getByRole('button', { name: /post/i });
  const textAreaInput = screen.getByPlaceholderText(/You can type your review here/i);

  await userEvent.hover(thirdStar);
  await userEvent.click(thirdStar);
  await userEvent.type(textAreaInput, "Some review.");
  await userEvent.click(postButton);

  const call = globalFetch.mock.calls[0];
  const options = call[1];
  const sentBody = JSON.parse(options.body);

  expect(sentBody.rating).toBe(3);
  expect(sentBody.description).toBe("Some review.");
  expect(sentBody.object).toBe(42);
});

test('post correct no description review', async () => {
  render(
    <AuthContext.Provider>
      <MemoryRouter>
        <ReviewForm object={{ id: 42 }} />
      </MemoryRouter>
    </AuthContext.Provider>
  );

  const postButton = screen.getByRole('button', { name: /post/i });

  await userEvent.click(postButton);

  const call = globalFetch.mock.calls[0];
  const options = call[1];
  const sentBody = JSON.parse(options.body);

  expect(sentBody.rating).toBe(5);
  expect(sentBody.description).toBe("");
  expect(sentBody.object).toBe(42);
});

test('delete review', async () => {
  const existingReview = {
    id: 2137,
    rating: 4,
    description: "Something",
    modified: "2025-09-23T07:54:07.955Z",
    author: 44,
    object: 42
  };

  render(
    <AuthContext.Provider>
      <MemoryRouter>
        <ReviewForm object={{ id: 42 }} review={existingReview} />
      </MemoryRouter>
    </AuthContext.Provider>
  );

  const deleteButton = screen.getByRole('button', { name: /delete/i });
  await userEvent.click(deleteButton);

  const confirmButton = screen.getByRole('button', { name: /confirm/i });
  await userEvent.click(confirmButton);

  const call = globalFetch.mock.calls[0];
  const url = call[0];
  const options = call[1];

  expect(url).toContain(`/reviews/${existingReview.id}/`);
  expect(options.method).toBe("DELETE");
});

test('edit review', async () => {
  const existingReview = {
    id: 2137,
    rating: 4,
    description: "Something",
    modified: "2025-09-23T07:54:07.955Z",
    author: 44,
    object: 42
  };

  render(
    <AuthContext.Provider>
      <MemoryRouter>
        <ReviewForm object={{ id: 42 }} review={existingReview} />
      </MemoryRouter>
    </AuthContext.Provider>
  );

  const editButton = screen.getByRole('button', { name: /edit/i });
  await userEvent.click(editButton);

  const thirdStar = screen.getByTestId('3rate');
  const saveButton = screen.getByRole('button', { name: /save/i });
  const textAreaInput = screen.getByPlaceholderText(/You can type your review here/i);
  await userEvent.click(thirdStar);
  await userEvent.clear(textAreaInput);
  await userEvent.type(textAreaInput, "New desc.");
  await userEvent.click(saveButton);

  const call = globalFetch.mock.calls[0];
  const options = call[1];
  const sentBody = JSON.parse(options.body);

  expect(sentBody.rating).toBe(3);
  expect(sentBody.description).toBe("New desc.");
  expect(sentBody.object).toBe(42);
});