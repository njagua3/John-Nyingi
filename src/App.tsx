import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Tenants from './pages/Tenants';
import Landlords from './pages/Landlords';
import Properties from './pages/Properties';
import Login from './components/Login';
import SignUp from './components/SignUp';
import SearchBar from './components/SearchBar';

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? element : <Navigate to="/login" />;
};

const AdminRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const isAdmin = localStorage.getItem('role') === 'admin';
  return isAuthenticated && isAdmin ? element : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <SearchBar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
            <Route path="/tenants" element={<PrivateRoute element={<Tenants />} />} />
            <Route path="/landlords" element={<PrivateRoute element={<Landlords />} />} />
            <Route path="/properties" element={<PrivateRoute element={<Properties />} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;