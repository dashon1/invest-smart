import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Learn from "./Learn";

import Practice from "./Practice";

import Goals from "./Goals";

import AIAdvisor from "./AIAdvisor";

import Watchlist from "./Watchlist";

import Community from "./Community";

import Achievements from "./Achievements";

import Analytics from "./Analytics";

import News from "./News";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    Learn: Learn,
    
    Practice: Practice,
    
    Goals: Goals,
    
    AIAdvisor: AIAdvisor,
    
    Watchlist: Watchlist,
    
    Community: Community,
    
    Achievements: Achievements,
    
    Analytics: Analytics,
    
    News: News,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Learn" element={<Learn />} />
                
                <Route path="/Practice" element={<Practice />} />
                
                <Route path="/Goals" element={<Goals />} />
                
                <Route path="/AIAdvisor" element={<AIAdvisor />} />
                
                <Route path="/Watchlist" element={<Watchlist />} />
                
                <Route path="/Community" element={<Community />} />
                
                <Route path="/Achievements" element={<Achievements />} />
                
                <Route path="/Analytics" element={<Analytics />} />
                
                <Route path="/News" element={<News />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}