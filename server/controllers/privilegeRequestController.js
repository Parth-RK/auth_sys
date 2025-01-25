// controllers/privilegeRequestController.js
import PrivilegeRequest from '../models/PrivilegeRequest';
import User from '../models/User';
import { sendNotification } from '../utils/notifications';

export const createPrivilegeRequest = async (req, res) => {
  try {
    const { privileges, reason, duration } = req.body;
    const userId = req.user.id;

    const request = new PrivilegeRequest({
      userId,
      requestedPrivileges: privileges,
      reason,
      expiresAt: duration ? new Date(Date.now() + duration) : null
    });

    await request.save();

    // Notify admins
    const admins = await User.find({ role: { $in: ['admin', 'superadmin'] } });
    admins.forEach(admin => {
      sendNotification(admin.id, 'New privilege request', 
        `User ${req.user.name} has requested new privileges`);
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reviewPrivilegeRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, notes } = req.body;
    
    const request = await PrivilegeRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = status;
    request.reviewedBy = req.user.id;
    request.reviewNotes = notes;
    request.reviewedAt = new Date();

    if (status === 'approved') {
      const user = await User.findById(request.userId);
      user.temporaryPrivileges.push({
        privileges: request.requestedPrivileges,
        expiresAt: request.expiresAt
      });
      await user.save();
    }

    await request.save();

    // Notify the requesting user
    sendNotification(request.userId, 'Privilege request updated',
      `Your privilege request has been ${status}`);

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};