const jwt = require('jsonwebtoken');
const Secret_Key = "mysecretkey";


const authenticateUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/login')
    }
    try {
        const decoded = jwt.verify(token, Secret_Key);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.clearCookie("token");
        res.clearCookie('connect.sid')
    }
};


module.exports = authenticateUser;
