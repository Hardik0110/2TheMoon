import { BrowserRouter } from 'react-router-dom'
import CoinTable from './components/CoinTable'
import Header from './components/Header'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a client with improved configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Header />
        <main>
          <CoinTable />
        </main>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App