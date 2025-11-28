const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// POST endpoint to enable Claude Haiku 4.5
app.post('/api/postEnable', (req, res) => {
  try {
    const { clientId, feature } = req.body;
    
    // Enable Claude Haiku 4.5 for all clients
    const response = {
      status: 'success',
      message: 'Enable Claude Haiku 4.5 for all clients',
      feature: feature || 'Claude Haiku 4.5',
      timestamp: new Date().toISOString(),
      allClientsEnabled: true
    };
    
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});