import { inputStyle, buttonStyle } from '../styles/theme';

export default function AuthForm({ 
  isSignUp, 
  setIsSignUp, 
  email, 
  setEmail, 
  password, 
  setPassword, 
  username, 
  setUsername, 
  onSubmit 
}) {
  return (
    <section style={{ 
      marginBottom: '30px', 
      padding: '20px', 
      backgroundColor: '#1e1e1e', 
      borderRadius: '8px',
      border: '1px solid #333'
    }}>
      <h2 style={{ marginTop: 0, color: '#fff', fontSize: '1.25rem' }}>
        {isSignUp ? 'Create an Account' : 'Sign In to Add Characters'}
      </h2>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
        {isSignUp && (
          <input 
            type="text" 
            placeholder="Username (Display Name)" 
            required
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            style={inputStyle}
          />
        )}
        <input 
          type="email" 
          placeholder="Email Address" 
          required
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          style={inputStyle}
        />
        <input 
          type="password" 
          placeholder="Password" 
          required
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          style={inputStyle}
        />
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '6px' }}>
          <button type="submit" style={buttonStyle}>
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
          <button 
            type="button" 
            onClick={() => setIsSignUp(!isSignUp)} 
            style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', fontSize: '0.9rem' }}
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </form>
    </section>
  );
}