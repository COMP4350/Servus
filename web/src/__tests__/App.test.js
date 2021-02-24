import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('Check title', () => {
    render(<App />);
    const linkElement = screen.getByText('Servus');
    expect(linkElement).toBeInTheDocument();
});
