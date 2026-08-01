import { ASCENSION_CLASSES } from '../utils/constants';
import { inputStyle, buttonStyle } from '../styles/theme';

export default function AddCharacterForm({ newChar, setNewChar, onSubmit }) {
  return (
    <section style={{ 
      marginBottom: '30px', 
      padding: '20px', 
      backgroundColor: '#1e1e1e', 
      borderRadius: '8px',
      border: '1px solid #333'
    }}>
      <h2 style={{ marginTop: 0, color: '#fff', fontSize: '1.25rem' }}>Add a Character</h2>
      <form onSubmit={onSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Character Name" 
          required
          value={newChar.name} 
          onChange={e => setNewChar({ ...newChar, name: e.target.value })} 
          style={inputStyle}
        />
        
        <select 
          value={newChar.class_spec} 
          onChange={e => setNewChar({ ...newChar, class_spec: e.target.value })} 
          style={inputStyle}
        >
          {ASCENSION_CLASSES.map(className => (
            <option key={className} value={className}>
              {className}
            </option>
          ))}
        </select>

        <input 
          type="number" 
          placeholder="Level (1-60)" 
          min="1" 
          max="60" 
          required
          value={newChar.level} 
          onChange={e => setNewChar({ ...newChar, level: e.target.value })} 
          style={{ ...inputStyle, width: '110px' }}
        />
        <button type="submit" style={buttonStyle}>Add Character</button>
      </form>
    </section>
  );
}