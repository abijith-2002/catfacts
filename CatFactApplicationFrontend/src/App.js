import React, { useState, useEffect } from 'react';
import './App.css';

// PUBLIC_INTERFACE
/**
 * Main application component for displaying random cat facts.
 * Handles theming, layout, and renders the CatFactCard component.
 */
function App() {
  const [theme, setTheme] = useState('light');

  // Effect to apply the theme to the document element for CSS variables
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  /**
   * Toggle app theme between light and dark.
   */
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="App" role="main">
      <header className="App-header" style={{minHeight: '100vh', display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          tabIndex={0}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <h1 className="app-title" style={{marginBottom: "0.25em"}}>Cat Fact Generator</h1>
        <span className="app-subtitle" style={{marginBottom:"2rem", fontWeight:400, color:"var(--text-secondary)", fontSize:"1.1rem"}}>Learn something new about cats, instantly!</span>
        <CatFactCard />
        <footer style={{marginTop:"3rem", fontSize:"0.95em", color:"var(--text-secondary)"}}>
          <span>
            Cat facts powered by <a className="App-link" href="https://catfact.ninja/" target="_blank" rel="noopener noreferrer">catfact.ninja</a>
          </span>
        </footer>
      </header>
    </div>
  );
}

/**
 * CatFactCard Component
 * Handles fetching, displaying, and refreshing random cat facts.
 */
function CatFactCard() {
  const [fact, setFact] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // PUBLIC_INTERFACE
  /**
   * Fetches a random cat fact from the public API.
   * Handles loading and error state.
   */
  const fetchCatFact = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://catfact.ninja/fact');
      if (!response.ok) {
        throw new Error("Unable to fetch cat fact. Please try again.");
      }
      const data = await response.json();
      setFact(data.fact);
    } catch (err) {
      setError("Oops! Couldn't load a cat fact. Please check your connection and try again.");
      setFact('');
    } finally {
      setLoading(false);
    }
  };

  // Fetch cat fact on mount
  useEffect(() => {
    fetchCatFact();
    // eslint-disable-next-line
  }, []);

  return (
    <section
      className="cat-fact-section"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'var(--bg-secondary)',
        borderRadius: '16px',
        boxShadow: '0 2px 16px 0 rgba(0,0,0,0.06)',
        padding: '2rem 1.5rem',
        maxWidth: '430px',
        width: '100%'
      }}
    >
      <div
        className="cat-fact"
        style={{
          marginBottom: '1.5rem',
          color: 'var(--text-primary)',
          minHeight: '68px', // Space for loading/error/fact
          fontSize: '1.28rem',
          textAlign: 'center',
          lineHeight: 1.6,
          wordBreak: 'break-word'
        }}
        aria-busy={loading ? "true" : "false"}
        aria-live="polite"
      >
        {loading && <LoadingSpinner />}
        {!loading && error && (
          <span role="alert" style={{ color: 'crimson', fontSize: "1.06rem" }}>
            {error}
          </span>
        )}
        {!loading && !error && fact}
      </div>
      <button
        className="refresh-fact-btn"
        onClick={fetchCatFact}
        aria-label="Get a new cat fact"
        disabled={loading}
        style={{
          background: "var(--button-bg)",
          color: "var(--button-text)",
          padding: "10px 22px",
          fontSize: "1rem",
          border: 0,
          borderRadius: "8px",
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
          boxShadow: '0 1px 5px rgba(0,0,0,0.09)',
          outline: "none",
          transition: "background 0.2s, color 0.2s, opacity 0.2s"
        }}
      >
        {loading ? 'Fetching…' : 'Get New Fact'}
      </button>
    </section>
  );
}

/**
 * Simple loading spinner for fact loading state.
 */
function LoadingSpinner() {
  return (
    <span
      role="status"
      aria-label="Loading cat fact"
      style={{ display: "inline-flex", alignItems: "center", fontSize: "1.06em" }}
    >
      <svg
        viewBox="0 0 50 50"
        width="26"
        height="26"
        style={{ marginRight: "0.75em", verticalAlign: "middle" }}
      >
        <circle
          cx="25" cy="25" r="20"
          fill="none"
          stroke="var(--button-bg)"
          strokeWidth="5"
          strokeDasharray="100"
          strokeDashoffset="60"
          strokeLinecap="round"
          style={{ animation: "spin 1s linear infinite" }}
        />
        <style>
          {`
            @keyframes spin {
              100% { stroke-dashoffset: 0; transform: rotate(360deg);}
            }
          `}
        </style>
      </svg>
      Loading…
    </span>
  );
}

export default App;
