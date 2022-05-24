const jwt = require('jsonwebtoken');
const SECRECT_KEY = "dhinchackpooja"

exports.generateToken = (id) => {
    return jwt.sign(id, SECRECT_KEY)
}

exports.verifyToken = async (req, res, next) => {
    const cookie = req.headers.cookie
    // console.log(cookie)
    if (cookie) {
        const token = cookie.split('=')[1]
        const id = parseInt(jwt.verify(token, SECRECT_KEY))
        req.UserId = id
        next()
    }
    else {
        res.status(401).json({ status: 'unathorized' })
    }
}