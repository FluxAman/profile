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

const fs = require('fs');
const path = require('path');
const multer = require('multer');

const DATA_FILE = path.join(__dirname, 'data.json');
const UPLOAD_DIR = path.join(__dirname, 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR)
  },
  filename: function (req, file, cb) {
    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Serve static files from current directory
app.use(express.static(__dirname));
app.use('/uploads', express.static(UPLOAD_DIR));

// Get data
app.get('/api/data', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      // If file doesn't exist, return default structure or error
      // For now, let's return error or empty structure
      if (err.code === 'ENOENT') {
        return res.json({ profile: {}, education: [], posts: [] });
      }
      return res.status(500).json({ error: 'Failed to read data' });
    }
    res.json(JSON.parse(data));
  });
});

// Update data
app.post('/api/update', (req, res) => {
  const newData = req.body;
  fs.writeFile(DATA_FILE, JSON.stringify(newData, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to save data' });
    }
    res.json({ success: true, data: newData });
  });
});

// Upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  // Return the path relative to server root
  res.json({ url: 'uploads/' + req.file.filename, type: req.file.mimetype });
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});