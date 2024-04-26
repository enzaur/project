const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const client = require('./database/database');
const app = express();
const PORT = process.env.PORT || 3000; // Changed port to 3000 for demonstration

app.use(cors());
app.use(bodyParser.json());

// Import route files
const userRouter = require('./routers/Users');
const rolesRouter = require('./routers/Roles');
const courseRouter = require('./routers/Courses');
const subjectRouter = require('./routers/Subjects');
const sectionRouter = require('./routers/Section');
const enrollmentRouter = require('./routers/Enrollment');

// Define routes
app.use('/users', userRouter);
app.use('/roles', rolesRouter);
app.use('/courses', courseRouter);
app.use('/subjects', subjectRouter);
app.use('/sections', sectionRouter);
app.use('/enrollment', enrollmentRouter);

app.get('/', (req, res) => {
    res.json({ message: 'Restful API Backend Using ExpresJS' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
