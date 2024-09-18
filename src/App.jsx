import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import { useSocket } from './socketProvider.jsx'; // Access the socket through SocketProvider
import axios from 'axios';

// Lazy loading components
const Home = lazy(() => import('./component/home.jsx'));
const Login = lazy(() => import('./component/login.jsx'));

// import { BASE_URL } from '../../public/constant.js';

const App = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [contact, setContact] = useState([]);
  const socket = useSocket(); // Use socket from socketProvider

  useEffect(() => {
    const localStorageUser = localStorage.getItem('user');
    if (localStorageUser) {
      const parsedUser = JSON.parse(localStorageUser);
      setUser(parsedUser);
      console.log(parsedUser);

      const updateSocketId = async () => {
        try {
          await axios.post(`${BASE_URL}/api/updatedata`, {
            uid: parsedUser.uid,
            socketId: socket.id
          });
          console.log('Socket ID updated successfully', socket.id);
        } catch (error) {
          console.error('Error updating socket ID:', error);
        }
      };
      updateSocketId();

      navigate('/');
    } else {
      navigate('/login');
    }
  }, [navigate, socket.id]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route
          path='/'
          element={user ? (
            <Home user={user} setUser={setUser} socket={socket} contact={contact} setContact={setContact} />
          ) : (
            <Navigate to='/login' />
          )}
        />
        <Route
          path='/login'
          element={!user ? (
            <Login setUser={setUser} socket={socket} />
          ) : (
            <Navigate to='/' />
          )}
        />
        <Route path='*' element={<Navigate to={user ? '/' : '/login'} />} />
      </Routes>
    </Suspense>
  );
};

export default App;
