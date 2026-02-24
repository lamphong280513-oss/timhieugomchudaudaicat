import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AIPatternScanner from './components/AIPatternScanner';
import DigitalLibrary from './components/DigitalLibrary';
import MapGuide from './components/MapGuide';
import Community from './components/Community';
import Settings from './components/Settings';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/scan" element={<AIPatternScanner />} />
          <Route path="/library" element={<DigitalLibrary />} />
          <Route path="/map" element={<MapGuide />} />
          <Route path="/community" element={<Community />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}
