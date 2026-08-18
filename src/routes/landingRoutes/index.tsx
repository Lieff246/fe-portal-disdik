import { Home } from '@/pages/Home';
import { CabangDinas } from '@/pages/CabangDinas';
import About from '@/pages/About';
import { SchoolLanding } from '@/pages/SchoolLanding';
import { SchoolLandingSekolahku } from '@/pages/SchoolLandingSekolahku';
import { SchoolLandingV3 } from '@/pages/SchoolLandingV3';
import { KabupatenDetail } from '@/pages/KabupatenDetail';
import { SekolahDetail } from '@/pages/SekolahDetail';

const landingRoutes = [
  {
    path: '',
    element: <Home />,
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
  {
    path: 'sekolah2/:id',
    element: <SchoolLandingSekolahku />,
  },
  {
    path: 'sekolah3/:id',
    element: <SchoolLandingV3 />,
  },
];

export default landingRoutes;
