import { RouteObject } from 'react-router-dom';
import CoinTable from './pages/LandingPage/CoinTable';
import CoinDetails from './pages/CoinDetails';
import RootLayout from './layout/MainLayout';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <CoinTable />,
      },
      {
        path: 'coin/:coinId',
        element: <CoinDetails />,
      },
    ],
  },
];