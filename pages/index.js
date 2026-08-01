import { useState, useEffect } from 'react';
import { supabase, calculateBracket } from '../utils/supabase';
import { ASCENSION_CLASSES } from '../utils/constants';
import { formatName } from '../utils/helpers';

import Header from '../components/Header';
import AuthForm from '../components/AuthForm';
import AddCharacterForm from '../components/AddCharacterForm';
import CharacterTable from '../components/CharacterTable';
import MatchmakerQueue from '../components/MatchmakerQueue';

export default function Home() {
  const [characters, setCharacters] = useState([]);
  const [newChar, setNewChar] = useState({ 
    name: '', 
    class_spec: ASCENSION_CLASSES[0], 
    level: '' 
  });
  const [selectedBracket, setSelectedBracket] = useState('20-29');
  const [errorMessage, setErrorMessage] = useState('');

  // --- AUTH STATES ---
  const [session, setSession] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    fetchCharacters();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

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

  // --- HANDLERS ---
  const handleAuth = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: { data: { username: username.trim() } }
      });

      if (error) {
        setErrorMessage(`Sign Up Error: ${error.message}`);
        return;
      }

      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert([{ id: data.user.id, username: username.trim() }]);

        if (profileError) console.error('Profile creation error:', profileError.message);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setErrorMessage(`Sign In Error: ${error.message}`);
        return;
      }
    }

    setEmail('');
    setPassword('');
    setUsername('');
    fetchCharacters();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleAddCharacter = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!session?.user) {
      setErrorMessage('You must be logged in to add a character.');
      return;
    }

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
          bg_bracket: bracket,
          user_id: session.user.id
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

  const handleLevelChange = async (charId, newLevel) => {
    setErrorMessage('');

    if (!session?.user) {
      setErrorMessage('You must be logged in to edit character levels.');
      return;
    }

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

  return (
    <div style={{ 
      backgroundColor: '#121212', 
      color: '#e0e0e0', 
      minHeight: '100vh', 
      padding: '30px 20px', 
      fontFamily: 'system-ui, -apple-system, sans-serif' 
    }}>
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
        <Header session={session} onSignOut={handleSignOut} />

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

        {!session ? (
          <AuthForm 
            isSignUp={isSignUp}
            setIsSignUp={setIsSignUp}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            username={username}
            setUsername={setUsername}
            onSubmit={handleAuth}
          />
        ) : (
          <AddCharacterForm 
            newChar={newChar}
            setNewChar={setNewChar}
            onSubmit={handleAddCharacter}
          />
        )}

        {/* --- MATCHMAKER QUEUE (MOVED UP) --- */}
        <MatchmakerQueue 
          characters={characters}
          selectedBracket={selectedBracket}
          setSelectedBracket={setSelectedBracket}
        />

        {/* --- CHARACTER TABLE --- */}
        <CharacterTable 
          characters={characters}
          session={session}
          onLevelChange={handleLevelChange}
        />
      </div>
    </div>
  );
}