
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@/components/shared/theme-provider';
import { DashboardPage } from '@/app/dashboard/page';
import { act } from 'react-dom/test-utils';

describe('Dashboard Integration Tests', () => {
  const renderWithProviders = (component: React.ReactNode) => {
    return render(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {component}
      </ThemeProvider>
    );
  };

  it('should load dashboard data correctly', async () => {
    await act(async () => {
      renderWithProviders(<DashboardPage />);
    });

    await waitFor(() => {
      expect(screen.getByText(/Total Revenue/i)).toBeInTheDocument();
      expect(screen.getByText(/Recent Sales/i)).toBeInTheDocument();
    });
  });

  it('should handle data refresh', async () => {
    await act(async () => {
      renderWithProviders(<DashboardPage />);
    });

    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(screen.getByText(/Data refreshed/i)).toBeInTheDocument();
    });
  });
});
