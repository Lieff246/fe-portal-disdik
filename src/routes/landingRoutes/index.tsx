import { Home } from '@/pages/Home';
import { CabangDinas } from '@/pages/CabangDinas';
import About from '@/pages/About';
import { KabupatenDetail } from '@/pages/KabupatenDetail';
import { KabupatenKota } from '@/pages/KabupatenKota';
import { SekolahDetail } from '@/pages/SekolahDetail';
import { ProvinsiDetail } from '@/pages/ProvinsiDetail';

const landingRoutes = [
  {
    path: '',
    element: <Home />,
  },
  {
    path: 'provinsi',
    element: <ProvinsiDetail />,
  },
  {
    path: 'cabdis-1',
    element: <CabangDinas slug="cabdis-1" />,
  },
  {
    path: 'cabdis-2',
    element: <CabangDinas slug="cabdis-2" />,
  },
  {
    path: 'cabdis-3',
    element: <CabangDinas slug="cabdis-3" />,
  },
  {
    path: 'cabdis-4',
    element: <CabangDinas slug="cabdis-4" />,
  },
  {
    path: 'cabdis-5',
    element: <CabangDinas slug="cabdis-5" />,
  },
  {
    path: 'cabdis-6',
    element: <CabangDinas slug="cabdis-6" />,
  },
  {
    path: 'kabupaten',
    element: <KabupatenKota />,
  },
  {
    path: 'kabupaten/:kodeKabupaten',
    element: <KabupatenDetail />,
  },
  {
    path: 'sekolah/:npsn',
    element: <SekolahDetail />,
  },
  {
    path: 'about',
    element: <About />,
  },
];

export default landingRoutes;
