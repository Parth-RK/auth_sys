// models/Privilege.js
import mongoose from 'mongoose';

const PrivilegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  level: {
    type: Number,
    required: true
  },
  actions: [{
    type: String,
    enum: [
      // User Management
      'user.view',
      'user.create',
      'user.edit',
      'user.delete',
      'user.manage_roles',
      // Content Management
      'content.view',
      'content.create',
      'content.edit',
      'content.delete',
      'content.publish',
      // System Management
      'system.view_logs',
      'system.manage_settings',
      'system.manage_backups',
      // Security Management
      'security.view_logs',
      'security.manage_permissions',
      'security.grant_privileges',
      // API Access
      'api.read',
      'api.write',
      'api.admin'
    ]
  }]
});

export default mongoose.model('Privilege', PrivilegeSchema);

// config/rolePrivileges.js
export const rolePrivileges = {
  user: {
    level: 1,
    privileges: [
      'content.view',
      'api.read'
    ]
  },
  manager: {
    level: 2,
    privileges: [
      // Inherits user privileges +
      'user.view',
      'content.create',
      'content.edit',
      'content.publish',
      'api.write'
    ]
  },
  admin: {
    level: 3,
    privileges: [
      // Inherits manager privileges +
      'user.create',
      'user.edit',
      'user.delete',
      'content.delete',
      'system.view_logs',
      'system.manage_settings',
      'security.view_logs'
    ]
  },
  superadmin: {
    level: 4,
    privileges: [
      // Inherits admin privileges +
      'user.manage_roles',
      'system.manage_backups',
      'security.manage_permissions',
      'security.grant_privileges',
      'api.admin'
    ]
  }
};