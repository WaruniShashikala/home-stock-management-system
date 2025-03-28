import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Dashboard from './conponents/Dashboard/Dashboard';
import LandingPage from './pages/landingPage/langingPage';
import Login from './pages/login/login';
import Signup from './pages/signup';
import WasteMenu from './foodWasteManagement/WasteMenu';
import ListMenu from './listManagement/listMenu';
import { ToastContainer } from 'react-toastify';
import InventryMenu from './inventoryManagement/inventoryMenu';
import BudgetMenu from './budgetManagement/budgetMenu';


// Protected Route wrapper
const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Simulate login/logout functions
  const handleLogin = () => {
    setIsAuthenticated(true);
    return <Navigate to="/dashboard" />;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    return <Navigate to="/" />;
  };

  return (
    <Router>
      <div className="App">
        <ToastContainer />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={<Login onLogin={handleLogin} />}
          />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Dashboard onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/waste-management/*"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <WasteMenu onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/list-management/*"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ListMenu onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/inventory-management/*"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <InventryMenu onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/budget-management/*"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <BudgetMenu onLogout={handleLogout} />
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