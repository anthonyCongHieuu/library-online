const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    console.log('Full Request Headers:', req.headers);

    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      console.log('No Authorization Header');
      return res.status(401).json({ 
        message: 'Không có token',
        details: 'Authorization header is missing' 
      });
    }

    const tokenParts = authHeader.split(' ');
    
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      console.log('Invalid Token Format');
      return res.status(401).json({ 
        message: 'Định dạng token không hợp lệ',
        details: 'Token must be in "Bearer <token>" format' 
      });
    }

    const token = tokenParts[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('Authentication Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Token không hợp lệ',
        error: error.message 
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token đã hết hạn',
        error: error.message 
      });
    }

    return res.status(401).json({ 
      message: 'Xác thực không thành công',
      error: error.message 
    });
  }
};