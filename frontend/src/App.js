import './App.css';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from './slice/authSlice';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Dashboard from './compoments/Dashboard/Dashboard';
import LandingPage from './pages/landingPage/langingPage';
import Login from './pages/login/login';
import Signup from './pages/signup';
import WasteMenu from './foodWasteManagement/WasteMenu';
import ListMenu from './listManagement/listMenu';
import { ToastContainer } from 'react-toastify';
import InventryMenu from './inventoryManagement/inventoryMenu';
import BudgetMenu from './budgetManagement/budgetMenu';
import UserMenu from './userManagement/userMenu';
import CategoryMenu from './categoryManagement/CategoryMenu';
import VoiceControl from './VoiceControl';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {

  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check for existing auth data in localStorage
    if (typeof window !== 'undefined') {
      const storedAuth = localStorage.getItem('auth');
      if (storedAuth) {
        const { user, token } = JSON.parse(storedAuth);
        dispatch(setCredentials({ user, token }));
      }
    }
  }, [dispatch]);


  return (
    <Router>
      <div className="App">
        <ToastContainer />
        {isAuthenticated && <VoiceControl />}
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/waste-management/*"
            element={
              <ProtectedRoute>
                <WasteMenu />
              </ProtectedRoute>
            }
          />
          <Route
            path="/list-management/*"
            element={
              <ProtectedRoute>
                <ListMenu />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory-management/*"
            element={
              <ProtectedRoute>
                <InventryMenu />
              </ProtectedRoute>
            }
          />
          <Route
            path="/budget-management/*"
            element={
              <ProtectedRoute>
                <BudgetMenu />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user-management/*"
            element={
              <ProtectedRoute>
                <UserMenu />
              </ProtectedRoute>
            }
          />

          <Route
            path="/category-management/*"
            element={
              <ProtectedRoute>
                <CategoryMenu />
              </ProtectedRoute>
            }
          />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;