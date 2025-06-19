const express = require('express');
const axios = require('axios');
const cors = require('cors');

require('dotenv').config();

const app = express();
const CredLoginRoutes = require('./routes/CredLoginRoutes.js');
const dbUserFunctionRoutes = require('./routes/dbUserFunctionsRoutes');
const connectDB = require('./config/db.js');

app.use(cors());
app.use(express.json());
app.use("/api", CredLoginRoutes);
app.use("/db", dbUserFunctionRoutes);

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirect_uri = 'http://127.0.0.1:5174/callback';

connectDB();

app.listen(3001, () => {
    console.log('Backend running at http://localhost:3001');
});

