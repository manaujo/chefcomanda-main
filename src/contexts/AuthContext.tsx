import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
import { DatabaseService } from "../services/database";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface AuthState {
  user: User | null;
  userRole: "admin" | "kitchen" | "waiter" | "cashier" | "stock" | null;
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
  role: "admin" | "kitchen" | "waiter" | "cashier" | "stock";
  name: string;
}

interface UpdateProfileData {
  name?: string;
  role?: "admin" | "kitchen" | "waiter" | "cashier" | "stock";
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const supabase: SupabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    userRole: null,
    loading: true,
    displayName: null
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Check active sessions and subscribe to auth changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserData(session.user);
      } else {
        setState((prev) => ({ ...prev, loading: false }));
      }
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUserData(session.user);
      } else {
        setState({
          user: null,
          userRole: null,
          loading: false,
          displayName: null
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserData = async (user: User) => {
    try {
      // Load user role and profile data
      const [
        { data: roleData, error: roleError },
        { data: profileData, error: profileError }
      ] = await Promise.all([
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase.from("profiles").select("name").eq("id", user.id).maybeSingle()
      ]);

      if (roleError && roleError.code !== "PGRST116") throw roleError;
      if (profileError && profileError.code !== "PGRST116") throw profileError;

      setState({
        user,
        userRole: roleData?.role || "admin", // Default to admin if no role found
        loading: false,
        displayName: profileData?.name || user.user_metadata?.name || null
      });

      // Redirect based on user role
      const role = roleData?.role || "admin";
      switch (role) {
        case "admin":
          navigate("/dashboard");
          break;
        case "kitchen":
          navigate("/dashboard/comandas");
          break;
        case "waiter":
          navigate("/dashboard/mesas");
          break;
        case "cashier":
          navigate("/dashboard/caixa");
          break;
        case "stock":
          navigate("/dashboard/estoque");
          break;
        default:
          navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      toast.error("Erro ao carregar dados do usuário");
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const signUp = async ({ email, password, role, name }: SignUpData) => {
    try {
      const {
        data: { user },
        error
      } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });

      if (error) throw error;
      if (!user) throw new Error("Erro ao criar usuário");

      // Create user profile
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({ id: user.id, name });

      if (profileError) throw profileError;

      // Create user role record
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({ user_id: user.id, role });

      if (roleError) throw roleError;

      // Create audit log
      await DatabaseService.createAuditLog({
        user_id: user.id,
        action_type: "create",
        entity_type: "user",
        entity_id: user.id,
        details: { name, role }
      });

      toast.success("Conta criada com sucesso! Verifique seu e-mail.");
      navigate("/auth/verify-email");
    } catch (error) {
      console.error("Error signing up:", error);
      if (error instanceof Error && error.message.includes("Failed to fetch")) {
        toast.error(
          "Erro de conexão. Verifique sua internet e tente novamente."
        );
      } else {
        toast.error("Erro ao criar conta");
      }
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      toast.success("Login realizado com sucesso!");
    } catch (error) {
      console.error("Error signing in:", error);
      if (error instanceof Error && error.message.includes("Failed to fetch")) {
        toast.error(
          "Erro de conexão. Verifique sua internet e tente novamente."
        );
      } else if (
        error instanceof Error &&
        error.message.includes("Invalid login credentials")
      ) {
        toast.error("E-mail ou senha incorretos");
      } else {
        toast.error("Erro ao fazer login");
      }
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // First, clear the local state immediately
      setState({
        user: null,
        userRole: null,
        loading: false,
        displayName: null
      });

      // Then attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();

      // Handle specific auth session errors gracefully
      if (error) {
        // If the session is already missing or invalid, that's actually fine for logout
        if (
          error.message.includes("Auth session missing") ||
          error.message.includes("session_not_found") ||
          error.message.includes(
            "Session from session_id claim in JWT does not exist"
          )
        ) {
          // Session was already invalid, which means user is effectively logged out
          console.log(
            "Session was already invalid - user logged out successfully"
          );
        } else {
          // For other errors, we still want to throw
          throw error;
        }
      }

      toast.success("Logout realizado com sucesso!");
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);

      // Even if there's an error with the server logout, the user is still logged out locally
      // So we don't need to show an error message in most cases
      if (error instanceof Error && error.message.includes("Failed to fetch")) {
        toast.error("Erro de conexão, mas você foi desconectado localmente.");
      } else if (
        error instanceof Error &&
        !error.message.includes("Auth session missing") &&
        !error.message.includes("session_not_found")
      ) {
        // Only show error for unexpected errors
        toast.error(
          "Erro ao fazer logout, mas você foi desconectado localmente."
        );
      }

      // Always navigate to login regardless of server-side logout success
      navigate("/login");
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      if (!state.user) {
        throw new Error("Usuário não autenticado");
      }

      // Update auth user metadata
      if (data.name) {
        const { error: userError } = await supabase.auth.updateUser({
          data: { name: data.name }
        });

        if (userError) throw userError;

        // Update profile name
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert({ id: state.user.id, name: data.name });

        if (profileError) throw profileError;
      }

      // Update user role if provided
      if (data.role) {
        const { error: roleError } = await supabase
          .from("user_roles")
          .update({ role: data.role })
          .eq("user_id", state.user.id);

        if (roleError) throw roleError;
      }

      // Create audit log
      await DatabaseService.createAuditLog({
        user_id: state.user.id,
        action_type: "update",
        entity_type: "user",
        entity_id: state.user.id,
        details: data
      });

      toast.success("Perfil atualizado com sucesso!");
      await loadUserData(state.user);
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error instanceof Error && error.message.includes("Failed to fetch")) {
        toast.error(
          "Erro de conexão. Verifique sua internet e tente novamente."
        );
      } else {
        toast.error("Erro ao atualizar perfil");
      }
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
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
