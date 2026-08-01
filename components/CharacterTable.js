import { CLASS_COLORS } from '../utils/constants';
import { getUsernameColor, formatName } from '../utils/helpers';
import { thStyle, tdStyle, smallBtnStyle } from '../styles/theme';

export default function CharacterTable({ characters, session, onLevelChange }) {
  return (
    <section style={{ 
      marginBottom: '30px', 
      backgroundColor: '#1e1e1e', 
      borderRadius: '8px', 
      padding: '20px',
      border: '1px solid #333'
    }}>
      <h2 style={{ marginTop: 0, color: '#fff', fontSize: '1.25rem' }}>
        All Characters ({characters.length})
      </h2>
      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #444', color: '#aaa' }}>
            <th style={thStyle}>Player</th>
            <th style={thStyle}>Character Name</th>
            <th style={thStyle}>Class/Spec</th>
            <th style={thStyle}>Level</th>
            <th style={thStyle}>Bracket</th>
          </tr>
        </thead>
        <tbody>
          {characters.length > 0 ? characters.map(char => {
            const isOwner = session?.user && char.user_id === session.user.id;
            const playerName = char.users?.username || 'Guest';
            const userColor = getUsernameColor(playerName);
            const classColor = CLASS_COLORS[char.class_spec] || '#e0e0e0';

            return (
              <tr key={char.id} style={{ borderBottom: '1px solid #2a2a2a' }}>
                <td style={{ ...tdStyle, color: userColor, fontWeight: 'bold' }}>
                  {playerName}
                </td>
                <td style={{ ...tdStyle, color: '#fff', fontWeight: 'bold' }}>
                  {formatName(char.name)}
                </td>
                <td style={{ ...tdStyle, color: classColor, fontWeight: '600' }}>
                  {char.class_spec}
                </td>
                
                <td style={tdStyle}>
                  {isOwner ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button 
                        type="button" 
                        onClick={() => onLevelChange(char.id, char.level - 1)}
                        disabled={char.level <= 1}
                        style={smallBtnStyle}
                      >
                        -
                      </button>

                      <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: 'bold', color: '#fff' }}>
                        {char.level}
                      </span>

                      <button 
                        type="button" 
                        onClick={() => onLevelChange(char.id, char.level + 1)}
                        disabled={char.level >= 60}
                        style={smallBtnStyle}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontWeight: 'bold', color: '#aaa', paddingLeft: '8px' }}>
                      {char.level}
                    </span>
                  )}
                </td>

                <td style={tdStyle}>
                  <span style={{ 
                    padding: '2px 8px', 
                    backgroundColor: '#2a2a2a', 
                    borderRadius: '12px', 
                    fontSize: '0.85rem',
                    color: '#60a5fa' 
                  }}>
                    {char.bg_bracket}
                  </span>
                </td>
              </tr>
            );
          }) : (
            <tr>
              <td colSpan="5" style={{ ...tdStyle, textAlign: 'center', color: '#777' }}>
                No characters found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}