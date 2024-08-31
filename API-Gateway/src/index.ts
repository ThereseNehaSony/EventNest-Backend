import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import proxy from 'express-http-proxy';
import dotenv from 'dotenv'

dotenv.config()

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 4000;

const corsOptions = {
  origin: 'http://localhost:3000', 
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

//  log middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Proxy to auth-service
app.use('/auth', proxy(String(process.env.AUTH_SERVICE_URL), {
  proxyReqPathResolver: function(req) {
    console.log(`Proxying request to: ${process.env.AUTH_SERVICE_URL}/auth${req.url}`);
    return '/auth' + req.url;
  }
}));
// Proxy to user-service
app.use('/user', proxy(String(process.env.USER_SERVICE_URL), {
  proxyReqPathResolver: function(req) {
    console.log(`Proxying request to: ${process.env.USER_SERVICE_URL}/user${req.url}`);
    return '/user' + req.url;
  }
}));
// Proxy to event-service
app.use('/event', proxy(String(process.env.EVENT_SERVICE_URL), {
  proxyReqPathResolver: function(req) {
    console.log(`Proxying request to: ${process.env.EVENT_SERVICE_URL}/event${req.url}`);
    return '/event' + req.url;
  }
}));
// Proxy to host-service
app.use('/host', proxy(String(process.env.HOST_SERVICE_URL), {
  proxyReqPathResolver: function(req) {
    console.log(`Proxying request to: ${process.env.HOST_SERVICE_URL}/host${req.url}`);
    return '/host' + req.url;
  }
}));
// Proxy to payment-service
app.use('/payment', proxy(String(process.env.PAYMENT_SERVICE_URL), {
  proxyReqPathResolver: function(req) {
    console.log(`Proxying request to: ${process.env.PAYMENT_SERVICE_URL}/payment${req.url}`);
    return '/payment' + req.url;
  }
}));

app.listen(PORT, () => console.log(`hello API Gateway running at http://localhost:${PORT}`));
