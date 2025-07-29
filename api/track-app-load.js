export default function handler(req, res) {
  if (req.method === 'POST') {
    const { timestamp, userAgent, referrer, location, screenSize, language } = req.body;
    
    // Log the analytics data
    console.log('App Load Analytics:', {
      timestamp,
      userAgent,
      referrer,
      location,
      screenSize,
      language
    });
    
    // Here you could save to a database, send to external service, etc.
    // For now, we'll just log it
    
    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 