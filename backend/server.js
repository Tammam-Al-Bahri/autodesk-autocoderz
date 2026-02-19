import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const BASIC_AUTH = process.env.APS_BASIC_AUTH;

app.get('/api/auth/token', async (req, res) => {
  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append(
      'scope',
      'data:read data:write data:create bucket:create bucket:read'
    );

    const response = await axios.post(
      'https://developer.api.autodesk.com/authentication/v2/token',
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${BASIC_AUTH}`
        }
      }
    );

    res.json(response.data);

  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
