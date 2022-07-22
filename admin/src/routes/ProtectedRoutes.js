import Login from './Login/Login';
import App from './App/App/App';

export const useAuth = () => {
  const user = { isLoggedIn: false };
  if (window.localStorage.getItem('token')) {
    user.isLoggedIn = true;
  }
  return user && user.isLoggedIn;
};

const ProtectedRoutes = () => {
  const isAuth = useAuth();
  return isAuth ? <App /> : <Login />;
};

export default ProtectedRoutes;
