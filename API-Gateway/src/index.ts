import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import proxy from 'express-http-proxy';

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 4000;

const corsOptions = {
  origin: 'http://localhost:3000', // Client URL
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Proxy to authentication service
app.use('/auth', proxy('http://localhost:3001', {
  proxyReqPathResolver: function(req) {
    console.log(`Proxying request to: http://localhost:3001/auth${req.url}`);
    return '/auth' + req.url;
  }
}));
app.use('/user', proxy('http://localhost:3002', {
  proxyReqPathResolver: function(req) {
    console.log(`Proxying request to: http://localhost:3002/user${req.url}`);
    return '/user' + req.url;
  }
}));
app.use('/event', proxy('http://localhost:3003', {
  proxyReqPathResolver: function(req) {
    console.log(`Proxying request to: http://localhost:3003/event${req.url}`);
    return '/event' + req.url;
  }
}));
app.use('/host', proxy('http://localhost:3005', {
  proxyReqPathResolver: function(req) {
    console.log(`Proxying request to: http://localhost:3005/host${req.url}`);
    return '/host' + req.url;
  }
}));

app.listen(PORT, () => console.log(`hello API Gateway running at http://localhost:${PORT}`));
