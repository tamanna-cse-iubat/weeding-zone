// Notification Service for Real-time Dashboard Updates

export const notificationService = {
  // Store notifications in localStorage
  addNotification: (notification) => {
    const key = `notifications_${notification.recipient || 'admin'}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const newNotif = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification,
    };
    const updated = [newNotif, ...existing].slice(0, 100); // Keep last 100
    localStorage.setItem(key, JSON.stringify(updated));
    return newNotif;
  },

  // Get all notifications for user
  getNotifications: (recipient = 'admin') => {
    const key = `notifications_${recipient}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  },

  // Mark notification as read
  markAsRead: (notifId, recipient = 'admin') => {
    const key = `notifications_${recipient}`;
    const notifications = JSON.parse(localStorage.getItem(key) || '[]');
    const updated = notifications.map(n =>
      n.id === notifId ? { ...n, read: true } : n
    );
    localStorage.setItem(key, JSON.stringify(updated));
  },

  // Clear all notifications
  clearNotifications: (recipient = 'admin') => {
    const key = `notifications_${recipient}`;
    localStorage.removeItem(key);
  },

  // Get unread count
  getUnreadCount: (recipient = 'admin') => {
    const notifications = notificationService.getNotifications(recipient);
    return notifications.filter(n => !n.read).length;
  },

  // Create order notification for admin
  notifyAdminNewOrder: (order) => {
    return notificationService.addNotification({
      type: 'order_created',
      recipient: 'admin',
      title: 'New Order Received',
      message: `Order ${order.orderId} from ${order.customerName || order.customerEmail}`,
      orderId: order.orderId,
      orderData: order,
      icon: '📦',
      actionUrl: '/admin/orders',
    });
  },

  // Create order status change notification for customer
  notifyCustomerOrderStatus: (order, customerEmail) => {
    return notificationService.addNotification({
      type: 'order_status_changed',
      recipient: customerEmail,
      title: 'Order Status Updated',
      message: `Your order ${order.orderId} is now ${order.status}`,
      orderId: order.orderId,
      status: order.status,
      icon: '🔄',
      actionUrl: '/customer-dashboard',
    });
  },

  // Create payment notification
  notifyAdminPayment: (order) => {
    return notificationService.addNotification({
      type: 'payment_received',
      recipient: 'admin',
      title: 'Payment Received',
      message: `৳${order.totalAmount} from ${order.customerName || order.customerEmail}`,
      orderId: order.orderId,
      amount: order.totalAmount,
      icon: '💳',
      actionUrl: '/admin/orders',
    });
  },

  // Create inventory notification
  notifyAdminLowStock: (product) => {
    return notificationService.addNotification({
      type: 'low_stock',
      recipient: 'admin',
      title: 'Low Stock Alert',
      message: `${product.name} is running low (${product.stock} left)`,
      productId: product.id,
      product: product,
      icon: '⚠️',
      actionUrl: '/admin/inventory',
    });
  },

  // Create profile notification
  notifyProfileUpdate: (email) => {
    return notificationService.addNotification({
      type: 'profile_updated',
      recipient: email,
      title: 'Profile Updated',
      message: 'Your profile has been successfully updated',
      icon: '✓',
      actionUrl: '/customer-dashboard',
    });
  },

  // System notifications
  notifySystemMessage: (message, type = 'info', recipient = 'admin') => {
    return notificationService.addNotification({
      type: 'system_message',
      recipient,
      title: 'System Notification',
      message,
      messageType: type,
      icon: type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️',
    });
  },
};

// Helper to format notification display
export const formatNotification = (notif) => {
  const iconMap = {
    order_created: '📦',
    order_status_changed: '🔄',
    payment_received: '💳',
    low_stock: '⚠️',
    profile_updated: '✓',
    system_message: 'ℹ️',
  };

  const statusColorMap = {
    Pending: '🟡',
    Confirmed: '🔵',
    Shipped: '🟣',
    Delivered: '🟢',
    Cancelled: '🔴',
  };

  return {
    ...notif,
    displayIcon: notif.icon || iconMap[notif.type] || 'ℹ️',
    statusIcon: statusColorMap[notif.status] || '',
    displayTime: formatTime(notif.timestamp),
  };
};

const formatTime = (isoString) => {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};
