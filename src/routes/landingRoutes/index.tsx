import { Home } from '@/pages/Home';
import { CabangDinas } from '@/pages/CabangDinas';

const landingRoutes = [
  {
    path: '',
    element: <Home />,
  },
  {
    path: 'cabang/:id',
    element: <CabangDinas />,
  },
];

export default landingRoutes;
