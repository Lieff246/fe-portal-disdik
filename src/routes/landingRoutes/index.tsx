import { Home } from '@/pages/Home';
import { CabangDinas } from '@/pages/CabangDinas';
import About from '@/pages/About';

const landingRoutes = [
  {
    path: '',
    element: <Home />,
  },
  {
    path: 'cabang/:id',
    element: <CabangDinas />,
  },
  {
    path: 'about',
    element: <About />,
  },
];

export default landingRoutes;
