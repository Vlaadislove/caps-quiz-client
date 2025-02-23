import React, { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../redux/Auth/AuthSlice';

type FormData = {
  login: string;
  password: string;
};

const LoginForm = () => {
  const [formData, setFormData] = useState<FormData>({ login: '', password: '' });
  const [errorAuth, setErrorAuth] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()

  useEffect(() => {
    console.log('Updated errorAuth:', errorAuth);
  }, [errorAuth]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(loginUser(formData));
      console.log('Dispatch Result:', resultAction);

      if (loginUser.rejected.match(resultAction)) {
        console.log('Setting errorAuth to:', resultAction.payload?.error);
        setErrorAuth(resultAction.payload?.error || 'An error occurred.');
        console.log('After setErrorAuth call');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setErrorAuth('Unexpected error occurred. Please try again.');
    }
  };


  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f3f4f6',
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: '#333',
          padding: '32px',
          borderRadius: '16px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          width: '320px',
          color: 'white',
        }}
      >
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '24px',
          textAlign: 'center',
        }}>Login</h2>
        <div style={{ marginBottom: '16px' }}>
          <label
            htmlFor="login"
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '0.875rem',
              fontWeight: '500',
            }}
          >
            Login
          </label>
          <input
            type="text"
            id="login"
            name="login"
            value={formData.login}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #4b5563',
              backgroundColor: '#1f2937',
              color: 'white',
              outline: 'none',
              boxShadow: '0 0 0 2px transparent',
              transition: 'box-shadow 0.2s',
            }}
            placeholder="Enter your login"
            required
          />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label
            htmlFor="password"
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '0.875rem',
              fontWeight: '500',
            }}
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #4b5563',
              backgroundColor: '#1f2937',
              color: 'white',
              outline: 'none',
              boxShadow: '0 0 0 2px transparent',
              transition: 'box-shadow 0.2s',
            }}
            placeholder="Enter your password"
            required
          />
        </div>
        {errorAuth && <p style={{ color: 'red', marginBottom: '16px' }}>{errorAuth}</p>}
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '8px 0',
            backgroundColor: '#2563eb',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '600',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
        >
          Submit
        </button>
      </form>
    </div>
  );
};


export default LoginForm;
