import { useRoutes } from 'react-router-dom';

import LandingRoutes from './landingRoutes';
import TeacherRoutes from './teacherRoutes';

function Router() {
  const routes = [
    ...LandingRoutes,
    {
      path: 'teachers',
      children: [...TeacherRoutes],
    },
    {
      path: '*',
      element: <div className="flex items-center justify-center h-screen text-slate-500">Halaman tidak ditemukan.</div>,
    },
  ];

  return useRoutes(routes);
}

export default Router;
