//app.js
require('dotenv').config();

const express = require('express');
const cors = require("cors");
const connectDB = require('./config/Db.js');
const app = express();
const authRoutes = require("./routes/auth.routes.js");
const postRoutes = require("./routes/post.routes.js");
const commentRoutes = require('./routes/comment.routes.js');
const countRoutes = require("./routes/count.routes.js");
const likeRoutes = require('./routes/likes.routes.js');
const bookmarkedRoutes = require('./routes/bookmark.routes.js');
const searchRoute = require('./routes/search.route.js');
const hardDelete = require("./routes/harddete.js");
const verifyemail = require("./routes/verifyemail.route.js");
const forgetpassword = require("./routes/forgetpass.routes.js");
const notificationRoutes = require("./routes/notification.js");
const userprofile = require('./routes/userprofile.route.js')
const API_ORIGIN = process.env.API_ORIGIN;
const cookieParser = require('cookie-parser');

connectDB(); //connection Database

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//middlewares 
app.use(cors({
  origin: `${API_ORIGIN}`, /// Your React app's address
  credentials: true,
  allowedHeaders: ["Content-Type", "x-access-token", "Authorization"] // Added "Authorization"
}));


//Routes
// Health Check Route for UptimeRobot or Manual Checks

app.get('/api/ping', (req, res) => {
  res.status(200).send('Pong! Server is active.');
});

// const bete = process.env.BETE;
// app.get('/api/soulReadsBete', (req, res) => {
//   if (req.headers['x-cron-key'] !== `${bete}`) {
//     return res.status(403).send('Forbidden');
//   }
//   res.send('✅ Website uthi hui hai');
// });

const bete = process.env.BETE;
app.get('/api/soulReadsBete', (req, res) => {
  console.log('Env BETE:', bete);
  console.log('Header x-cron-key:', req.headers['x-cron-key']);

  if (req.headers['x-cron-key'] !== `${bete}`) {
    return res.status(403).send('Forbidden');
  }
  res.send('✅ Website uthi hui hai');
});

app.use('/api/user', userprofile);

app.use('/api', notificationRoutes);

app.use('/api/auth', forgetpassword);

app.use('/api/auth', verifyemail);

app.use('/api/bookmark', bookmarkedRoutes);
app.use('/api/posts', searchRoute)
app.use('/api/likes', likeRoutes);
app.use('/api/posthard', hardDelete);

app.use('/api', countRoutes);

app.use('/api/comments', commentRoutes);

app.use('/api/posts', postRoutes);

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
app.listen(PORT, () => console.log(`Server is running`));