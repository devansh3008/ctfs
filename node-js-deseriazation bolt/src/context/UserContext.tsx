// import React, { createContext, useState, useContext } from 'react';

// interface UserContextType {
//   user: any;
//   setUser: (user: any) => void;
// }

// const UserContext = createContext<UserContextType | undefined>(undefined);

// export function UserProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState(null);

//   return (
//     <UserContext.Provider value={{ user, setUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// }

// export function useUser() {
//   const context = useContext(UserContext);
//   if (context === undefined) {
//     throw new Error('useUser must be used within a UserProvider');
//   }
//   return context;
// }



// src/context/UserContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  username: string;
  // other user properties
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export const UserProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Check if we already have a user in sessionStorage
  const savedUser = sessionStorage.getItem('user');
  const [user, setUser] = useState<User | null>(savedUser ? JSON.parse(savedUser) : null);

  // When user changes, update sessionStorage
  useEffect(() => {
    console.log('UserContext user changed:', user);
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('user');
    }
  }, [user]);

  const setUserWithStorage = (newUser: User | null) => {
    console.log('Setting user:', newUser);
    setUser(newUser);
  };

  return (
    <UserContext.Provider value={{ user, setUser: setUserWithStorage }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);