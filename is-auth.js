const { decode } = require('jsonwebtoken');
const jwt = require('jsonwebtoken');

const isAuth = (req, res, next) => {
    //Getting authorization field from the incoming request
    const authHeader = req.get('Authorization');
    //If there is no authorization field - we create it (not overwriting) - name it isAuth
    if (!authHeader) {
        req.isAuth = false;
        return next(); // leaving with metadata added 
    }
    // If the first part is passed we should check the token
    const token = authHeader.split(' ')[1];
    //If we didn't get a token -->  isAuth field is set to false
    if (!token || token === '') {
        req.isAuth = false;
        return next();
    }
    // If we get a token we should verify it
    let decodedToken;
    try {
        //It will be returned only if it is valid
        decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
        req.isAuth = false;
        return next();
    }

    if (!decodedToken) {
        req.isAuth = false;
        return next();
    }
    //Finally we can set isAuth field to true 
    req.isAuth = true;
    // We can use decoded token to get info from it - to store user_id field in request user_id field
    req.user_id = decodedToken.user_id; 
    next();

}

module.exports = isAuth;