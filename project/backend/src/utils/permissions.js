// src/utils/permissions.js

// Định nghĩa các vai trò
const ROLES = {
    USER: 'user',
    LIBRARIAN: 'librarian', 
    ADMIN: 'admin'
  };
  
  // Định nghĩa các quyền cho từng vai trò
  const PERMISSIONS = {
    [ROLES.USER]: [
      'view_books',
      'borrow_books'
    ],
    [ROLES.LIBRARIAN]: [
      'view_books',
      'manage_books',
      'manage_borrows',
      'view_users'
    ],
    [ROLES.ADMIN]: [
      'full_access',
      'manage_users',
      'system_config'
    ]
  };
  
  // Hàm lấy quyền theo vai trò
  function getRolePermissions(role) {
    return PERMISSIONS[role] || [];
  }
  
  // Hàm kiểm tra quyền
  function checkPermission(userRole, requiredPermission) {
    const rolePermissions = PERMISSIONS[userRole] || [];
    return rolePermissions.includes(requiredPermission) || 
           rolePermissions.includes('full_access');
  }
  
  module.exports = {
    ROLES,
    PERMISSIONS,
    getRolePermissions,
    checkPermission
  };