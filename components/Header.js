import { secondaryBtnStyle } from '../styles/theme';

export default function Header({ session, onSignOut }) {
  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      borderBottom: '2px solid #333', 
      paddingBottom: '10px',
      marginBottom: '20px'
    }}>
      <h1 style={{ color: '#ffffff', margin: 0, fontSize: '1.75rem' }}>
        ⚔️ Ascension WoW Matchmaker
      </h1>

      {session && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.9rem', color: '#aaa' }}>
            Logged in as <strong style={{ color: '#60a5fa' }}>{session.user.email}</strong>
          </span>
          <button onClick={onSignOut} style={secondaryBtnStyle}>
            Sign Out
          </button>
        </div>
      )}
    </header>
  );
}