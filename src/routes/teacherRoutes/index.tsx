import { TeachersList } from '@/pages/Teachers/List';
import { TeacherDetail } from '@/pages/Teachers/Detail';
import { TeacherAchievement } from '@/pages/Teachers/Achievement';

const teacherRoutes = [
  {
    path: '',
    element: <TeachersList />,
  },
  {
    path: 'achievement',
    element: <TeacherAchievement />,
  },
  {
    path: ':id',
    element: <TeacherDetail />,
  },
];

export default teacherRoutes;
