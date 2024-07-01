import Cookies from 'js-cookie';
import { redirect } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export interface User { 
  sub: string;
  name: string;
  typeAccount: string;
}

export function getUser(): User | null {
  const token = Cookies.get("token");

  if (!token) {
    redirect('/login');
    return null;
  }

  // Verificar se o token está no formato JWT
  const parts = token.split('.');
  if (parts.length !== 3) {
    Cookies.remove("token");
    redirect('/login');
    return null;
  }

  let user: User;
  try {
    user = jwtDecode<User>(token);
  } catch (error) {
    Cookies.remove("token");
    redirect('/login');
    return null;
  }

  return user;
}
