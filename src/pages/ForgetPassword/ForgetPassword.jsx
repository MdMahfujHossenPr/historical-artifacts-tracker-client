import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const ForgetPassword = () => {
  const { resetPassword } = useAuth();
  
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      alert('Check your email for password reset instructions.');
    } catch (error) {
      console.error('Error resetting password:', error);
    }
  };

  return (
    <div>
      <title>Forget Password</title>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ForgetPassword;

