export const createDynamicNotification = async (userId, message, context = {}) => {
    return await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        message,
        notificationType: 'dynamic',
        context
      })
    });
  };
  
  export const createStaticNotification = async (userId, notificationKey) => {
    const staticNotification = STATIC_NOTIFICATIONS[notificationKey];
    return await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        ...staticNotification,
        notificationType: 'static'
      })
    });
  };