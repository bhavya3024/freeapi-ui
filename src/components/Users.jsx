import React, { useState, useEffect } from 'react';
import {
  getRandomUsersPaginated,
} from '../apis/users/userApi';

// Import Material Web Components
import '@material/web/list/list.js';
import '@material/web/list/list-item.js';
import '@material/web/button/filled-button.js';
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/progress/circular-progress.js';
import '@material/web/divider/divider.js';

import './Users.css'; // Import the CSS file

function Users() {
  // State for API data and UI control
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // --- API Call Handler ---

  const handleGetRandomUsers = async (pageNum = 1) => {
    console.log(`[Users Component] handleGetRandomUsers called for page: ${pageNum}`);
    setLoading(true);
    setError(null);
    setPage(pageNum); // Update page state
    try {
      const numLimit = parseInt(limit, 10) || 10;
      const data = await getRandomUsersPaginated(pageNum, numLimit);
      
      // Adjust based on the actual working API response structure
      if (data && data.data && Array.isArray(data.data.data)) {
        setUsers(data.data.data);
        setTotalPages(data.data.totalPages || 1);
      } else {
        console.warn("Unexpected API response structure:", data);
        setUsers([]);
        setTotalPages(1);
      }

    } catch (err) {
      setError(err.message || 'Failed to fetch random users');
      setUsers([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // --- Effects ---
  useEffect(() => {
    console.log("[Users Component] useEffect triggered. Fetching initial users...");
    // Fetch first page on initial component mount
    handleGetRandomUsers(1);
  }, []); // Empty dependency array ensures this runs only once on mount

  // --- Render ---
  return (
    <div>
      <h1>Random Users</h1>

      {/* Controls for Pagination */} 
      <div className="controls-container">
        {/* Paginated Users Controls */}
        <div className="control-group-row"> 
          <div className="input-row"> 
            <md-outlined-text-field 
              label="Limit" 
              type="number" 
              value={limit} 
              onInput={(e) => setLimit(Math.max(1, parseInt(e.target.value, 10) || 1))} // Basic validation
              style={{ maxWidth: '100px' }} 
            />
             <md-filled-button 
              onClick={() => handleGetRandomUsers(1)} // Fetch page 1 with new limit
              disabled={loading}
             >
              Set Limit & Get Page 1
            </md-filled-button>
          </div>
          <div className="input-row" style={{ marginTop: '1rem' }}>
            <md-filled-button onClick={() => handleGetRandomUsers(page - 1)} disabled={loading || page <= 1}>
              Previous
            </md-filled-button>
            <span style={{ margin: '0 1rem' }}>Page {page} of {totalPages}</span>
            <md-filled-button onClick={() => handleGetRandomUsers(page + 1)} disabled={loading || page >= totalPages}>
              Next
            </md-filled-button>
          </div>
        </div>
      </div>

      <md-divider></md-divider>

      {/* Loading Indicator */}
      {loading && <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><md-circular-progress indeterminate></md-circular-progress></div>}

      {/* Error Message */}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>}

      {/* Display Area */}
      {!loading && !error && (
        <div>
          {/* User List Display */}
          {Array.isArray(users) && users.length > 0 && (
            <md-list>
              {users.map((user, index) => (
                <md-list-item
                  key={user?.login?.uuid ?? index} // Use UUID if available, fallback to index
                >
                  {/* Optional: Add user picture */}
                  {user?.picture?.thumbnail && 
                    <img 
                      slot="start" 
                      src={user.picture.thumbnail} 
                      alt={`${user?.name?.first} ${user?.name?.last}`} 
                      style={{ borderRadius: '50%', width:'40px', height:'40px' }} 
                    />
                  }
                  {/* Use slotted divs for text content */}
                  <div slot="headline">{`${user?.name?.first ?? ''} ${user?.name?.last ?? ''}`.trim() || 'N/A'}</div>
                  <div slot="supporting-text">{`Email: ${user?.email ?? 'N/A'} | Phone: ${user?.phone ?? 'N/A'}`}</div>
                </md-list-item>
              ))}
            </md-list>
          )}

          {/* No Results Message */}
          {(!Array.isArray(users) || users.length === 0) &&
            <p style={{ textAlign: 'center', marginTop: '1rem' }}>No users found.</p>
          }
        </div>
      )}
    </div>
  );
}

export default Users; 