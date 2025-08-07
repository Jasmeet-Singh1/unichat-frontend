import './Login.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

function Login() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Both email and password are required.');
      return;
    }

    if (!email.endsWith('@student.kpu.ca') && !email.endsWith('@mentor.kpu.ca')) {
      setError('Only KPU student or mentor emails are allowed.');
      return;
    }

    try {
      // First, perform login to get JWT token
      const loginRes = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        setError(loginData.message || 'Login failed');
        return;
      }

      // Save token and user data
      if (loginData.token) localStorage.setItem('token', loginData.token);
      if (loginData.user) localStorage.setItem('user', JSON.stringify(loginData.user));

      // Fetch user info using the token
      const userInfoRes = await fetch('http://localhost:5000/api/userProfile/current', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginData.token}`,
        },
      });

      const userInfoData = await userInfoRes.json();

      if (!userInfoRes.ok) {
        setError(userInfoData.message || 'Failed to fetch user info');
        return;
      }

      // Save role and name to localStorage
      localStorage.setItem('role', userInfoData.role);
      localStorage.setItem('userName', `${userInfoData.firstName} ${userInfoData.lastName}`);

      setError('');
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className='login-container'>
      <div className='gradient-boxes'>
        {Array.from({ length: 80 }).map((_, i) => (
          <div key={i} />
        ))}
      </div>

      <motion.div className='glow-orb orb-top-left' />
      <motion.div className='glow-orb orb-bottom-right' />
      <motion.div className='glow-orb orb-center' />

      <AnimatePresence>
        {!showLogin && (
          <motion.div
            className='intro-animation'
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
            <motion.h1
              className='unichat-title glow'
              initial={{ scale: 0.2, rotate: 180, opacity: 0 }}
              animate={{ scale: [1.7, 0.9, 1.3, 1], rotate: 0, opacity: 1 }}
              transition={{ duration: 1.4, ease: 'anticipate' }}
              onAnimationComplete={() => setTimeout(() => setShowLogin(true), 1400)}
            >
              UNI<span>CHAT</span>
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>

      {showLogin && (
        <motion.div
          className='login-content'
          initial={{ x: '100vw', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 60, damping: 12 }}
        >
          {error && <div className='error-box'>{error}</div>}

          <motion.div
            className='input-wrapper stylish-wrapper'
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <input
              type='email'
              placeholder='Enter your KPU Email'
              className='input-field neon-input'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className='password-wrapper'>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter your Password'
                className='input-field neon-input'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className='toggle-password' onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>

            <motion.button
              className='login-button gradient-button'
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleLogin}
            >
              Login
            </motion.button>

            <p className='signup-text'>
              Don't have an account?{' '}
              <a href='/signup' className='signup-link'>
                Sign up
              </a>
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default Login;
