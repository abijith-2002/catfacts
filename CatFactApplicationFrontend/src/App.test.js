import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// PUBLIC_INTERFACE
describe('CatFactApplicationFrontend', () => {
  test('renders app title and subtitle', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /cat fact generator/i })).toBeInTheDocument();
    expect(screen.getByText(/learn something new about cats/i)).toBeInTheDocument();
  });

  test('fetches and displays a cat fact (mocked)', async () => {
    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ fact: 'Cats share 95.6% of their genetic makeup with tigers.' }),
      })
    );

    render(<App />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Cats share 95.6%/i)).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });

  test('shows error on API error', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false })
    );

    render(<App />);
    await waitFor(() =>
      expect(screen.getByText(/couldn\'t load a cat fact/i)).toBeInTheDocument()
    );

    global.fetch.mockRestore();
  });

  test('refresh button is disabled while loading', async () => {
    // Mock fetch with a delay
    jest.useFakeTimers();
    global.fetch = jest.fn(() =>
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: () => Promise.resolve({ fact: 'New fact!' }),
      }), 1200))
    );

    render(<App />);
    const btn = screen.getByRole('button', { name: /get new cat fact/i });
    expect(btn).toBeDisabled();

    // Fast-forward timers so fetch resolves
    jest.runAllTimers();
    await waitFor(() => expect(btn).not.toBeDisabled());

    global.fetch.mockRestore();
    jest.useRealTimers();
  });
});
