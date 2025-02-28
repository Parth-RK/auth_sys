// Utility to test the role hierarchy logic

// Define the role hierarchy from User model
const roleHierarchy = {
  'superadmin': 4,
  'admin': 3,
  'manager': 2,
  'user': 1
};

// Function to check if a user role has access to a required role
function hasRoleAccess(userRole, requiredRole) {
  const userRoleValue = roleHierarchy[userRole.toLowerCase()] || 0;
  const requiredRoleValue = roleHierarchy[requiredRole.toLowerCase()] || 999;
  
  return userRoleValue >= requiredRoleValue;
}

// Test cases
console.log('=== Role Hierarchy Access Tests ===');
console.log('superadmin -> admin:', hasRoleAccess('superadmin', 'admin'));  // Should be true
console.log('superadmin -> superadmin:', hasRoleAccess('superadmin', 'superadmin'));  // Should be true
console.log('admin -> superadmin:', hasRoleAccess('admin', 'superadmin'));  // Should be false
console.log('admin -> admin:', hasRoleAccess('admin', 'admin'));  // Should be true
console.log('admin -> manager:', hasRoleAccess('admin', 'manager'));  // Should be true
console.log('manager -> admin:', hasRoleAccess('manager', 'admin'));  // Should be false
console.log('user -> any role:', hasRoleAccess('user', 'admin'));  // Should be false

// Test with array of roles
function hasAccessToAnyRole(userRole, requiredRoles) {
  const userRoleValue = roleHierarchy[userRole.toLowerCase()] || 0;
  const minRequiredRoleValue = Math.min(...requiredRoles.map(role => 
    roleHierarchy[role.toLowerCase()] || 999
  ));
  
  return userRoleValue >= minRequiredRoleValue;
}

console.log('\n=== Multiple Roles Tests ===');
console.log('superadmin -> [admin, manager]:', hasAccessToAnyRole('superadmin', ['admin', 'manager']));  // Should be true
console.log('admin -> [manager, user]:', hasAccessToAnyRole('admin', ['manager', 'user']));  // Should be true
console.log('manager -> [admin, superadmin]:', hasAccessToAnyRole('manager', ['admin', 'superadmin']));  // Should be false
console.log('user -> [admin, manager]:', hasAccessToAnyRole('user', ['admin', 'manager']));  // Should be false
