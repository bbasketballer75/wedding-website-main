import { useState } from 'react';

/**
 * 🏛️ Wedding Memory Vault Component
 * Professional archival system for wedding memories and media
 */
const WeddingMemoryVault = () => {
  const [vault, setVault] = useState({
    photos: {
      professional: [],
      guest: [],
      behindScenes: [],
      reception: [],
      ceremony: [],
    },
    videos: {
      ceremony: [],
      reception: [],
      speeches: [],
      highlights: [],
    },
    documents: {
      invitations: [],
      programs: [],
      menus: [],
      contracts: [],
      planning: [],
    },
    audio: {
      vows: [],
      speeches: [],
      music: [],
      sounds: [],
    },
  });

  const [activeCategory, setActiveCategory] = useState('photos');
  const [activeSubcategory, setActiveSubcategory] = useState('professional');
  const [viewMode, setViewMode] = useState('grid'); // grid, timeline, slideshow
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const categories = {
    photos: {
      icon: '📸',
      label: 'Photos',
      color: '#E53E3E',
      subcategories: {
        professional: { label: 'Professional Photos', count: 247 },
        guest: { label: 'Guest Photos', count: 189 },
        behindScenes: { label: 'Behind the Scenes', count: 76 },
        reception: { label: 'Reception', count: 156 },
        ceremony: { label: 'Ceremony', count: 98 },
      },
    },
    videos: {
      icon: '🎥',
      label: 'Videos',
      color: '#3182CE',
      subcategories: {
        ceremony: { label: 'Ceremony Video', count: 12 },
        reception: { label: 'Reception Video', count: 18 },
        speeches: { label: 'Speeches', count: 8 },
        highlights: { label: 'Highlight Reels', count: 5 },
      },
    },
    documents: {
      icon: '📄',
      label: 'Documents',
      color: '#38A169',
      subcategories: {
        invitations: { label: 'Invitations', count: 15 },
        programs: { label: 'Programs', count: 8 },
        menus: { label: 'Menus', count: 6 },
        contracts: { label: 'Vendor Contracts', count: 22 },
        planning: { label: 'Planning Documents', count: 45 },
      },
    },
    audio: {
      icon: '🎵',
      label: 'Audio',
      color: '#805AD5',
      subcategories: {
        vows: { label: 'Vows Recording', count: 3 },
        speeches: { label: 'Speech Audio', count: 12 },
        music: { label: 'Wedding Playlist', count: 87 },
        sounds: { label: 'Ambient Sounds', count: 24 },
      },
    },
  };

  const mockItems = {
    photos: {
      professional: [
        {
          id: 'photo_1',
          filename: 'ceremony-kiss.jpg',
          title: 'The First Kiss',
          description: "Austin and Jordyn's first kiss as husband and wife",
          uploadDate: '2025-06-15',
          photographer: 'Sarah Photography',
          location: "St. Mary's Church",
          tags: ['ceremony', 'romantic', 'highlight'],
          fileSize: '2.4 MB',
          dimensions: '4000x6000',
          quality: 'RAW',
          thumbnail: '/api/placeholder/300/200',
        },
        {
          id: 'photo_2',
          filename: 'walking-down-aisle.jpg',
          title: 'Walking Down the Aisle',
          description: 'Jordyn walking down the aisle with her father',
          uploadDate: '2025-06-15',
          photographer: 'Sarah Photography',
          location: "St. Mary's Church",
          tags: ['ceremony', 'emotional', 'family'],
          fileSize: '3.1 MB',
          dimensions: '4000x6000',
          quality: 'RAW',
          thumbnail: '/api/placeholder/300/200',
        },
      ],
    },
    videos: {
      ceremony: [
        {
          id: 'video_1',
          filename: 'full-ceremony.mp4',
          title: 'Complete Wedding Ceremony',
          description: 'Full recording of the wedding ceremony',
          uploadDate: '2025-06-20',
          videographer: 'Eternal Moments Films',
          duration: '45:32',
          fileSize: '1.2 GB',
          quality: '4K',
          thumbnail: '/api/placeholder/300/200',
        },
      ],
    },
  };

  const getVaultStats = () => {
    let totalItems = 0;
    let totalSize = 0;

    Object.keys(categories).forEach((cat) => {
      Object.keys(categories[cat].subcategories).forEach((subcat) => {
        totalItems += categories[cat].subcategories[subcat].count;
      });
    });

    return {
      totalItems,
      totalSize: '12.7 GB',
      lastUpdate: 'Today',
      backupStatus: 'Cloud synced',
    };
  };

  const vaultStats = getVaultStats();

  const renderVaultOverview = () => (
    <div className="vault-overview">
      <div className="vault-stats-banner">
        <div className="stat">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-number">{vaultStats.totalItems}</div>
            <div className="stat-label">Total Items</div>
          </div>
        </div>
        <div className="stat">
          <div className="stat-icon">💾</div>
          <div className="stat-content">
            <div className="stat-number">{vaultStats.totalSize}</div>
            <div className="stat-label">Storage Used</div>
          </div>
        </div>
        <div className="stat">
          <div className="stat-icon">☁️</div>
          <div className="stat-content">
            <div className="stat-number">{vaultStats.backupStatus}</div>
            <div className="stat-label">Backup Status</div>
          </div>
        </div>
        <div className="stat">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <div className="stat-number">{vaultStats.lastUpdate}</div>
            <div className="stat-label">Last Updated</div>
          </div>
        </div>
      </div>

      <div className="categories-overview">
        <h3>🗂️ Categories Overview</h3>
        <div className="categories-grid">
          {Object.entries(categories).map(([key, category]) => (
            <div
              key={key}
              className="category-overview-card"
              onClick={() => {
                setActiveCategory(key);
                setActiveSubcategory(Object.keys(category.subcategories)[0]);
              }}
            >
              <div className="category-icon" style={{ color: category.color }}>
                {category.icon}
              </div>
              <h4>{category.label}</h4>
              <div className="category-stats">
                {Object.values(category.subcategories).reduce((sum, sub) => sum + sub.count, 0)}{' '}
                items
              </div>
              <div className="subcategories-list">
                {Object.entries(category.subcategories).map(([subKey, sub]) => (
                  <div key={subKey} className="subcategory-item">
                    <span>{sub.label}</span>
                    <span className="count">{sub.count}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCategoryBrowser = () => (
    <div className="category-browser">
      <div className="browser-header">
        <div className="category-navigation">
          <h2>
            <span style={{ color: categories[activeCategory].color }}>
              {categories[activeCategory].icon}
            </span>
            {categories[activeCategory].label} /{' '}
            {categories[activeCategory].subcategories[activeSubcategory].label}
          </h2>

          <div className="subcategory-tabs">
            {Object.entries(categories[activeCategory].subcategories).map(([key, sub]) => (
              <button
                key={key}
                className={`subcategory-tab ${activeSubcategory === key ? 'active' : ''}`}
                onClick={() => setActiveSubcategory(key)}
              >
                {sub.label} ({sub.count})
              </button>
            ))}
          </div>
        </div>

        <div className="browser-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="🔍 Search memories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="view-controls">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              ⊞ Grid
            </button>
            <button
              className={`view-btn ${viewMode === 'timeline' ? 'active' : ''}`}
              onClick={() => setViewMode('timeline')}
            >
              📅 Timeline
            </button>
            <button
              className={`view-btn ${viewMode === 'slideshow' ? 'active' : ''}`}
              onClick={() => setViewMode('slideshow')}
            >
              🎭 Slideshow
            </button>
          </div>

          <button className="upload-btn" onClick={() => setShowUploadModal(true)}>
            ⬆️ Upload
          </button>
        </div>
      </div>

      <div className="content-area">
        {viewMode === 'grid' && renderGridView()}
        {viewMode === 'timeline' && renderTimelineView()}
        {viewMode === 'slideshow' && renderSlideshowView()}
      </div>
    </div>
  );

  const renderGridView = () => {
    const items = mockItems[activeCategory]?.[activeSubcategory] || [];

    return (
      <div className="grid-view">
        <div className="items-grid">
          {items.map((item) => (
            <div key={item.id} className="item-card">
              <div className="item-thumbnail">
                <img src={item.thumbnail} alt={item.title} />
                <div className="item-overlay">
                  <button className="preview-btn">👁️</button>
                  <button className="download-btn">⬇️</button>
                  <button className="share-btn">↗️</button>
                </div>
              </div>

              <div className="item-info">
                <h4>{item.title}</h4>
                <p>{item.description}</p>

                <div className="item-meta">
                  <div className="meta-row">
                    <span className="meta-label">📅</span>
                    <span>{new Date(item.uploadDate).toLocaleDateString()}</span>
                  </div>

                  {item.photographer && (
                    <div className="meta-row">
                      <span className="meta-label">📷</span>
                      <span>{item.photographer}</span>
                    </div>
                  )}

                  {item.videographer && (
                    <div className="meta-row">
                      <span className="meta-label">🎬</span>
                      <span>{item.videographer}</span>
                    </div>
                  )}

                  <div className="meta-row">
                    <span className="meta-label">💾</span>
                    <span>{item.fileSize}</span>
                  </div>

                  {item.dimensions && (
                    <div className="meta-row">
                      <span className="meta-label">📐</span>
                      <span>{item.dimensions}</span>
                    </div>
                  )}

                  {item.duration && (
                    <div className="meta-row">
                      <span className="meta-label">⏱️</span>
                      <span>{item.duration}</span>
                    </div>
                  )}
                </div>

                {item.tags && (
                  <div className="item-tags">
                    {item.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">{categories[activeCategory].icon}</div>
            <h3>
              No {categories[activeCategory].subcategories[activeSubcategory].label.toLowerCase()}{' '}
              yet
            </h3>
            <p>Upload your first {activeCategory.slice(0, -1)} to get started!</p>
            <button className="upload-first-btn" onClick={() => setShowUploadModal(true)}>
              ⬆️ Upload First{' '}
              {activeCategory.slice(0, -1).charAt(0).toUpperCase() + activeCategory.slice(1, -1)}
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderTimelineView = () => (
    <div className="timeline-view">
      <div className="timeline-container">
        <div className="timeline-item">
          <div className="timeline-date">June 14, 2025</div>
          <div className="timeline-content">
            <h3>🎊 Wedding Day</h3>
            <p>247 photos and 12 videos uploaded</p>
          </div>
        </div>

        <div className="timeline-item">
          <div className="timeline-date">June 20, 2025</div>
          <div className="timeline-content">
            <h3>📷 Professional Photos Delivered</h3>
            <p>Professional photographer delivered final edited photos</p>
          </div>
        </div>

        <div className="timeline-item">
          <div className="timeline-date">July 2, 2025</div>
          <div className="timeline-content">
            <h3>🎥 Wedding Video Complete</h3>
            <p>Videographer delivered final ceremony and reception videos</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSlideshowView = () => (
    <div className="slideshow-view">
      <div className="slideshow-container">
        <div className="slideshow-controls">
          <button className="control-btn">⏮️</button>
          <button className="control-btn">⏸️</button>
          <button className="control-btn">⏭️</button>
          <button className="control-btn">🔄</button>
        </div>

        <div className="slideshow-content">
          <img src="/api/placeholder/800/600" alt="Wedding slideshow" />
        </div>

        <div className="slideshow-info">
          <h3>Professional Wedding Photos</h3>
          <p>Photo 1 of 247 • Auto-advance every 5 seconds</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="wedding-memory-vault">
      <style jsx>{`
        .wedding-memory-vault {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
          font-family:
            'SF Pro Display',
            -apple-system,
            sans-serif;
          background: #f7fafc;
          min-height: 100vh;
        }

        .vault-header {
          text-align: center;
          margin-bottom: 3rem;
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .vault-header h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .vault-header p {
          color: #718096;
          font-size: 1.1rem;
        }

        .main-navigation {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 3rem;
          background: white;
          padding: 1rem;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .nav-tab {
          padding: 1rem 2rem;
          border: none;
          background: transparent;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .nav-tab.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .nav-tab:hover:not(.active) {
          background: #edf2f7;
        }

        .vault-stats-banner {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .stat {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-icon {
          font-size: 2rem;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 50%;
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: bold;
          color: #2d3748;
        }

        .stat-label {
          color: #718096;
          font-size: 0.9rem;
        }

        .categories-overview h3 {
          color: #2d3748;
          margin-bottom: 2rem;
          font-size: 1.3rem;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .category-overview-card {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          cursor: pointer;
          transition: all 0.3s;
        }

        .category-overview-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
        }

        .category-icon {
          font-size: 3rem;
          text-align: center;
          margin-bottom: 1rem;
        }

        .category-overview-card h4 {
          text-align: center;
          color: #2d3748;
          margin-bottom: 1rem;
          font-size: 1.2rem;
        }

        .category-stats {
          text-align: center;
          color: #718096;
          margin-bottom: 1.5rem;
          font-weight: 600;
        }

        .subcategories-list {
          space-y: 0.5rem;
        }

        .subcategory-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid #e2e8f0;
          font-size: 0.9rem;
        }

        .subcategory-item:last-child {
          border-bottom: none;
        }

        .count {
          background: #edf2f7;
          color: #4a5568;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.8rem;
        }

        .browser-header {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .category-navigation h2 {
          color: #2d3748;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.5rem;
        }

        .subcategory-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .subcategory-tab {
          padding: 0.75rem 1.5rem;
          border: 2px solid #e2e8f0;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 0.9rem;
        }

        .subcategory-tab.active {
          border-color: #667eea;
          background: #667eea;
          color: white;
        }

        .subcategory-tab:hover:not(.active) {
          border-color: #cbd5e0;
        }

        .browser-controls {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-container {
          flex: 1;
          min-width: 250px;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.9rem;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
        }

        .view-controls {
          display: flex;
          gap: 0.5rem;
        }

        .view-btn {
          padding: 0.75rem 1rem;
          border: 2px solid #e2e8f0;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 0.85rem;
        }

        .view-btn.active {
          border-color: #667eea;
          background: #667eea;
          color: white;
        }

        .upload-btn {
          background: linear-gradient(135deg, #48bb78, #38a169);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s;
        }

        .upload-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(72, 187, 120, 0.4);
        }

        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
        }

        .item-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s;
        }

        .item-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
        }

        .item-thumbnail {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .item-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .item-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .item-card:hover .item-overlay {
          opacity: 1;
        }

        .item-overlay button {
          background: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          transition: transform 0.3s;
          font-size: 1.1rem;
        }

        .item-overlay button:hover {
          transform: scale(1.1);
        }

        .item-info {
          padding: 1.5rem;
        }

        .item-info h4 {
          color: #2d3748;
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }

        .item-info p {
          color: #718096;
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .item-meta {
          space-y: 0.5rem;
          margin-bottom: 1rem;
        }

        .meta-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: #4a5568;
        }

        .meta-label {
          width: 20px;
        }

        .item-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tag {
          background: #edf2f7;
          color: #4a5568;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #718096;
          grid-column: 1 / -1;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          color: #2d3748;
          margin-bottom: 1rem;
        }

        .upload-first-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          margin-top: 1rem;
        }

        .timeline-container {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .timeline-item {
          display: flex;
          gap: 2rem;
          padding: 2rem 0;
          border-bottom: 1px solid #e2e8f0;
        }

        .timeline-item:last-child {
          border-bottom: none;
        }

        .timeline-date {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 1rem;
          border-radius: 8px;
          font-weight: bold;
          text-align: center;
          min-width: 150px;
        }

        .timeline-content h3 {
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .slideshow-container {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .slideshow-controls {
          display: flex;
          justify-content: center;
          gap: 1rem;
          padding: 1rem;
          background: #f7fafc;
        }

        .control-btn {
          background: #4a5568;
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.1rem;
        }

        .slideshow-content {
          text-align: center;
          padding: 2rem;
        }

        .slideshow-content img {
          max-width: 100%;
          max-height: 500px;
          border-radius: 8px;
        }

        .slideshow-info {
          padding: 1rem 2rem;
          background: #f7fafc;
          text-align: center;
        }

        .slideshow-info h3 {
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .slideshow-info p {
          color: #718096;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .wedding-memory-vault {
            padding: 1rem;
          }

          .main-navigation {
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .nav-tab {
            padding: 0.75rem 1rem;
            font-size: 0.9rem;
          }

          .vault-stats-banner {
            grid-template-columns: repeat(2, 1fr);
          }

          .categories-grid {
            grid-template-columns: 1fr;
          }

          .browser-controls {
            flex-direction: column;
            align-items: stretch;
          }

          .view-controls {
            justify-content: center;
          }

          .items-grid {
            grid-template-columns: 1fr;
          }

          .subcategory-tabs {
            justify-content: center;
          }

          .timeline-item {
            flex-direction: column;
            gap: 1rem;
          }

          .timeline-date {
            align-self: flex-start;
            min-width: auto;
          }
        }
      `}</style>

      <div className="vault-header">
        <h1>🏛️ Wedding Memory Vault</h1>
        <p>Professional archival system for preserving your wedding memories</p>
      </div>

      <div className="main-navigation">
        <button
          className={`nav-tab ${activeCategory === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveCategory('overview')}
        >
          📊 Overview
        </button>
        {Object.entries(categories).map(([key, category]) => (
          <button
            key={key}
            className={`nav-tab ${activeCategory === key ? 'active' : ''}`}
            onClick={() => {
              setActiveCategory(key);
              setActiveSubcategory(Object.keys(category.subcategories)[0]);
            }}
          >
            {category.icon} {category.label}
          </button>
        ))}
      </div>

      <div className="vault-content">
        {activeCategory === 'overview' ? renderVaultOverview() : renderCategoryBrowser()}
      </div>
    </div>
  );
};

export default WeddingMemoryVault;
