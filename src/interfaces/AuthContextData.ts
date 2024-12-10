import { AuthData } from "./AuthData";

/**
 * Interface que define o formato dos dados do contexto de autenticação.
 */
interface SignInProp {
  email: string;
  password: string;
}

interface AuthContextData {
  /** Dados de autenticação do usuário. */
  authData?: AuthData;
  /** Função para fazer login. */
  signIn: (data: SignInProp) => Promise<void>;
  /** Função para fazer logout. */
  signOut: () => Promise<void>;
  /** Indicador de carregamento. */
  loading: boolean;
}

export { AuthContextData, SignInProp, AuthData };
