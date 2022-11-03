import { createContext, ReactNode } from "react";
interface UserProps {
  name: string;
  avatarUrl: string;
}
export interface AuthContextDataProps {
  user: UserProps;
  signIn: () => Promise<void>;
}

interface AuthProviderPros{
  children: ReactNode;
}
export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({ children }:AuthProviderPros) {
  async function signIn() {
    
  }
  return(
    <AuthContext.Provider value={{
      signIn,
      user: {
        name: 'fernando',
        avatarUrl: 'https://github.com/FernandoLopesTI.png'
      }
    }}>
      {children}

    </AuthContext.Provider>
  )
}