// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Dashboard from './pages/Dashboard';
// import ReportGenerator from './pages/ReportGenerator';
// import Login from './pages/Login';
// import { UserProvider } from './context/UserContext';

// function App() {
//   return (
//     <UserProvider>
//       <Router>
//         <div className="min-h-screen bg-gray-50">
//           <Navbar />
//           <div className="container mx-auto px-4 py-8">
//             <Routes>
//               <Route path="/" element={<Login />} />
//               <Route path="/dashboard" element={<Dashboard />} />
//               <Route path="/reports" element={<ReportGenerator />} />
//             </Routes>
//           </div>
//         </div>
//       </Router>
//     </UserProvider>
//   );
// }

// export default App;



import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ReportGenerator from './pages/ReportGenerator';
import Login from './pages/Login';
import { UserProvider, useUser } from './context/UserContext';

// Create an authenticated layout component
const AuthenticatedLayout = ({ children }) => {
  const { user } = useUser();
  console.log('AuthenticatedLayout rendering with user:', user);
  
  // Use useEffect for navigation instead of direct return
  useEffect(() => {
    if (!user) {
      console.log('No user found in AuthenticatedLayout, will redirect to login');
    }
  }, [user]);
  
  if (!user) {
    console.log('Redirecting to login page');
    return <Navigate to="/" replace />;
  }
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </>
  );
};

// Create a login layout without navbar
const LoginLayout = ({ children }) => (
  <div className="container mx-auto px-4 py-8">
    {children}
  </div>
);

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginLayout><Login /></LoginLayout>} />
      <Route 
        path="/dashboard" 
        element={<AuthenticatedLayout><Dashboard /></AuthenticatedLayout>} 
      />
      <Route 
        path="/reports" 
        element={<AuthenticatedLayout><ReportGenerator /></AuthenticatedLayout>} 
      />
    </Routes>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;