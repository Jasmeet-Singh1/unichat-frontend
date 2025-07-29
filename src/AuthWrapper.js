import React, { useState } from 'react';
import Login from './components/chat/Login';
import Register from './components/chat/Register';

const AuthWrapper = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div>
      {isLogin ? (
        <Login onSwitchToRegister={() => setIsLogin(false)} />
      ) : (
        <Register onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </div>
  );
};

export default AuthWrapper;