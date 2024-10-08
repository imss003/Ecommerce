import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';
import { useUserStore } from './stores/useUserStore';
import { useEffect } from 'react';
import LoadingSpinner from './components/LoadingSpinner';
import AdminPage from './pages/AdminPage';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import { useCartStore } from './stores/useCartStore';
import ProfilePage from './pages/ProfilePage';
import UpdateProfilePage from './pages/UpdateProfilePage';


function App() {
  const {user, checkAuth, checkingAuth} = useUserStore();
  const {getCartItems} = useCartStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  useEffect(() => {
    if(!user){
      return;
    }
    getCartItems();
  }, [getCartItems, user]);
  
  if(checkingAuth){
    return (<LoadingSpinner/>);
  }

  // console.log("User in app.jsx: ", user);
  
  return (
    <div
      className='min-h-screen bg-gray-900 text-white relative overflow-hidden'
    >
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Background gradient */}
			<div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black" />
        </div>
      </div>

      <div
        className='relative z-50 pt-20'
      >
        {<Navbar/>}
        <Routes>
          <Route path='/' element={<HomePage/>} />
          <Route path='/signup' element={!user ? <SignUpPage/> : <Navigate to='/' />} />
          <Route path='/login' element={!user ? <LoginPage/> : <Navigate to='/' /> } />
          <Route path='/secret-dashboard' element={user?.role === 'admin' ? <AdminPage/> : <Navigate to='/' /> } />
          <Route path='/category/:category' element={ <CategoryPage/> } />
          <Route path='/cart' element={ user ? <CartPage/> : <Navigate to={'/login'} /> } />
          <Route path='/profile' element={<ProfilePage/>} />
          <Route path='/update-profile' element={<UpdateProfilePage/>} />
        </Routes>
      </div>
      <Toaster/>
    </div>
  )
}

export default App
