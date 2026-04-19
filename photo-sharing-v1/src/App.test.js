import { render, screen } from '@testing-library/react';
import App from './App';

test('renders photo sharing header', () => {
  render(<App />);
  const linkElement = screen.getByText(/📸 Photo Sharing/i);
  expect(linkElement).toBeInTheDocument();
});
