'use client';

import { useCallback, useEffect, useState } from 'react';

interface StoryAuthor {
  name: string;
  email: string;
  relationship: string;
}

interface Story {
  id: string;
  title: string;
  content: string;
  author: StoryAuthor;
  category: string;
  tags: string[];
  status: string;
  createdAt: string;
  isFeatured?: boolean;
}

interface StorySubmission {
  title: string;
  content: string;
  author: StoryAuthor;
  category: string;
}

interface StoriesData {
  stories: Story[];
  categories: Array<{ name: string; count: number }>;
  featuredStories: Story[];
  totalStories: number;
}

/**
 * 📖 Guest Stories Page
 * Collection of heartfelt stories from wedding guests
 */
export default function GuestStoriesPage() {
  const [storiesData, setStoriesData] = useState<StoriesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);

  const loadStoriesData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch stories with category filter
      const storiesUrl =
        selectedCategory === 'all'
          ? '/api/guest-stories'
          : `/api/guest-stories?category=${selectedCategory}`;

      const [storiesResponse, categoriesResponse, featuredResponse] = await Promise.all([
        fetch(storiesUrl),
        fetch('/api/guest-stories/categories'),
        fetch('/api/guest-stories/featured'),
      ]);

      if (!storiesResponse.ok || !categoriesResponse.ok || !featuredResponse.ok) {
        throw new Error('Failed to load stories data');
      }

      const [storiesResult, categoriesResult, featuredResult] = await Promise.all([
        storiesResponse.json(),
        categoriesResponse.json(),
        featuredResponse.json(),
      ]);

      setStoriesData({
        stories: storiesResult.data || [],
        categories: categoriesResult.data || [],
        featuredStories: featuredResult.data || [],
        totalStories: storiesResult.pagination?.total || 0,
      });

      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');

      // Fallback data
      const fallbackData = {
        stories: [
          {
            id: '1',
            title: 'A Beautiful Beginning',
            content: 'I remember when Austin first told me about Jordyn...',
            author: { name: 'Sarah Johnson', email: 'sarah@example.com', relationship: 'friend' },
            category: 'memories',
            tags: ['love', 'friendship'],
            status: 'approved',
            createdAt: new Date().toISOString(),
            isFeatured: true,
          },
        ],
        categories: [
          { name: 'memories', count: 5 },
          { name: 'advice', count: 3 },
        ],
        featuredStories: [],
        totalStories: 1,
      };
      setStoriesData(fallbackData);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    loadStoriesData();
  }, [loadStoriesData]);

  const handleStorySubmit = async (storyData: StorySubmission) => {
    try {
      const response = await fetch('/api/guest-stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(storyData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit story');
      }

      // Reload stories data
      await loadStoriesData();
      setShowSubmissionForm(false);

      // Show success message
      alert('Thank you for sharing your story! It will be reviewed and published soon.');
    } catch (err) {
      alert('Failed to submit story. Please try again.');
      console.error('Story submission error:', err);
    }
  };

  if (loading) {
    return (
      <div className="stories-loading">
        <div className="loading-spinner"></div>
        <p>Loading beautiful stories...</p>
      </div>
    );
  }

  if (error && !storiesData) {
    return (
      <div className="stories-error">
        <h2>Unable to load stories</h2>
        <p>{error}</p>
        <button onClick={loadStoriesData}>Try Again</button>
      </div>
    );
  }

  const categories = storiesData?.categories || [];
  const stories = storiesData?.stories || [];
  const featuredStories = storiesData?.featuredStories || [];

  return (
    <div className="guest-stories-page">
      <style jsx>{`
        .guest-stories-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: 'Georgia', serif;
          background: linear-gradient(135deg, #f8f6f8 0%, #ffffff 100%);
          min-height: 100vh;
        }

        .stories-header {
          text-align: center;
          margin-bottom: 3rem;
          padding: 2rem;
          background: linear-gradient(135deg, #8b7a8a, #d4a574);
          border-radius: 16px;
          color: white;
        }

        .stories-header h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .stories-header p {
          font-size: 1.2rem;
          opacity: 0.9;
        }

        .stories-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .category-filters {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .category-filter {
          background: white;
          border: 2px solid #e2e8f0;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 0.9rem;
        }

        .category-filter.active {
          background: #8b7a8a;
          border-color: #8b7a8a;
          color: white;
        }

        .category-filter:hover {
          border-color: #8b7a8a;
          transform: translateY(-2px);
        }

        .submit-story-btn {
          background: linear-gradient(135deg, #d4a574, #8b7a8a);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.3s;
          text-decoration: none;
          display: inline-block;
        }

        .submit-story-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(139, 122, 138, 0.3);
        }

        .featured-stories {
          margin-bottom: 3rem;
        }

        .featured-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .featured-header h2 {
          color: #8b7a8a;
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
        }

        .featured-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .featured-story {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(139, 122, 138, 0.1);
          border-left: 4px solid #d4a574;
          transition: transform 0.3s;
        }

        .featured-story:hover {
          transform: translateY(-4px);
        }

        .story-header {
          margin-bottom: 1rem;
        }

        .story-title {
          color: #8b7a8a;
          font-size: 1.3rem;
          margin-bottom: 0.5rem;
          font-weight: bold;
        }

        .story-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 1rem;
        }

        .story-author {
          font-weight: bold;
        }

        .story-category {
          background: #f7fafc;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          color: #8b7a8a;
        }

        .story-content {
          color: #4a5568;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .story-tags {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .story-tag {
          background: linear-gradient(135deg, #8b7a8a, #d4a574);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
        }

        .all-stories {
          margin-top: 3rem;
        }

        .all-stories-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .all-stories-header h2 {
          color: #8b7a8a;
          font-size: 1.8rem;
        }

        .stories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .story-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s;
        }

        .story-card:hover {
          transform: translateY(-2px);
        }

        .story-preview {
          color: #666;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .read-more {
          color: #8b7a8a;
          text-decoration: none;
          font-weight: bold;
          cursor: pointer;
        }

        .read-more:hover {
          text-decoration: underline;
        }

        .stories-loading {
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

        .stories-error {
          text-align: center;
          padding: 3rem;
          color: #e53e3e;
        }

        .stories-error button {
          background: #8b7a8a;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 1rem;
        }

        .submission-form {
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
          min-height: 120px;
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

        @media (max-width: 768px) {
          .guest-stories-page {
            padding: 1rem;
          }

          .stories-header h1 {
            font-size: 2rem;
          }

          .stories-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .category-filters {
            justify-content: center;
          }

          .featured-grid {
            grid-template-columns: 1fr;
          }

          .stories-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="stories-header">
        <h1>📖 Our Story Collection</h1>
        <p>Beautiful memories shared by our loved ones</p>
      </div>

      <div className="stories-actions">
        <div className="category-filters">
          <button
            className={`category-filter ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All Stories ({storiesData?.totalStories || 0})
          </button>
          {categories.map((category) => (
            <button
              key={category.name}
              className={`category-filter ${selectedCategory === category.name ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name.replace('_', ' ').toUpperCase()} ({category.count})
            </button>
          ))}
        </div>

        <button
          className="submit-story-btn"
          onClick={() => setShowSubmissionForm(!showSubmissionForm)}
        >
          ✍️ Share Your Story
        </button>
      </div>

      {showSubmissionForm && (
        <StorySubmissionForm
          onSubmit={handleStorySubmit}
          onCancel={() => setShowSubmissionForm(false)}
        />
      )}

      {featuredStories.length > 0 && (
        <div className="featured-stories">
          <div className="featured-header">
            <h2>✨ Featured Stories</h2>
            <p>Heartwarming tales that captured our hearts</p>
          </div>

          <div className="featured-grid">
            {featuredStories.map((story) => (
              <div key={story.id} className="featured-story">
                <div className="story-header">
                  <div className="story-title">{story.title}</div>
                  <div className="story-meta">
                    <span className="story-author">By {story.author.name}</span>
                    <span className="story-category">{story.category.replace('_', ' ')}</span>
                  </div>
                </div>

                <div className="story-content">{story.content}</div>

                {story.tags.length > 0 && (
                  <div className="story-tags">
                    {story.tags.map((tag, index) => (
                      <span key={index} className="story-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="all-stories">
        <div className="all-stories-header">
          <h2>All Stories</h2>
          <p>Every story is special and cherished</p>
        </div>

        <div className="stories-grid">
          {stories.map((story) => (
            <div key={story.id} className="story-card">
              <div className="story-header">
                <div className="story-title">{story.title}</div>
                <div className="story-meta">
                  <span className="story-author">By {story.author.name}</span>
                  <span className="story-category">{story.category.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="story-preview">{story.content}</div>

              <a href="#" className="read-more">
                Read Full Story →
              </a>

              {story.tags.length > 0 && (
                <div className="story-tags">
                  {story.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="story-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StorySubmissionForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: StorySubmission) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: {
      name: '',
      email: '',
      relationship: '',
    },
    category: 'memories',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: string, value: string) => {
    if (field.startsWith('author.')) {
      const authorField = field.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        author: {
          ...prev.author,
          [authorField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  return (
    <div className="submission-form">
      <div className="form-header">
        <h3>Share Your Story</h3>
        <p>Tell us about a special memory with Austin & Jordyn</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Story Title *</label>
          <input
            type="text"
            className="form-input"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Give your story a beautiful title..."
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Your Name *</label>
          <input
            type="text"
            className="form-input"
            value={formData.author.name}
            onChange={(e) => handleChange('author.name', e.target.value)}
            placeholder="Your full name"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email *</label>
          <input
            type="email"
            className="form-input"
            value={formData.author.email}
            onChange={(e) => handleChange('author.email', e.target.value)}
            placeholder="your.email@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Relationship to Couple</label>
          <select
            className="form-select"
            value={formData.author.relationship}
            onChange={(e) => handleChange('author.relationship', e.target.value)}
          >
            <option value="">Select relationship...</option>
            <option value="family">Family</option>
            <option value="friend">Friend</option>
            <option value="colleague">Colleague</option>
            <option value="neighbor">Neighbor</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Story Category</label>
          <select
            className="form-select"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            <option value="memories">Memories</option>
            <option value="advice">Advice</option>
            <option value="funny_moments">Funny Moments</option>
            <option value="first_meetings">First Meetings</option>
            <option value="adventures">Adventures</option>
            <option value="heartfelt">Heartfelt</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Your Story *</label>
          <textarea
            className="form-textarea"
            value={formData.content}
            onChange={(e) => handleChange('content', e.target.value)}
            placeholder="Share your beautiful memory, advice, or story about Austin & Jordyn..."
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="form-btn primary">
            Submit Story
          </button>
          <button type="button" className="form-btn secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
