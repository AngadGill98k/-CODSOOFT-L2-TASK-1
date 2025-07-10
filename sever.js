const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = 3001
const app = express();
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const multer = require('multer');
const path = require('path');

const fs = require('fs');
app.use(cors({
  origin: 'http://localhost:3000',  // or wherever your React app runs
  credentials: true                // 🔥 must be true to support cookies
}));
app.use(express.json());
const Post = require('./models/post.js')
const User = require('./models/user.js')
mongoose.connect('mongodb://127.0.0.1:27017/job')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));
  
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/job' }),
  cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
}));
app.use(passport.initialize());
app.use(passport.session());



passport.use(new LocalStrategy(
  { usernameField: 'mail' },  // tell passport to use `mail` instead of `username`
  async (mail, password, done) => {
    const user = await User.findOne({ mail });
    if (!user) return done(null, false, { message: 'User not found' });

    const match = await bcrypt.compare(password, user.pass);
    if (!match) return done(null, false, { message: 'Wrong password' });

    return done(null, user);
  }
));

passport.serializeUser((user, done) => {
  done(null, user._id); // Store only the user ID in session
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ msg: 'You must be logged in' });
}


const storage = multer.diskStorage({
  destination: './uploads/resumes/',
  filename: (req, file, cb) => {
    cb(null, `resume-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });


app.post('/download_resume_by_email', async (req, res) => {
  const { mail } = req.body;
  const user = await User.findOne({ mail });

  if (!user || !user.resume) {
    return res.status(404).send('Resume not found');
  }

  const filePath = path.join(__dirname, 'uploads', 'resumes', user.resume);

  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).send('File not found');
  }
});

app.post('/signup', async (req, res) => {
  let data = req.body
    const existingUser = await User.findOne({ mail: data.mail });
  if (existingUser) {
    return res.json({ msg: 'Email already exists' });
  }
  let hashed=await bcrypt.hash(data.password, 10);
  let user = new User({
    name: data.username,
    pass: hashed,
    mail: data.mail,
    about: '',
    achievements: "",
    post: [],
    resume:'',
    jobs_app: [],
  })
  await user.save() 
  res.json({ msg: 'user save' })
})

app.post('/signin', passport.authenticate('local'), (req, res) => {
  res.json({ msg: 'Logged in successfully', user: req.user });
});


app.post('/update_info',ensureAuth, async (req, res) => {
  const { field, value } = req.body;
  const userId = req.user; // or however you store it

  if (!['about', 'achievements'].includes(field)) {
    return res.json({ msg: 'Invalid field' });
  }

  await User.findByIdAndUpdate(userId, { [field]: value });
  res.json({ msg: 'updated' });
});

app.post('/upload_resume', upload.single('resume'), async (req, res) => {
  const userId = req.session.passport.user;
  const filename = req.file.filename;

  await User.findByIdAndUpdate(userId, { resume: filename });
  res.json({ msg: 'Resume uploaded', filename });
});

app.post('/posts', ensureAuth, async (req, res) => {
  let data = req.body
  let company = req.user
  let inter = await User.findOne({ _id:company })

  let id = inter._id
  console.log(id)
  let post = new Post({
    comp_id: id,
    companyName: data.companyName,
    role: data.role,
    salary: data.salary,
    responsibilities: data.responsibilities,
    skills: data.skills,
    description: data.description,
    duration: data.duration,
    startDate: data.startDate,
    endDate: data.endDate,
    applicants: [],
  })
  await post.save()
  inter.post.push(post._id)

  await inter.save()
  console.log("interviwe post array", inter.post)
  
  res.json({ msg: "job posted", post })
})
app.get('/all_posts', async (req, res) => {
  try {
    const posts = await Post.find({});
    res.json({ posts });
  } catch (err) {
    console.error('Error fetching all posts:', err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});


app.post('/search', ensureAuth, async (req, res) => {
  let data = req.body
  let list = await Post.find({ role: data.job })
  console.log(list)
  res.json({ msg: "list sendd", list })
})


app.post('/apply',ensureAuth, async (req, res) => {
  let data = req.body
  let id = data.id
  let user_id = req.user
  let user = await User.findOne({ _id: user_id })
  let post = await Post.findOne({ _id: id })
  post.applicants.push(user._id)
  post.save()
  
  
  user.jobs_app.push({ id: id, status: false })//this is adddding post id nothe userid add it later
  user.save()
  res.json({ msg: "apllicant added", post })
})


app.post('/u_details', ensureAuth, async (req, res) => {
  let data = req.body
  let username = req.user
  let user = await User.findOne({ _id: username })

  console.log("user funded ", user)
  res.json({ msg: 'userfounded', user: user })
})

app.post('/g_jobs', ensureAuth, async (req, res) => {
  const jobsApp = req.body.jobs; // array of objects: [{ id, status }]
  const ids = jobsApp.map(job => job.id);
  const posts = await Post.find({ _id: { $in: ids } });

  // Merge each job's status back into full post
  const merged = posts.map(post => {
    const statusObj = jobsApp.find(j => j.id === post._id.toString());
    return { ...post._doc, status: statusObj?.status ?? false };
  });

  res.json({ jobs: merged });
});


app.post('/g_post', ensureAuth, async (req, res) => {
  const postIds = req.body.post; // array of IDs
  const posts = await Post.find({ _id: { $in: postIds } });
  res.json({ posts });
});


app.post('/get_applicants', ensureAuth, async (req, res) => {
  try {
    const { jobId } = req.body;

    // Step 1: Find the post
    const post = await Post.findById(jobId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    // Step 2: Extract applicant IDs
    const applicantIds = post.applicants; // assume this is an array of user _id strings

    // Step 3: Fetch user details
    const applicants = await User.find({ _id: { $in: applicantIds } })
      .select('name mail about achievements resume'); // send only needed fields later ad the i reusme  as n aname ot get them 

    // Step 4: Respond with user data
    res.json({ applicants });
  } catch (err) {
    console.error('Error in /get_applicants:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/update_application_status', ensureAuth, async (req, res) => {
  const { userId, jobId, status } = req.body;

  try {
    const result = await User.updateOne(
      { _id: userId, 'jobs_app.id': jobId },
      { $set: { 'jobs_app.$.status': status } }

    );
    // let post=await Post.findById(jobId)
    // await post.findByIdAndDelete(userId)
    // post.save()
    if (result.modifiedCount > 0) {
      res.json({ message: 'Status updated' });
    } else {
      res.status(400).json({ message: 'No update made' });
    }
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/remove_post', ensureAuth, async (req, res) => {
  const { jobId } = req.body;

  try {
    // 1. Delete the post from Post collection
    await Post.deleteOne({ _id: jobId });

    // 2. Remove jobId from all users' jobs_app
    await User.updateMany(
      {},
      { $pull: { jobs_app: { id: jobId } } }
    );

    // 3. Remove postId from the poster’s post array
    await User.updateMany(
      { post: jobId },
      { $pull: { post: jobId } }
    );

    res.json({ message: 'Post and related data removed successfully' });
  } catch (error) {
    console.error('Error removing post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => console.log('Server running on port 3001'));   