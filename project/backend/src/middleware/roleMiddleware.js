// src/middleware/roleMiddleware.js
module.exports = (allowedRoles) => {
    return (req, res, next) => {
      // Kiểm tra người dùng có quyền
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ 
          message: 'Không có quyền truy cập' 
        });
      }
      
      next();
    };
  };