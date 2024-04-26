const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, 'ccs-course-enlistment', { expiresIn: '1h' });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, 'ccs-course-enlistment');
    } catch (error) {
        return null;
    }
};

module.exports = {
    generateToken,
    verifyToken
};
