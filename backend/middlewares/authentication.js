const jwt = require("jsonwebtoken")

 const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ success: false, message: "You are not authenticated!" })

    // in the payload user id is comming is we set during gerating toke.
    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
        if (err) return res.status(403).json({ success: false, message: "Token is not valid" })
        // assigning user id into req.user
        // whenever user request to backend these two things will also send in the req
        req.user = payload;  // req.user.id = user id
        next()
    });
};

module.exports = {verifyToken}