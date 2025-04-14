import React from 'react';

function Header() {
  const headerStyle = {
    backgroundColor: '#696969', // Dark grey (DimGray)
    padding: '1rem 1rem', // Increased vertical padding
    textAlign: 'left', // Align text to the left
    color: 'white', // Adding white text for better contrast
    width: '100%', // Set width to 100%
  };

  // Style for the h1 inside the header
  const h1Style = {
    fontSize: '2rem', // Increased font size
    margin: '0', // Remove default h1 margin
  };

  return (
    <header style={headerStyle}>
      <h1 style={h1Style}>FreeApi UI</h1>
    </header>
  );
}

export default Header; 