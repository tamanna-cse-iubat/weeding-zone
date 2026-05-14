export const getNotifications = (userEmail) => {
    const allNotifs = JSON.parse(localStorage.getItem('wz_notifications')) || [];
    if (userEmail === 'tamanna.cse.iubat@gmail.com') {
        return allNotifs.filter(n => n.role === 'admin').sort((a, b) => b.id - a.id);
    } else {
        return allNotifs.filter(n => n.userId === userEmail).sort((a, b) => b.id - a.id);
    }
};

export const addNotification = (notification) => {
    // notification shape: { userId: 'email', role: 'admin'|'customer', title: '...', message: '...', type: '...' }
    const allNotifs = JSON.parse(localStorage.getItem('wz_notifications')) || [];
    const newNotif = {
        id: Date.now().toString(),
        date: new Date().toLocaleString(),
        read: false,
        ...notification
    };
    allNotifs.push(newNotif);
    localStorage.setItem('wz_notifications', JSON.stringify(allNotifs));
};

export const markAsRead = (id) => {
    const allNotifs = JSON.parse(localStorage.getItem('wz_notifications')) || [];
    const updated = allNotifs.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem('wz_notifications', JSON.stringify(updated));
};

export const markAllAsRead = (userEmail) => {
    const allNotifs = JSON.parse(localStorage.getItem('wz_notifications')) || [];
    const updated = allNotifs.map(n => {
        if (userEmail === 'tamanna.cse.iubat@gmail.com' && n.role === 'admin') return { ...n, read: true };
        if (n.userId === userEmail) return { ...n, read: true };
        return n;
    });
    localStorage.setItem('wz_notifications', JSON.stringify(updated));
};
