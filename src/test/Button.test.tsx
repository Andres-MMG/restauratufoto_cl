import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@/shared/components/ui/atoms/Button';

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('handles click events', () => {
    let clicked = false;
    const handleClick = () => {
      clicked = true;
    };

    render(<Button onClick={handleClick}>Click me</Button>);
    screen.getByRole('button').click();
    expect(clicked).toBe(true);
  });
});