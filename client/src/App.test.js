import { render, screen } from '@testing-library/react';
import App from './App';

test('renders electron warning when api is unavailable', () => {
  render(<App />);
  const warning = screen.getByText(/Electron API not available/i);
  expect(warning).toBeInTheDocument();
});
