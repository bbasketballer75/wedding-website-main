import React, { useState, useEffect } from 'react';
import { getGuestbookEntries, createGuestbookEntry } from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import './GuestbookPage.css';

const GuestbookPage = () => {
  const [entries, setEntries] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEntries = async () => {
      setIsLoading(true);
      try {
        const response = await getGuestbookEntries();
        setEntries(response.data);
      } catch {
        // Could not load guestbook entries. Please try again later.
      } finally {
        setIsLoading(false);
      }
    };
    fetchEntries();
  }, []);

  // Add handleSubmit function if missing
  const handleSubmit = async (e) => {
    // eslint-disable-next-line no-console
    // ...existing code...
    e.preventDefault();
    setFormError(null);
    setSuccess(null);
    setIsSubmitting(true);
    try {
      if (!message.trim()) {
        setFormError('Message is required.');
        // eslint-disable-next-line no-console
        // ...existing code...
        setIsSubmitting(false);
        return;
      }
      await createGuestbookEntry({ name, message });
      setSuccess('Thank you for signing our guestbook!');
      setMessage('');
      setName('');
      // Refresh entries
      const response = await getGuestbookEntries();
      setEntries(response.data);
    } catch {
      setFormError('Could not submit your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="guestbook-page">
      {isLoading && <LoadingScreen message="Loading guestbook..." />}
      {!isLoading && (
        <>
          <h2 id="guestbook-title" className="section-title">
            Guestbook
          </h2>
          <p className="guestbook-subheading">
            Leave a message or share your favorite memory from our wedding day. We love reading your
            stories!
          </p>
          <form
            className="guestbook-form"
            onSubmit={handleSubmit}
            aria-labelledby="guestbook-title"
            noValidate
          >
            <fieldset>
              <legend className="sr-only">Add a guestbook entry</legend>
              <div className="input-group">
                <label className="label" htmlFor="guestbook-name">
                  Name (optional)
                </label>
                <input
                  className="input"
                  id="guestbook-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  placeholder="Your name"
                  autoComplete="name"
                  aria-describedby="name-help"
                />
                <div id="name-help" className="sr-only">
                  Optional field for your name, up to 100 characters
                </div>
              </div>
              <div className="input-group">
                <label className="label" htmlFor="guestbook-message">
                  Message *
                </label>
                <textarea
                  className="textarea"
                  id="guestbook-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={500}
                  placeholder="Share your favorite memory or a message for the couple!"
                  required
                  aria-required="true"
                  aria-describedby="message-help"
                  aria-invalid={formError ? 'true' : 'false'}
                  rows={4}
                />
                <div id="message-help" className="input-description">
                  Required field. Share your thoughts, up to 500 characters.
                </div>
              </div>
            </fieldset>
            {formError && (
              <div className="form-error" role="alert" aria-live="assertive">
                {formError}
              </div>
            )}
            {success && (
              <div className="form-success" role="status" aria-live="polite">
                {success}
              </div>
            )}
            <button
              className="button"
              type="submit"
              disabled={isSubmitting}
              aria-describedby={isSubmitting ? 'submit-status' : undefined}
            >
              {isSubmitting ? 'Signing...' : 'Sign Guestbook'}
            </button>
            {isSubmitting && (
              <div id="submit-status" className="sr-only" aria-live="polite">
                Submitting your guestbook entry, please wait...
              </div>
            )}
          </form>
          <section
            className="messages"
            aria-labelledby="entries-title"
            role="log"
            aria-live="polite"
          >
            <h3 id="entries-title" className="sr-only">
              Guestbook Entries
            </h3>
            {entries.length === 0 ? (
              <div className="empty-state" role="status">
                No messages yet. Be the first to share a memory!
              </div>
            ) : (
              <>
                <div className="sr-only" aria-live="polite">
                  {entries.length} guestbook {entries.length === 1 ? 'entry' : 'entries'} available
                </div>
                {entries.map((entry, index) => (
                  <article
                    className="message"
                    key={entry._id || entry.timestamp || index}
                    role="article"
                    aria-labelledby={`entry-${index}-author`}
                  >
                    <div
                      id={`entry-${index}-author`}
                      className="message-name"
                      aria-label="Message from"
                    >
                      {entry.name || 'Anonymous Guest'}
                    </div>
                    <div className="message-text" aria-label="Message content">
                      {entry.message}
                    </div>
                    <time
                      className="message-date sr-only"
                      dateTime={entry.timestamp}
                      aria-label="Posted on"
                    >
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </time>
                  </article>
                ))}
              </>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default GuestbookPage;
