import { BrowserRouter } from 'react-router-dom'
import CoinTable from './components/Table'
import Header from './components/Header'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen  overflow-x-hidden">
        <Header />
        <main className="container mx-auto px-4 py-8 mt-5 max-h-[calc(100vh-100px)] overflow-y-auto">
          <CoinTable />
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App