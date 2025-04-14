import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header';
import SideNav from './components/SideNav';

// Import the category components
import Users from './components/Users';
import Products from './components/Products';
import Books from './components/Books';
import Carts from './components/Carts';
import Comments from './components/Comments';
import Posts from './components/Posts';
import Quotes from './components/Quotes';
import Todos from './components/Todos';
import HttpMethods from './components/HttpMethods';

// Define initial category list (optional, could be fetched or defined in SideNav too)
const categories = [
  "Users", "Products", "Books", "Carts", "Comments",
  "Posts", "Quotes", "Todos", "HTTP Methods"
];

// Map category names to components
const componentMap = {
  Users,
  Products,
  Books,
  Carts,
  Comments,
  Posts,
  Quotes,
  Todos,
  "HTTP Methods": HttpMethods, // Handle space in name
};

function App() {
  // Lifted state: currently active category/component
  const [activeItem, setActiveItem] = useState(categories[0]);

  const appStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  };

  const mainContentStyle = {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  };

  const contentAreaStyle = {
    flex: 1,
    padding: '1rem',
    overflowY: 'auto',
  };

  // Get the component to render based on activeItem
  const ActiveComponent = componentMap[activeItem] || Users; // Default to Users if not found

  return (
    <div style={appStyle}>
      <Header />
      <div style={mainContentStyle}>
        {/* Pass state and setter down to SideNav */}
        <SideNav 
          activeItem={activeItem} 
          setActiveItem={setActiveItem} 
          categories={categories} // Pass categories for SideNav to map
        />
        <main style={contentAreaStyle}>
          {/* Render the active component */}
          <ActiveComponent />
        </main>
      </div>
    </div>
  )
}

export default App
