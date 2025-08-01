'use client';
import React, { useState } from 'react';

const FamilyWeddingPartyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'family' | 'wedding-party'>('family');

  return (
    <div className="family-wedding-party-page">
      <div className="container">
        <header className="section-header">
          <h2 className="section-title">
            <span className="script-text">Our People</span>
          </h2>
          <p className="section-description">
            The special people who have shaped our lives and supported our journey together.
          </p>
        </header>

        <div
          className="tab-navigation"
          role="tablist"
          aria-label="Family and Wedding Party sections"
        >
          <button
            role="tab"
            aria-selected={activeTab === 'family'}
            aria-controls="family-content"
            className={`tab-button ${activeTab === 'family' ? 'active' : ''}`}
            onClick={() => setActiveTab('family')}
          >
            🌳 Family Tree
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'wedding-party'}
            aria-controls="wedding-party-content"
            className={`tab-button ${activeTab === 'wedding-party' ? 'active' : ''}`}
            onClick={() => setActiveTab('wedding-party')}
          >
            👰🤵 Wedding Party
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'family' && (
            <div
              id="family-content"
              role="tabpanel"
              aria-labelledby="family-tab"
              className="family-tree-section"
            >
              <h3 className="subsection-title">Our Family Tree</h3>
              <p className="content-description">
                The loving families that brought us together and continue to support us.
              </p>

              <div className="family-grid">
                <div className="family-branch">
                  <h4 className="branch-title">Austin&rsquo;s Family</h4>
                  <div className="family-members">
                    <div className="family-member">
                      <div className="member-photo-placeholder">👨‍👩‍👧‍👦</div>
                      <h5>Parents & Siblings</h5>
                      <p>The Porada family foundation</p>
                    </div>
                  </div>
                </div>

                <div className="family-branch">
                  <h4 className="branch-title">Jordyn&rsquo;s Family</h4>
                  <div className="family-members">
                    <div className="family-member">
                      <div className="member-photo-placeholder">👨‍👩‍👧‍👦</div>
                      <h5>Parents & Siblings</h5>
                      <p>The Pringle family foundation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wedding-party' && (
            <div
              id="wedding-party-content"
              role="tabpanel"
              aria-labelledby="wedding-party-tab"
              className="wedding-party-section"
            >
              <h3 className="subsection-title">Our Wedding Party</h3>
              <p className="content-description">
                The special friends and family who stood by our side on our wedding day.
              </p>

              <div className="wedding-party-grid">
                <div className="party-side">
                  <h4 className="side-title">Bridesmaids</h4>
                  <div className="party-members">
                    <div className="party-member">
                      <div className="member-photo-placeholder">👩</div>
                      <h5>Maid of Honor</h5>
                      <p>Jordyn&rsquo;s best friend and confidante</p>
                    </div>
                    <div className="party-member">
                      <div className="member-photo-placeholder">👩</div>
                      <h5>Bridesmaids</h5>
                      <p>Sisters and closest friends</p>
                    </div>
                  </div>
                </div>

                <div className="party-side">
                  <h4 className="side-title">Groomsmen</h4>
                  <div className="party-members">
                    <div className="party-member">
                      <div className="member-photo-placeholder">👨</div>
                      <h5>Best Man</h5>
                      <p>Austin&rsquo;s brother and best friend</p>
                    </div>
                    <div className="party-member">
                      <div className="member-photo-placeholder">👨</div>
                      <h5>Groomsmen</h5>
                      <p>Brothers and closest friends</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FamilyWeddingPartyPage;
