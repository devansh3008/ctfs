// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { LayoutDashboard, FileText, LogOut } from 'lucide-react';
// import { useUser } from '../context/UserContext';

// export default function Navbar() {
//   const { user, setUser } = useUser();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     setUser(null);
//     navigate('/');
//   };

//   if (!user) return null;

//   return (
//     <nav className="bg-white shadow-lg">
//       <div className="container mx-auto px-6 py-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center">
//             <span className="text-xl font-bold text-gray-800">Atlas Enterprise Portal</span>
//           </div>
//           <div className="flex items-center space-x-6">
//             <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-blue-500">
//               <LayoutDashboard className="w-5 h-5 mr-2" />
//               <span>Dashboard</span>
//             </Link>
//             <Link to="/reports" className="flex items-center text-gray-600 hover:text-blue-500">
//               <FileText className="w-5 h-5 mr-2" />
//               <span>Reports</span>
//             </Link>
//             <button
//               onClick={handleLogout}
//               className="flex items-center text-gray-600 hover:text-red-500"
//             >
//               <LogOut className="w-5 h-5 mr-2" />
//               <span>Logout</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }


import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, LogOut } from 'lucide-react';
import { useUser } from '../context/UserContext';

// Define UserContext types if missing
interface User {
  username: string;
  // Add other user properties as needed
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export default function Navbar(): JSX.Element | null {
  const { user, setUser } = useUser() as UserContextType;
  const navigate = useNavigate();

  const handleLogout = (): void => {
    setUser(null);
    navigate('/');
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-800">Atlas Enterprise Portal</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-blue-500">
              <LayoutDashboard className="w-5 h-5 mr-2" />
              <span>Dashboard</span>
            </Link>
            <Link to="/reports" className="flex items-center text-gray-600 hover:text-blue-500">
              <FileText className="w-5 h-5 mr-2" />
              <span>Reports</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-red-500"
            >
              <LogOut className="w-5 h-5 mr-2" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}