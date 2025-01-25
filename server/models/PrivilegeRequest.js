// models/PrivilegeRequest.js
import mongoose from 'mongoose';

const PrivilegeRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestedPrivileges: [{
    type: String,
    required: true
  }],
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewNotes: String,
  requestedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: Date,
  expiresAt: Date
});

export default mongoose.model('PrivilegeRequest', PrivilegeRequestSchema);
