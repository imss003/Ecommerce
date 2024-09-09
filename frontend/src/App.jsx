import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';
import { useUserStore } from './stores/useUserStore';
import { useEffect } from 'react';
import LoadingSpinner from './components/LoadingSpinner';


function App() {
  const {user, checkAuth, checkingAuth} = useUserStore();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  if(checkingAuth){
    return (<LoadingSpinner/>);
  }
  // console.log("User in app.jsx: ", user);
  return (
    <div
      className='min-h-screen bg-gray-900 text-white relative overflow-hidden'
    >
      {/* Background gradient */}
			<div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black" />
        </div>
      </div>

      <div
        className='relative z-50 pt-20'
      >
        {user && <Navbar/>}
        <Routes>
          <Route path='/' element={!user ? <LoginPage/> : <HomePage/>} />
          <Route path='/signup' element={!user ? <SignUpPage/> : <Navigate to='/' />} />
          <Route path='/login' element={!user ? <LoginPage/> : <Navigate to='/' /> } />
        </Routes>
      </div>
      <Toaster/>
    </div>
  )
}

export default App
