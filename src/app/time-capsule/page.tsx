'use client';

import { useCallback, useEffect, useState } from 'react';

interface CapsuleContent {
  id: string;
  type: string;
  content: string;
  author: string;
  addedAt: string;
}

interface TimeCapsule {
  id: string;
  title: string;
  description: string;
  creator: {
    name: string;
    email: string;
  };
  openDate: string;
  isSealed: boolean;
  contents: CapsuleContent[];
  viewCount: number;
  createdAt: string;
  sealedAt?: string;
  openedAt?: string;
}

interface TimeCapsuleData {
  capsules: TimeCapsule[];
  upcoming: TimeCapsule[];
  totalCapsules: number;
}

interface CapsuleCreationData {
  title: string;
  description: string;
  openDate: string;
  creator: {
    name: string;
    email: string;
  };
}

/**
 * ⏰ Digital Time Capsule Page
 * Preserve memories to be opened in the future
 */
export default function TimeCapsulePage() {
  const [capsuleData, setCapsuleData] = useState<TimeCapsuleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCapsule, setSelectedCapsule] = useState<TimeCapsule | null>(null);

  const loadCapsuleData = useCallback(async () => {
    try {
      setLoading(true);

      const [capsulesResponse, upcomingResponse] = await Promise.all([
        fetch('/api/time-capsules'),
        fetch('/api/time-capsules/schedule/upcoming'),
      ]);

      if (!capsulesResponse.ok || !upcomingResponse.ok) {
        throw new Error('Failed to load time capsule data');
      }

      const [capsulesResult, upcomingResult] = await Promise.all([
        capsulesResponse.json(),
        upcomingResponse.json(),
      ]);

      setCapsuleData({
        capsules: capsulesResult.data || [],
        upcoming: upcomingResult.data || [],
        totalCapsules: capsulesResult.pagination?.total || 0,
      });

      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');

      // Fallback data
      const fallbackData = {
        capsules: [
          {
            id: '1',
            title: 'Our First Year Memories',
            description: 'Collecting memories from our first year of marriage',
            creator: { name: 'Austin & Jordyn', email: 'couple@example.com' },
            openDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            isSealed: false,
            contents: [],
            viewCount: 0,
            createdAt: new Date().toISOString(),
          },
        ],
        upcoming: [],
        totalCapsules: 1,
      };
      setCapsuleData(fallbackData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCapsuleData();
  }, [loadCapsuleData]);

  const handleCreateCapsule = async (capsuleData: CapsuleCreationData) => {
    try {
      const response = await fetch('/api/time-capsules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(capsuleData),
      });

      if (!response.ok) {
        throw new Error('Failed to create time capsule');
      }

      await loadCapsuleData();
      setShowCreateForm(false);
      alert('Time capsule created successfully!');
    } catch (err) {
      alert('Failed to create time capsule. Please try again.');
      console.error('Capsule creation error:', err);
    }
  };

  const handleOpenCapsule = async (capsuleId: string) => {
    try {
      const response = await fetch(`/api/time-capsules/${capsuleId}/open`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to open time capsule');
      }

      await loadCapsuleData();
      alert('Time capsule opened! 🎉');
    } catch (err) {
      alert('Failed to open time capsule. Please try again.');
      console.error('Capsule opening error:', err);
    }
  };

  if (loading) {
    return (
      <div className="capsule-loading">
        <div className="loading-spinner"></div>
        <p>Loading time capsules...</p>
      </div>
    );
  }

  if (error && !capsuleData) {
    return (
      <div className="capsule-error">
        <h2>Unable to load time capsules</h2>
        <p>{error}</p>
        <button onClick={loadCapsuleData}>Try Again</button>
      </div>
    );
  }

  const capsules = capsuleData?.capsules || [];
  const upcoming = capsuleData?.upcoming || [];

  return (
    <div className="time-capsule-page">
      <style jsx>{`
        .time-capsule-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: 'Georgia', serif;
          background: linear-gradient(135deg, #f8f6f8 0%, #ffffff 100%);
          min-height: 100vh;
        }

        .capsule-header {
          text-align: center;
          margin-bottom: 3rem;
          padding: 2rem;
          background: linear-gradient(135deg, #8b7a8a, #d4a574);
          border-radius: 16px;
          color: white;
        }

        .capsule-header h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .capsule-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .create-capsule-btn {
          background: linear-gradient(135deg, #d4a574, #8b7a8a);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.3s;
        }

        .create-capsule-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(139, 122, 138, 0.3);
        }

        .upcoming-section {
          margin-bottom: 3rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .section-header h2 {
          color: #8b7a8a;
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
        }

        .upcoming-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .upcoming-capsule {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(139, 122, 138, 0.1);
          border-left: 4px solid #d4a574;
          text-align: center;
        }

        .countdown-display {
          background: linear-gradient(135deg, #8b7a8a, #d4a574);
          color: white;
          padding: 2rem;
          border-radius: 12px;
          margin-bottom: 1rem;
        }

        .countdown-number {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .countdown-label {
          font-size: 1rem;
          opacity: 0.9;
        }

        .capsule-title {
          color: #8b7a8a;
          font-size: 1.3rem;
          margin-bottom: 1rem;
          font-weight: bold;
        }

        .capsule-description {
          color: #666;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .capsule-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
          color: #666;
        }

        .all-capsules {
          margin-top: 3rem;
        }

        .capsules-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .capsule-card {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s;
          border-left: 4px solid #8b7a8a;
        }

        .capsule-card:hover {
          transform: translateY(-4px);
        }

        .capsule-card.sealed {
          border-left-color: #d4a574;
          background: linear-gradient(135deg, #f8f6f8, #ffffff);
        }

        .capsule-card.openable {
          border-left-color: #48bb78;
          background: linear-gradient(135deg, #f0fff4, #ffffff);
        }

        .capsule-status {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: bold;
          margin-bottom: 1rem;
        }

        .capsule-status.sealed {
          background: #fed7d7;
          color: #c53030;
        }

        .capsule-status.open {
          background: #c6f6d5;
          color: #2f855a;
        }

        .capsule-status.pending {
          background: #feebc8;
          color: #c05621;
        }

        .capsule-content-count {
          background: #edf2f7;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          margin: 1rem 0;
          text-align: center;
          color: #4a5568;
        }

        .capsule-actions-row {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .capsule-btn {
          flex: 1;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s;
        }

        .capsule-btn.primary {
          background: linear-gradient(135deg, #8b7a8a, #d4a574);
          color: white;
        }

        .capsule-btn.secondary {
          background: transparent;
          border: 1px solid #8b7a8a;
          color: #8b7a8a;
        }

        .capsule-btn:hover {
          transform: translateY(-1px);
        }

        .capsule-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .creation-form {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(139, 122, 138, 0.1);
          margin-bottom: 3rem;
        }

        .form-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .form-header h3 {
          color: #8b7a8a;
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          color: #4a5568;
          font-weight: bold;
        }

        .form-input,
        .form-textarea,
        .form-select {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }

        .form-input:focus,
        .form-textarea:focus,
        .form-select:focus {
          outline: none;
          border-color: #8b7a8a;
        }

        .form-textarea {
          min-height: 100px;
          resize: vertical;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .form-btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.3s;
        }

        .form-btn.primary {
          background: linear-gradient(135deg, #8b7a8a, #d4a574);
          color: white;
        }

        .form-btn.secondary {
          background: transparent;
          border: 2px solid #8b7a8a;
          color: #8b7a8a;
        }

        .form-btn:hover {
          transform: translateY(-2px);
        }

        .capsule-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 50vh;
          color: #8b7a8a;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 3px solid #e2e8f0;
          border-top: 3px solid #8b7a8a;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .capsule-error {
          text-align: center;
          padding: 3rem;
          color: #e53e3e;
        }

        .capsule-error button {
          background: #8b7a8a;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 1rem;
        }

        @media (max-width: 768px) {
          .time-capsule-page {
            padding: 1rem;
          }

          .capsule-header h1 {
            font-size: 2rem;
          }

          .capsule-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .upcoming-grid {
            grid-template-columns: 1fr;
          }

          .capsules-grid {
            grid-template-columns: 1fr;
          }

          .countdown-number {
            font-size: 2rem;
          }
        }
      `}</style>

      <div className="capsule-header">
        <h1>⏰ Digital Time Capsules</h1>
        <p>Preserve memories to be discovered in the future</p>
      </div>

      <div className="capsule-actions">
        <div>
          <h3>Total Capsules: {capsuleData?.totalCapsules || 0}</h3>
        </div>
        <button className="create-capsule-btn" onClick={() => setShowCreateForm(!showCreateForm)}>
          🕰️ Create Time Capsule
        </button>
      </div>

      {showCreateForm && (
        <CapsuleCreationForm
          onSubmit={handleCreateCapsule}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {upcoming.length > 0 && (
        <div className="upcoming-section">
          <div className="section-header">
            <h2>⏳ Opening Soon</h2>
            <p>These capsules are ready to be opened!</p>
          </div>

          <div className="upcoming-grid">
            {upcoming.map((capsule) => {
              const openDate = new Date(capsule.openDate);
              const now = new Date();
              const canOpen = openDate <= now;
              const daysUntil = Math.ceil(
                (openDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
              );

              return (
                <div key={capsule.id} className="upcoming-capsule">
                  <div className="countdown-display">
                    <div className="countdown-number">{canOpen ? '🎉' : daysUntil}</div>
                    <div className="countdown-label">
                      {canOpen ? 'Ready to Open!' : `Days Until Opening`}
                    </div>
                  </div>

                  <div className="capsule-title">{capsule.title}</div>
                  <div className="capsule-description">{capsule.description}</div>

                  <div className="capsule-meta">
                    <span>By {capsule.creator.name}</span>
                    <span>{capsule.contents.length} items</span>
                  </div>

                  {canOpen && (
                    <button
                      className="capsule-btn primary"
                      onClick={() => handleOpenCapsule(capsule.id)}
                      style={{ marginTop: '1rem', width: '100%' }}
                    >
                      🔓 Open Capsule
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="all-capsules">
        <div className="section-header">
          <h2>All Time Capsules</h2>
          <p>Your collection of preserved memories</p>
        </div>

        <div className="capsules-grid">
          {capsules.map((capsule) => {
            const openDate = new Date(capsule.openDate);
            const now = new Date();
            const canOpen = openDate <= now && !capsule.openedAt;
            const isOpened = !!capsule.openedAt;

            return (
              <div
                key={capsule.id}
                className={`capsule-card ${capsule.isSealed ? 'sealed' : ''} ${canOpen ? 'openable' : ''}`}
              >
                <div
                  className={`capsule-status ${isOpened ? 'open' : canOpen ? 'pending' : 'sealed'}`}
                >
                  {isOpened ? '🔓 Opened' : canOpen ? '⏰ Ready' : '🔒 Sealed'}
                </div>

                <div className="capsule-title">{capsule.title}</div>
                <div className="capsule-description">{capsule.description}</div>

                <div className="capsule-content-count">
                  📦 {capsule.contents.length} items preserved
                </div>

                <div className="capsule-meta">
                  <span>Created by {capsule.creator.name}</span>
                  <span>Opens: {openDate.toLocaleDateString()}</span>
                </div>

                <div className="capsule-actions-row">
                  <button
                    className="capsule-btn secondary"
                    onClick={() => setSelectedCapsule(capsule)}
                  >
                    👁️ View
                  </button>

                  {canOpen && (
                    <button
                      className="capsule-btn primary"
                      onClick={() => handleOpenCapsule(capsule.id)}
                    >
                      🔓 Open
                    </button>
                  )}

                  {!capsule.isSealed && !isOpened && (
                    <button className="capsule-btn secondary">➕ Add Content</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedCapsule && (
        <CapsuleModal capsule={selectedCapsule} onClose={() => setSelectedCapsule(null)} />
      )}
    </div>
  );
}

function CapsuleCreationForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: CapsuleCreationData) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    openDate: '',
    creator: {
      name: '',
      email: '',
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: string, value: string) => {
    if (field.startsWith('creator.')) {
      const creatorField = field.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        creator: {
          ...prev.creator,
          [creatorField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // Set minimum date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="creation-form">
      <div className="form-header">
        <h3>Create Time Capsule</h3>
        <p>Preserve memories for the future</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Capsule Title *</label>
          <input
            type="text"
            className="form-input"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Give your time capsule a meaningful name..."
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-textarea"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="What memories will this capsule contain?"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Opening Date *</label>
          <input
            type="date"
            className="form-input"
            value={formData.openDate}
            onChange={(e) => handleChange('openDate', e.target.value)}
            min={minDate}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Your Name *</label>
          <input
            type="text"
            className="form-input"
            value={formData.creator.name}
            onChange={(e) => handleChange('creator.name', e.target.value)}
            placeholder="Your full name"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email *</label>
          <input
            type="email"
            className="form-input"
            value={formData.creator.email}
            onChange={(e) => handleChange('creator.email', e.target.value)}
            placeholder="your.email@example.com"
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="form-btn primary">
            Create Capsule
          </button>
          <button type="button" className="form-btn secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function CapsuleModal({ capsule, onClose }: { capsule: TimeCapsule; onClose: () => void }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '2rem',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '80vh',
          overflow: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <h3 style={{ color: '#8B7A8A', margin: 0 }}>{capsule.title}</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#666',
            }}
          >
            ✕
          </button>
        </div>

        <p style={{ color: '#666', marginBottom: '1rem' }}>{capsule.description}</p>

        <div
          style={{
            background: '#F7FAFC',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
          }}
        >
          <strong>Opening Date:</strong> {new Date(capsule.openDate).toLocaleDateString()}
          <br />
          <strong>Created by:</strong> {capsule.creator.name}
          <br />
          <strong>Contents:</strong> {capsule.contents.length} items
        </div>

        {capsule.contents.length > 0 && (
          <div>
            <h4 style={{ color: '#8B7A8A' }}>Contents:</h4>
            {capsule.contents.map((content) => (
              <div
                key={content.id}
                style={{
                  background: '#F7FAFC',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  marginBottom: '0.5rem',
                }}
              >
                <strong>{content.type}:</strong> {content.content}
                <br />
                <small style={{ color: '#666' }}>By {content.author}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
