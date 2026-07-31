import { useState, useEffect } from 'react';
import { supabase, calculateBracket } from '../utils/supabase';

// List of Ascension COA Classes
const ASCENSION_CLASSES = [
  'Barbarian',
  'Bloodmage',
  'Chronomancer',
  'Cultist',
  'Felsworn',
  'Guardian',
  'Knight of Xoroth',
  'Necromancer',
  'Primalist',
  'Pyromancer',
  'Ranger',
  'Reaper',
  'Runemaster',
  'Starcaller',
  'Stormbringer',
  'Sun Cleric',
  'Templar',
  'Tinker',
  'Venomancer',
  'Witch Doctor',
  'Witch Hunter'
];

// EASY TO EDIT: Class Color Map
const CLASS_COLORS = {
  'Barbarian':       '#C41E3A', // Red / Crimson
  'Bloodmage':       '#E35252', // Bright Red
  'Chronomancer':   '#69CCF0', // Light Blue
  'Cultist':        '#A335EE', // Purple
  'Felsworn':       '#A35C25', // Fel Brown / Orange
  'Guardian':       '#F58CBA', // Pink
  'Knight of Xoroth':'#C41F3B', // Dark Red
  'Necromancer':    '#4D5D53', // Dark Slate
  'Primalist':      '#FF7C0A', // Orange
  'Pyromancer':     '#FF4500', // Fire Orange
  'Ranger':         '#AAD372', // Light Green
  'Reaper':         '#71D5C4', // Teal / Turquoise
  'Runemaster':     '#00FF96', // Mint Green
  'Starcaller':     '#FFF569', // Yellow
  'Stormbringer':   '#0070DD', // Deep Blue
  'Sun Cleric':     '#F4C430', // Gold / Yellow
  'Templar':        '#F58CBA', // Paladin Pink
  'Tinker':         '#E6CC80', // Copper / Brass
  'Venomancer':     '#ABD473', // Venom Green
  'Witch Doctor':   '#00FF96', // Jade / Green
  'Witch Hunter':   '#D4AF37'  // Dark Gold
};

// Helper function to capitalize the first letter and lowercase the rest
const formatName = (str) => {
  if (!str) return '';
  const trimmed = str.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
};

export default function Home() {
  const [characters, setCharacters] = useState([]);
  const [newChar, setNewChar] = useState({ 
    name: '', 
    class_spec: ASCENSION_CLASSES[0], 
    level: '' 
  });
  const [selectedBracket, setSelectedBracket] = useState('20-29');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchCharacters();
  }, []);

  // Fetch characters and sort by level descending
  const fetchCharacters = async () => {
    const { data, error } = await supabase
      .from('characters')
      .select('*, users(username)')
      .order('level', { ascending: false });

    if (error) {
      console.error('Error fetching characters:', error.message);
      setErrorMessage(`Fetch Error: ${error.message}`);
    } else if (data) {
      setCharacters(data);
    }
  };

  // Add a new character with auto-formatted name and selected COA class
  const handleAddCharacter = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const levelNum = parseInt(newChar.level, 10);
    const bracket = calculateBracket(levelNum);
    const formattedName = formatName(newChar.name);
    
    const { error } = await supabase
      .from('characters')
      .insert([
        { 
          name: formattedName, 
          class_spec: newChar.class_spec, 
          level: levelNum, 
          bg_bracket: bracket
        }
      ]);
      
    if (error) {
      console.error('Error adding character:', error.message);
      setErrorMessage(`Insert Error: ${error.message}`);
    } else {
      fetchCharacters();
      setNewChar({ name: '', class_spec: ASCENSION_CLASSES[0], level: '' });
    }
  };

  // Easily update a character's level (+1, -1)
  const handleLevelChange = async (charId, newLevel) => {
    setErrorMessage('');
    const levelNum = Math.min(60, Math.max(1, parseInt(newLevel, 10) || 1));
    const newBracket = calculateBracket(levelNum);

    const { error } = await supabase
      .from('characters')
      .update({ level: levelNum, bg_bracket: newBracket })
      .eq('id', charId);

    if (error) {
      console.error('Error updating level:', error.message);
      setErrorMessage(`Update Error: ${error.message}`);
    } else {
      fetchCharacters();
    }
  };

  const matches = characters.filter(c => c.bg_bracket === selectedBracket);

  return (
    <div style={{ 
      backgroundColor: '#121212', 
      color: '#e0e0e0', 
      minHeight: '100vh', 
      padding: '30px 20px', 
      fontFamily: 'system-ui, -apple-system, sans-serif' 
    }}>
      {/* --- GLOBAL CSS RESET TO REMOVE WHITE BORDER --- */}
      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          background-color: #121212;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ color: '#ffffff', borderBottom: '2px solid #333', paddingBottom: '10px' }}>
          ⚔️ Ascension WoW Matchmaker
        </h1>

        {/* --- ERROR DISPLAY --- */}
        {errorMessage && (
          <div style={{ 
            padding: '12px', 
            backgroundColor: '#3a1616', 
            color: '#ff6b6b', 
            border: '1px solid #732222',
            marginBottom: '20px', 
            borderRadius: '6px' 
          }}>
            {errorMessage}
          </div>
        )}

        {/* --- ADD CHARACTER FORM --- */}
        <section style={{ 
          marginBottom: '30px', 
          padding: '20px', 
          backgroundColor: '#1e1e1e', 
          borderRadius: '8px',
          border: '1px solid #333'
        }}>
          <h2 style={{ marginTop: 0, color: '#fff', fontSize: '1.25rem' }}>Add a Character</h2>
          <form onSubmit={handleAddCharacter} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input 
              type="text" placeholder="Character Name" required
              value={newChar.name} onChange={e => setNewChar({...newChar, name: e.target.value})} 
              style={inputStyle}
            />
            
            {/* --- COA CLASS DROPDOWN --- */}
            <select 
              value={newChar.class_spec} 
              onChange={e => setNewChar({...newChar, class_spec: e.target.value})} 
              style={inputStyle}
            >
              {ASCENSION_CLASSES.map(className => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>

            <input 
              type="number" placeholder="Level (1-60)" min="1" max="60" required
              value={newChar.level} onChange={e => setNewChar({...newChar, level: e.target.value})} 
              style={{ ...inputStyle, width: '110px' }}
            />
            <button type="submit" style={buttonStyle}>Add Character</button>
          </form>
        </section>

        {/* --- MASTER TABLE --- */}
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
                <th style={thStyle}>Level (Click -/+ to edit)</th>
                <th style={thStyle}>Bracket</th>
              </tr>
            </thead>
            <tbody>
              {characters.length > 0 ? characters.map(char => {
                const classColor = CLASS_COLORS[char.class_spec] || '#e0e0e0';
                return (
                  <tr key={char.id} style={{ borderBottom: '1px solid #2a2a2a' }}>
                    <td style={tdStyle}>{char.users?.username || 'Guest'}</td>
                    <td style={{ ...tdStyle, color: '#fff', fontWeight: 'bold' }}>
                      {formatName(char.name)}
                    </td>
                    <td style={{ ...tdStyle, color: classColor, fontWeight: '600' }}>
                      {char.class_spec}
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button 
                          type="button" 
                          onClick={() => handleLevelChange(char.id, char.level - 1)}
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
                          onClick={() => handleLevelChange(char.id, char.level + 1)}
                          disabled={char.level >= 60}
                          style={smallBtnStyle}
                        >
                          +
                        </button>
                      </div>
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
                    No characters found. Add one above!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* --- MATCHMAKER --- */}
        <section style={{ 
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
          <ul style={{ paddingLeft: '20px', color: '#ccc' }}>
            {matches.length > 0 ? matches.map(match => {
              const matchClassColor = CLASS_COLORS[match.class_spec] || '#fff';
              return (
                <li key={match.id} style={{ marginBottom: '8px' }}>
                  <strong style={{ color: '#fff' }}>{match.users?.username || 'Guest'}</strong> can play{' '}
                  <strong style={{ color: '#fff' }}>{formatName(match.name)}</strong> (Level {match.level}{' '}
                  <span style={{ color: matchClassColor, fontWeight: '600' }}>{match.class_spec}</span>)
                </li>
              );
            }) : (
              <p style={{ color: '#777' }}>No characters currently in this bracket.</p>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}

// Reusable Dark Mode Styles
const inputStyle = {
  backgroundColor: '#2a2a2a',
  color: '#ffffff',
  border: '1px solid #444',
  padding: '8px 12px',
  borderRadius: '4px',
  outline: 'none'
};

const buttonStyle = {
  backgroundColor: '#2563eb',
  color: '#ffffff',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: '600'
};

const smallBtnStyle = {
  backgroundColor: '#333',
  color: '#fff',
  border: '1px solid #555',
  borderRadius: '4px',
  width: '26px',
  height: '26px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold'
};

const thStyle = {
  padding: '12px 8px'
};

const tdStyle = {
  padding: '12px 8px'
};