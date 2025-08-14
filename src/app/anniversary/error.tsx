'use client';

import Link from 'next/link';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AnniversaryError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error for debugging
    console.error('Anniversary page error:', error);
  }, [error]);

  return (
    <div className="anniversary-error">
      <style jsx>{`
        .anniversary-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          padding: 2rem;
          text-align: center;
          font-family: 'Georgia', serif;
          background: linear-gradient(135deg, #f8f6f8 0%, #ffffff 100%);
        }

        .error-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          color: #e53e3e;
        }

        .error-title {
          font-size: 2rem;
          color: #8b7a8a;
          margin-bottom: 1rem;
          font-weight: bold;
        }

        .error-message {
          font-size: 1.1rem;
          color: #666;
          margin-bottom: 2rem;
          max-width: 600px;
          line-height: 1.6;
        }

        .error-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .error-button {
          background: linear-gradient(135deg, #8b7a8a, #d4a574);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.3s;
          text-decoration: none;
          display: inline-block;
          font-family: inherit;
        }

        .error-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(139, 122, 138, 0.3);
        }

        .error-button.secondary {
          background: transparent;
          border: 2px solid #8b7a8a;
          color: #8b7a8a;
        }

        .error-button.secondary:hover {
          background: #8b7a8a;
          color: white;
        }

        .error-details {
          margin-top: 2rem;
          padding: 1rem;
          background: #f7fafc;
          border-radius: 8px;
          border-left: 4px solid #e53e3e;
          max-width: 600px;
          text-align: left;
        }

        .error-details summary {
          cursor: pointer;
          font-weight: bold;
          color: #8b7a8a;
          margin-bottom: 0.5rem;
        }

        .error-details pre {
          background: #edf2f7;
          padding: 1rem;
          border-radius: 4px;
          overflow-x: auto;
          font-size: 0.9rem;
          color: #2d3748;
          margin-top: 0.5rem;
        }

        @media (max-width: 768px) {
          .anniversary-error {
            padding: 1rem;
          }

          .error-title {
            font-size: 1.5rem;
          }

          .error-message {
            font-size: 1rem;
          }

          .error-actions {
            flex-direction: column;
            align-items: center;
          }

          .error-button {
            width: 100%;
            max-width: 300px;
          }
        }
      `}</style>

      <div className="error-icon">💔</div>
      <h1 className="error-title">Anniversary Page Error</h1>
      <p className="error-message">
        We encountered an issue while loading your anniversary celebrations. This might be due to a
        temporary network issue or a problem with our servers.
      </p>

      <div className="error-actions">
        <button onClick={reset} className="error-button">
          🔄 Try Again
        </button>
        <Link href="/" className="error-button secondary">
          🏠 Go Home
        </Link>
        <Link href="/guestbook" className="error-button secondary">
          📝 Visit Guestbook
        </Link>
      </div>

      <details className="error-details">
        <summary>Technical Details</summary>
        <p>
          <strong>Error:</strong> {error.message}
        </p>
        {error.digest && (
          <p>
            <strong>Error ID:</strong> {error.digest}
          </p>
        )}
        <pre>{error.stack}</pre>
      </details>
    </div>
  );
}
