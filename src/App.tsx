import { BrowserRouter } from 'react-router-dom'
import CoinTable from './components/CoinTable'
import Header from './components/Header'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Header />
        <main className="">
            <CoinTable />
        </main>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App