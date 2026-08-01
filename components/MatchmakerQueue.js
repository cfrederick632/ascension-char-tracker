import { CLASS_COLORS } from '../utils/constants';
import { getUsernameColor, formatName } from '../utils/helpers';
import { inputStyle } from '../styles/theme';

export default function MatchmakerQueue({ characters, selectedBracket, setSelectedBracket }) {
  const matches = characters.filter(c => c.bg_bracket === selectedBracket);

  return (
    <section style={{ 
      marginBottom: '30px', 
      padding: '20px', 
      backgroundColor: '#1e1e1e', 
      borderRadius: '8px', 
      border: '1px solid #333' 
    }}>
      <h2 style={{ marginTop: 0, color: '#fff', fontSize: '1.25rem' }}>Matchmaker Queue</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
        <label style={{ color: '#aaa' }}>Select Bracket to Queue: </label>
        <select 
          value={selectedBracket} 
          onChange={e => setSelectedBracket(e.target.value)}
          style={inputStyle}
        >
          <option value="10-19">10-19</option>
          <option value="20-29">20-29</option>
          <option value="30-39">30-39</option>
          <option value="40-49">40-49</option>
          <option value="50-59">50-59</option>
          <option value="60-60">Level 60</option>
        </select>
      </div>

      <h3 style={{ color: '#60a5fa', fontSize: '1.1rem' }}>
        Available Friends in {selectedBracket}
      </h3>
      <ul style={{ paddingLeft: '20px', color: '#ccc', marginBottom: 0 }}>
        {matches.length > 0 ? matches.map(match => {
          const matchPlayerName = match.users?.username || 'Guest';
          const matchUserColor = getUsernameColor(matchPlayerName);
          const matchClassColor = CLASS_COLORS[match.class_spec] || '#fff';

          return (
            <li key={match.id} style={{ marginBottom: '8px' }}>
              <strong style={{ color: matchUserColor }}>{matchPlayerName}</strong> can play{' '}
              <strong style={{ color: '#fff' }}>{formatName(match.name)}</strong> (Level {match.level}{' '}
              <span style={{ color: matchClassColor, fontWeight: '600' }}>{match.class_spec}</span>)
            </li>
          );
        }) : (
          <p style={{ color: '#777', margin: 0 }}>No characters currently in this bracket.</p>
        )}
      </ul>
    </section>
  );
}