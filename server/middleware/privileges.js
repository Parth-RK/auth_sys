// middleware/privileges.js
import { rolePrivileges } from '../config/rolePrivileges';
import { APIError } from './errorHandler';

// Helper to get all privileges for a role including inherited ones
const getAllPrivilegesForRole = (role) => {
  const privileges = new Set();
  const roles = Object.keys(rolePrivileges);
  const roleLevel = rolePrivileges[role].level;

  // Add privileges from all lower-level roles
  roles.forEach(r => {
    if (rolePrivileges[r].level <= roleLevel) {
      rolePrivileges[r].privileges.forEach(p => privileges.add(p));
    }
  });

  return Array.from(privileges);
};

// Middleware to check if user has required privileges
export const checkPrivilege = (requiredPrivilege) => {
  return async (req, res, next) => {
    try {
      const userPrivileges = getAllPrivilegesForRole(req.user.role);
      
      if (!userPrivileges.includes(requiredPrivilege)) {
        throw new APIError('Insufficient privileges', 403);
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Middleware to check if user can modify target user
export const canModifyUser = async (req, res, next) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      throw new APIError('Target user not found', 404);
    }

    const sourceLevel = rolePrivileges[req.user.role].level;
    const targetLevel = rolePrivileges[targetUser.role].level;

    if (sourceLevel <= targetLevel) {
      throw new APIError('Cannot modify users with equal or higher privileges', 403);
    }

    req.targetUser = targetUser;
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to validate privilege assignments
export const validatePrivilegeAssignment = async (req, res, next) => {
  try {
    const { targetRole, privileges } = req.body;
    
    // Check if source user has permission to grant these privileges
    const sourcePrivileges = getAllPrivilegesForRole(req.user.role);
    const invalidPrivileges = privileges.filter(p => !sourcePrivileges.includes(p));
    
    if (invalidPrivileges.length > 0) {
      throw new APIError(
        `Cannot grant privileges: ${invalidPrivileges.join(', ')}`,
        403
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};