import { createContext, ReactNode, useState , useEffect} from "react";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { api } from "../services/api";

WebBrowser.maybeCompleteAuthSession();

interface UserProps {
  name: string;
  avatarUrl: string;
}
export interface AuthContextDataProps {
  user: UserProps;
  isUserLoading: boolean;
  signIn: () => Promise<void>;
}

interface AuthProviderPros{
  children: ReactNode;
}
export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({ children }:AuthProviderPros) {
  const [user , setUser] =  useState<UserProps>({} as UserProps);
  const [isUserLoading, setIsUserLoading] = useState(false);

  console.log(process.env.CLIENT_ID_GOOGLE)
  
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId : "66271773110-86k8oihlvhfs8tn1dadf2a6i8jfs49us.apps.googleusercontent.com",
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ['profile','email']
  })

  async function signIn() {
    try {
      setIsUserLoading(true);
      await promptAsync();

    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsUserLoading(false);
    }
  }
 async function signInWithGoogle(access_token:string) {
  try {
    setIsUserLoading(true);

    const response =  await api.post('/users', { access_token })
    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
    const userInfoResponse = await api.get('/me')
    setUser(userInfoResponse.data.user)

    console.log(user)

  } catch (error) {
    console.log(error)
    throw error;
  } finally{
    setIsUserLoading(false)
  }
  
 }

  useEffect(() => {
    if(response?.type === 'success' && response.authentication?.accessToken){
      signInWithGoogle(response.authentication.accessToken)
    }
  }, [response])

  return(
    <AuthContext.Provider value={{
      signIn,
      isUserLoading,
      user
    }}>
      {children}

    </AuthContext.Provider>
  )
}