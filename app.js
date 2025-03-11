const express = require('express');
const session = require('express-session');
const { Issuer, generators } = require('openid-client');
const app = express();

// Session middleware
app.use(session({
  secret: 'some secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true
  }
}));

// Initialize OpenID Client
let client;
async function initializeClient() {
  const issuer = await Issuer.discover('https://cognito-idp.us-east-1.amazonaws.com/us-east-1_nUgA57dcy');
  client = new issuer.Client({
    client_id: '57tomemnjn6urscpvei97svg84',
    client_secret: '<client secret>',
    redirect_uris: ['https://d84l1y8p4kdic.cloudfront.net'],
    response_types: ['code']
  });
}
initializeClient().catch(console.error);

// Auth status endpoint
app.get('/api/auth/status', (req, res) => {
  if (req.session.userInfo) {
    res.json(req.session.userInfo);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// Login endpoint
app.get('/api/auth/login', (req, res) => {
  const nonce = generators.nonce();
  const state = generators.state();

  req.session.nonce = nonce;
  req.session.state = state;

  const authUrl = client.authorizationUrl({
    scope: 'phone openid email',
    state: state,
    nonce: nonce,
  });

  res.json({ url: authUrl });
});

// Callback endpoint
app.get('/api/auth/callback', async (req, res) => {
  try {
    const params = client.callbackParams(req);
    const tokenSet = await client.callback(
      'https://d84l1y8p4kdic.cloudfront.net',
      params,
      {
        nonce: req.session.nonce,
        state: req.session.state
      }
    );

    const userInfo = await client.userinfo(tokenSet.access_token);
    req.session.userInfo = userInfo;

    res.redirect('/');
  } catch (err) {
    console.error('Callback error:', err);
    res.redirect('/');
  }
});

// Logout endpoint
app.get('/api/auth/logout', (req, res) => {
  req.session.destroy();
  const logoutUrl = `https://<user pool domain>/logout?client_id=57tomemnjn6urscpvei97svg84&logout_uri=<logout uri>`;
  res.json({ url: logoutUrl });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
}); 