import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import api from '../API/axios';

interface UserData {
  cnpj: string,
  createdAt: string,
  email: string,
  id: string,
  name: string,
  restaurantName: string,
  stripeCustomerId: string | null
  subscriptionStatus: string,
  updatedAt: string,
}

interface UserFuncionario {
  cnpj: string,
  createdAt: string,
  email: string,
  id: string,
  name: string,
  role: 'admin' | 'kitchen' | 'waiter' | null,
  restaurantName: string,
  stripeCustomerId: string | null
  subscriptionStatus: string,
  updatedAt: string,
}

interface AuthState {
  user: UserData | null;
  userRole: 'admin' | 'kitchen' | 'waiter' | null;
  loading: boolean;
  displayName: string | null;
}

interface AuthContextData extends AuthState {
  signUp: (data: SignUpData) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
}

interface SignUpData {
  email: string;
  password: string;
  role: 'admin' | 'kitchen' | 'waiter';
  restaurantName: string;
  name: string;
}

interface UpdateProfileData {
  name?: string;
  role?: 'admin' | 'kitchen' | 'waiter';
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const supabase: SupabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    userRole: null,
    loading: true,
    displayName: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Check active sessions and subscribe to auth changes
    const client = localStorage.getItem('client');

    if (client) {
      loadUserData(JSON.parse(client));
    } else {
      setState({ user: null, userRole: null, loading: false, displayName: null });
    }
  }, []);

  const loadUserData = async (user: UserData) => {

    // Load user role and profile data
    setState({
      user,
      userRole: 'admin',
      loading: false,
      displayName: user.name,
    });


    // Redirect based on user role

    navigate("/dashboard");

    //  navigate('/comandas');

    // navigate('/mesas');

  };

  const loadUserDataFuncionario = async (user: UserFuncionario) => {

    // Load user role and profile data
    setState({
      user,
      userRole: user.role,
      loading: false,
      displayName: user.name,
    });

    // Redirect based on user role
    if (user.role === 'kitchen') {
      navigate('/comandas');
    }

    if (user.role === 'waiter') {
      navigate('/mesas');
    }


  };

  const signUp = async ({ email, password, role, name, restaurantName }: SignUpData) => {

    try {
      const response = await api.post('/clientes', { email, password, role, name, restaurantName });
      toast.success('Conta criada com sucesso! Verifique seu e-mail.');
      navigate('/login');
      //return response.data;

    } catch (error) {
      console.error('Error signing up:', error);
      toast.error('Erro ao criar conta');
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/client-login', { email, password });
      toast.success('Login realizado com sucesso!');

      loadUserData(response.data.cliente)
      //return response.data;

    } catch (error) {
      console.error('Error signing in:', error);
      toast.error('E-mail ou senha incorretos');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setState({ user: null, userRole: null, loading: false, displayName: null });
      localStorage.clear()
      toast.success('Logout realizado com sucesso!');
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Erro ao fazer logout');
      throw error;
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      if (!state.user) {
        throw new Error('Usuário não autenticado');
      }

      // Update auth user metadata
      if (data.name) {
        const { error: userError } = await supabase.auth.updateUser({
          data: { name: data.name },
        });

        if (userError) throw userError;

        // Update profile name
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({ id: state.user.id, name: data.name });

        if (profileError) throw profileError;
      }

      // Update user role if provided
      if (data.role) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .update({ role: data.role })
          .eq('user_id', state.user.id);

        if (roleError) throw roleError;
      }

      toast.success('Perfil atualizado com sucesso!');
      await loadUserData(state.user);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erro ao atualizar perfil');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signUp,
        signIn,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};