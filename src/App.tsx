import { BrowserRouter } from 'react-router-dom'
import CoinTable from './components/CoinTable'
import Header from './components/Header'

function App() {
  return (
    <BrowserRouter>
      
        <Header />
        
        <main className="">
            <CoinTable />
        </main>

    </BrowserRouter>
  )
}

export default App