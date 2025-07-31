import React, { useState } from 'react';
import './MemoryWall.css';

// Placeholder for uploaded memories
const initialMemories = [
  {
    id: 1,
    name: 'Emily',
    message: 'Such a beautiful day! Congrats!',
    image: '/images/engagement/PoradaProposal-11.webp',
    date: '2025-07-20',
    reactions: { '❤️': 2, '😂': 1, '🥰': 1 },
  },
  {
    id: 2,
    name: 'Michael',
    message: 'Wishing you a lifetime of happiness!',
    image: '/images/engagement/PoradaProposal-28.webp',
    date: '2025-07-20',
    reactions: { '❤️': 1, '🎉': 2 },
  },
];

const MemoryWall = () => {
  const [memories, setMemories] = useState(initialMemories);
  const [form, setForm] = useState({ name: '', message: '', image: null });
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files[0]) {
      setForm((f) => ({ ...f, image: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate upload
    setTimeout(() => {
      setMemories([
        {
          id: Date.now(),
          name: form.name || 'Anonymous',
          message: form.message,
          image: preview,
          date: new Date().toISOString().slice(0, 10),
          reactions: {},
        },
        ...memories,
      ]);
      setForm({ name: '', message: '', image: null });
      setPreview(null);
      setSubmitting(false);
    }, 800);
  };

  // Emoji reactions logic
  const emojis = ['❤️', '😂', '🥰', '🎉', '👏', '😍'];
  const handleReact = (id, emoji) => {
    setMemories((prev) =>
      prev.map((mem) =>
        mem.id === id
          ? {
              ...mem,
              reactions: {
                ...mem.reactions,
                [emoji]: (mem.reactions?.[emoji] || 0) + 1,
              },
            }
          : mem
      )
    );
  };

  return (
    <section className="memorywall-section">
      <h2 className="memorywall-title">Memory Wall & Photo Booth</h2>
      <form className="memorywall-form" onSubmit={handleSubmit}>
        <label htmlFor="memory-name" className="sr-only">
          Your Name (optional)
        </label>
        <input
          id="memory-name"
          type="text"
          name="name"
          placeholder="Your Name (optional)"
          value={form.name}
          onChange={handleChange}
          disabled={submitting}
          aria-label="Your Name (optional)"
        />
        <label htmlFor="memory-message" className="sr-only">
          Share a memory or message
        </label>
        <textarea
          id="memory-message"
          name="message"
          placeholder="Share a memory or message..."
          value={form.message}
          onChange={handleChange}
          required
          disabled={submitting}
          aria-label="Share a memory or message"
        />
        <label htmlFor="memory-image" className="sr-only">
          Upload an image
        </label>
        <input
          id="memory-image"
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          disabled={submitting}
          aria-label="Upload an image"
        />
        {preview && (
          <picture>
            <source srcSet={preview.replace(/\.(jpg|jpeg|png)$/i, '.webp')} type="image/webp" />
            <source srcSet={preview} type="image/jpeg" />
            <img
              src={preview}
              alt="Preview of uploaded memory"
              className="memorywall-preview"
              loading="lazy"
              width="400"
              height="300"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </picture>
        )}
        <button type="submit" disabled={submitting || !form.message}>
          {submitting ? 'Posting...' : 'Post Memory'}
        </button>
      </form>
      <div className="memorywall-grid">
        {memories.map((mem) => (
          <div className="memorywall-card" key={mem.id}>
            <picture>
              {mem.image ? (
                <>
                  <source
                    srcSet={mem.image.replace(/\.(jpg|jpeg|png)$/i, '.webp')}
                    type="image/webp"
                  />
                  <source srcSet={mem.image} type="image/jpeg" />
                  <img
                    src={mem.image}
                    alt={
                      mem.message
                        ? `Shared memory: ${mem.message.substring(0, 50)}...`
                        : 'Shared wedding memory'
                    }
                    className="memorywall-img"
                    loading="lazy"
                    width="400"
                    height="300"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </>
              ) : null}
            </picture>
            <div className="memorywall-msg">{mem.message}</div>
            <div className="memorywall-reactions">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  className="memorywall-emoji-btn"
                  onClick={() => handleReact(mem.id, emoji)}
                  aria-label={`React with ${emoji}`}
                  type="button"
                >
                  {emoji}{' '}
                  <span className="memorywall-emoji-count">{mem.reactions?.[emoji] || ''}</span>
                </button>
              ))}
            </div>
            <div className="memorywall-meta">
              <span>{mem.name}</span> <span>{mem.date}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MemoryWall;
