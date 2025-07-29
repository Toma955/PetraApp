export default function handler(req, res) {
  if (req.method === 'POST') {
    const { action, timestamp, userAgent } = req.body;
    
    // Log the analytics data
    console.log('App Start Analytics:', {
      action,
      timestamp,
      userAgent
    });
    
    // Here you could save to a database, send to external service, etc.
    // For now, we'll just log it
    
    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 