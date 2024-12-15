// src/middleware/permissionMiddleware.js
const { checkPermission } = require('../utils/permissions');

const requirePermission = (requiredPermission) => {
  return (req, res, next) => {
    // Kiểm tra xác thực
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Chưa xác thực' 
      });
    }

    // Kiểm tra quyền
    if (!checkPermission(req.user.role, requiredPermission)) {
      // Ghi log truy cập trái phép
      logUnauthorizedAccess(req.user, requiredPermission);
      
      return res.status(403).json({ 
        message: 'Không đủ quyền truy cập',
        requiredPermission 
      });
    }

    next();
  };
};

// Hàm ghi log truy cập trái phép
const logUnauthorizedAccess = (user, permission) => {
  console.log(`Unauthorized Access Attempt:
    User: ${user.email}
    Role: ${user.role}
    Required Permission: ${permission}
    Timestamp: ${new Date().toISOString()}
  `);
};

module.exports = {
  requirePermission
};