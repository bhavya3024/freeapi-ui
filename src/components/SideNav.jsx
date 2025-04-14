import React from 'react';
import '@material/web/list/list.js';
import '@material/web/list/list-item.js';
import './SideNav.css';

function SideNav({ activeItem, setActiveItem, categories }) {
  const navStyle = {
    backgroundColor: '#f2f2f2',
    padding: '1rem',
    width: '200px',
    overflow: 'hidden',
    '--md-list-item-label-text-color': '#333',
    '--md-list-container-color': '#f2f2f2',
  };

  const handleItemClick = (category) => {
    setActiveItem(category);
    console.log("Selected category:", category);
  };

  return (
    <nav style={navStyle}>
      <md-list>
        {categories.map((category) => (
          <md-list-item
            key={category}
            type="button"
            className={activeItem === category ? 'active-item' : ''}
            onClick={() => handleItemClick(category)}
          >
            <div slot="headline">{category}</div>
          </md-list-item>
        ))}
      </md-list>
    </nav>
  );
}

export default SideNav;