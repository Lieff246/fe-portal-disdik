import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { AdminBar } from '@/components/Admin/AdminBar';
import Router from './routes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminBar />
        <Router />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
