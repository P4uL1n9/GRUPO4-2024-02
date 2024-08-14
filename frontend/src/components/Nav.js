import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/nav.css';

function Navigation() {
  return (
   <h1>
    <ul>
      <li ><Link to="/DicomViewer">DicomViewer</Link></li>
      <li ><Link to="/DicomHeader">DicomHeader</Link></li>
    </ul>
  </h1> 
  );
}

export default Navigation;