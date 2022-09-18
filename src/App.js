import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { StockOverviewPage } from './pages/StockOverviewPage';
import { StockDetailsPage } from './pages/StockDetailsPage';
import { WatchListContextProvider } from './context/watchListContext';
import NotFound from './components/NotFound';

export default function App() {
  return (
    <main className='container'>
      <WatchListContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<StockOverviewPage />} />
            <Route path='/detail/:symbol' element={<StockDetailsPage />} />
            <Route path='*' element={<NotFound />}></Route>
          </Routes>
        </BrowserRouter>
      </WatchListContextProvider>
    </main>
  );
}
