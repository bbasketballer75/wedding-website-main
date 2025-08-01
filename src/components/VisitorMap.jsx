import React, { useState, useEffect } from 'react';

/**
 * Real-time visitor map showing wedding website visitors
 */
export function VisitorMap() {
  const [visitors, setVisitors] = useState([]);
  const [stats, setStats] = useState({
    totalVisitors: 0,
    activeVisitors: 0,
    countriesVisited: 0,
    averageSessionTime: 0,
  });

  useEffect(() => {
    fetchVisitorData();
    const interval = setInterval(fetchVisitorData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchVisitorData = async () => {
    try {
      const response = await fetch('/api/visitors/realtime');
      const data = await response.json();
      setVisitors(data.visitors || []);
      setStats(data.stats || {});
    } catch (error) {
      console.error('Failed to fetch visitor data:', error);
    }
  };

  return (
    <div className="visitor-map-container">
      <div className="map-header">
        <h3>Real-time Wedding Website Visitors 🌍</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{stats.totalVisitors}</div>
            <div className="stat-label">Total Visitors</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.activeVisitors}</div>
            <div className="stat-label">Active Now</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.countriesVisited}</div>
            <div className="stat-label">Countries</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{Math.round(stats.averageSessionTime / 1000)}s</div>
            <div className="stat-label">Avg. Session</div>
          </div>
        </div>
      </div>

      <div className="world-map">
        <svg viewBox="0 0 1000 500" className="map-svg">
          {/* World map SVG paths would go here */}
          {visitors.map((visitor, index) => (
            <circle
              key={`${visitor.country}-${index}`}
              cx={visitor.longitude * 2.77 + 500} // Simplified projection
              cy={250 - visitor.latitude * 2.77}
              r="3"
              fill="#ff6b6b"
              className="visitor-dot animate-pulse"
            >
              <title>{`${visitor.city}, ${visitor.country}`}</title>
            </circle>
          ))}
        </svg>
      </div>

      <div className="recent-visitors">
        <h4>Recent Visitors</h4>
        <div className="visitor-list">
          {visitors.slice(0, 10).map((visitor, index) => (
            <div key={index} className="visitor-item">
              <div className="visitor-flag">🌍</div>
              <div className="visitor-info">
                <div className="visitor-location">
                  {visitor.city}, {visitor.country}
                </div>
                <div className="visitor-time">
                  {new Date(visitor.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .visitor-map-container {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          margin: 20px 0;
        }

        .map-header h3 {
          margin: 0 0 20px 0;
          color: #2d3748;
          font-size: 24px;
          text-align: center;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 16px;
          border-radius: 8px;
          text-align: center;
        }

        .stat-number {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 12px;
          opacity: 0.9;
        }

        .world-map {
          background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }

        .map-svg {
          width: 100%;
          height: 300px;
        }

        .visitor-dot {
          filter: drop-shadow(0 0 4px rgba(255, 107, 107, 0.6));
        }

        .recent-visitors {
          margin-top: 24px;
        }

        .recent-visitors h4 {
          margin: 0 0 16px 0;
          color: #2d3748;
        }

        .visitor-list {
          max-height: 200px;
          overflow-y: auto;
        }

        .visitor-item {
          display: flex;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #e2e8f0;
        }

        .visitor-flag {
          margin-right: 12px;
          font-size: 20px;
        }

        .visitor-location {
          font-weight: 500;
          color: #2d3748;
        }

        .visitor-time {
          font-size: 12px;
          color: #718096;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
}
