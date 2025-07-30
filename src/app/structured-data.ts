export const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: "Austin & Jordyn's Wedding",
  description: 'Join us in celebrating the wedding of Austin & Jordyn Porada',
  image: 'https://theporadas.com/images/engagement/PoradaProposal-11.webp',
  url: 'https://theporadas.com',
  organizer: {
    '@type': 'Person',
    name: 'Austin & Jordyn Porada',
  },
  location: {
    '@type': 'Place',
    name: 'Wedding Venue', // Update with actual venue
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'City', // Update with actual city
      addressRegion: 'State', // Update with actual state
      addressCountry: 'US',
    },
  },
  startDate: '2024-01-01', // Update with actual wedding date
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
};
