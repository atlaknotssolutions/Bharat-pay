const Notification = require("../models/NotificationModel");

const createNotification = async ({
  recipient,
  actor,
  type,
  video = null,
  channel = null,
}) => {
  try {
    if (!recipient || !actor || String(recipient) === String(actor)) return null;

    const notification = await Notification.create({
      recipient,
      actor,
      type,
      video,
      channel,
    });

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
};

const createBulkNotifications = async ({
  recipients,
  actor,
  type,
  video = null,
  channel = null,
}) => {
  try {
    const docs = recipients
      .filter((recipient) => recipient && String(recipient) !== String(actor))
      .map((recipient) => ({
        recipient,
        actor,
        type,
        video,
        channel,
      }));

    if (!docs.length) return [];

    return await Notification.insertMany(docs);
  } catch (error) {
    console.error("Error creating bulk notifications:", error);
    return [];
  }
};

module.exports = { createNotification, createBulkNotifications };
