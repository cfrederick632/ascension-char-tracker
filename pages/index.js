import { useState, useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase, calculateBracket } from '../utils/supabase';

export default function Home() {
  const [session, setSession] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [characters, setCharacters] = useState([]);
  const [newChar, setNewChar] = useState({ name: '', class_spec: '', level: '' });
  const [selectedBracket, setSelectedBracket] = useState('20-29');

  // Prevent SSR pre-render issues by verifying client mount
  useEffect(() => {
    setMounted(true);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) fetchCharacters();
  }, [session]);

  const fetchCharacters = async () => {
    const { data, error } = await supabase
      .from('characters')
      .select(`*, users(username)`);
    if (data) setCharacters(data);
  };

  const handleAddCharacter = async (e) => {
    e.preventDefault();
    const bracket = calculateBracket(parseInt(newChar.level));
    
    const { data, error } = await supabase
      .from('characters')
      .insert([
        { 
          name: newChar.name, 
          class_spec: newChar.class_spec, 
          level: parseInt(newChar.level), 
          bg_bracket: bracket,
          user_id: session.user.id 
        }
      ]);
      
    if (!error) {
      fetchCharacters(); 
      setNewChar({ name: '', class_spec: '', level: '' });
    }
  };

  // Do not render client components until the browser has mounted
  if (!mounted) return null;

  if (!session) {
    return (
      <div style={{ padding: '50px', maxWidth: '400px', margin: '0 auto', fontFamily: 'sans-serif' }}>
        <h1>Ascension WoW Matchmaker</h1>
        <p>Please sign in to access the matchmaker.</p>
        <Auth 
          supabaseClient={supabase} 
          appearance={{ theme: ThemeSupa }} 
          providers={['google', 'github']} 
        />
      </div>
    );
  }

  const matches = characters.filter(c => c.bg_bracket === selectedBracket);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Ascension WoW Matchmaker</h1>
        <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
      </div>

      {/* --- ADD CHARACTER FORM --- */}
      <section style={{ marginBottom: '40px', padding: '20px', border: '1px solid #ccc' }}>
        <h2>Add a Character</h2>
        <form onSubmit={handleAddCharacter}>
          <input 
            type="text" placeholder="Character Name" required
            value={newChar.name} onChange={e => setNewChar({...newChar, name: e.target.value})} 
            style={{ marginRight: '10px' }}
          />
          <input 
            type="text" placeholder="Class/Spec (e.g. Sun Cleric)" required
            value={newChar.class_spec} onChange={e => setNewChar({...newChar, class_spec: e.target.value})} 
            style={{ marginRight: '10px' }}
          />
          <input 
            type="number" placeholder="Level (1-60)" min="1" max="60" required
            value={newChar.level} onChange={e => setNewChar({...newChar, level: e.target.value})} 
            style={{ marginRight: '10px' }}
          />
          <button type="submit">Add Character</button>
        </form>
      </section>

      {/* --- THE MASTER TABLE --- */}
      <section style={{ marginBottom: '40px' }}>
        <h2>All Characters</h2>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #333' }}>
              <th>Player</th>
              <th>Character Name</th>
              <th>Class/Spec</th>
              <th>Level</th>
              <th>Bracket</th>
            </tr>
          </thead>
          <tbody>
            {characters.map(char => (
              <tr key={char.id} style={{ borderBottom: '1px solid #eee' }}>
                <td>{char.users?.username || 'Unknown'}</td>
                <td>{char.name}</td>
                <td>{char.class_spec}</td>
                <td>{char.level}</td>
                <td>{char.bg_bracket}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* --- MATCHMAKER --- */}
      <section style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <h2>Matchmaker</h2>
        <label>Select Bracket to Queue: </label>
        <select value={selectedBracket} onChange={e => setSelectedBracket(e.target.value)}>
          <option value="10-19">10-19</option>
          <option value="20-29">20-29</option>
          <option value="30-39">30-39</option>
          <option value="40-49">40-49</option>
          <option value="50-59">50-59</option>
          <option value="60-60">Level 60</option>
        </select>

        <h3 style={{ marginTop: '20px' }}>Available Friends for {selectedBracket}</h3>
        <ul>
          {matches.length > 0 ? matches.map(match => (
            <li key={match.id}>
              <strong>{match.users?.username || 'Unknown'}</strong> can play <strong>{match.name}</strong> (Level {match.level} {match.class_spec})
            </li>
          )) : (
            <p>No characters found in this bracket.</p>
          )}
        </ul>
      </section>
    </div>
  );
}