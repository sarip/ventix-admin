# Frontend Notification Integration - Pages Router (Next.js 14)

## ✅ Quick Setup untuk Pages Router

### 1. Tambahkan di Navbar Component

NotificationPopup sudah menggunakan Bootstrap classes yang sama dengan template Anda.

Edit file `/src/pages/_components/Navbar.tsx`, tambahkan di bagian `navbar-nav`:

```tsx
import NotificationPopup from '@/components/NotificationPopup';
import { getCookie } from 'cookies-next';
import { useState, useEffect } from 'react';

const Navbar: React.FC = () => {
    const [userId, setUserId] = useState<number | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const id = getCookie('id');
        const key = localStorage.getItem('key');
        
        if (id) setUserId(Number(id));
        if (key) setToken(key);
    }, []);

    return (
        <nav className="layout-navbar navbar navbar-expand-xl align-items-center bg-navbar-theme">
            <div className="container-xxl">
                {/* ... existing navbar items ... */}
                
                <ul className="navbar-nav flex-row align-items-center ms-auto">
                    {/* Notification Bell - sebelum user dropdown */}
                    {userId && token && (
                        <NotificationPopup userId={userId} token={token} />
                    )}
                    
                    {/* User dropdown (yang sudah ada) */}
                    <li className="nav-item navbar-dropdown dropdown-user dropdown">
                        {/* ... */}
                    </li>
                </ul>
            </div>
        </nav>
    );
};
```

### 2. Setup Environment Variables

Buat file `.env.local` di root project:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_WS_URL=http://localhost:3001
```

### 3. Install Dependencies

```bash
npm install socket.io-client axios lucide-react
```

### 4. Restart Development Server

```bash
# Stop npm run dev (Ctrl+C)
npm run dev
```

### 5. Restart WebSocket Server

```bash
cd websocket
node server.js
```

## 🎯 Alternative: Di Halaman Tertentu Saja

Jika Anda ingin notification hanya di halaman tertentu, tambahkan di page component:

```tsx
// src/pages/dashboard/index.tsx
import NotificationPopup from '@/components/NotificationPopup';
import { getCookie } from 'cookies-next';
import { useState, useEffect } from 'react';

export default function Dashboard() {
    const [userId, setUserId] = useState<number | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const id = getCookie('id');
        const key = localStorage.getItem('key');
        
        if (id) setUserId(Number(id));
        if (key) setToken(key);
    }, []);

    return (
        <div className="dashboard">
            {/* Notification Bell di pojok kanan */}
            <div className="fixed top-4 right-4 z-50">
                {userId && token && (
                    <NotificationPopup userId={userId} token={token} />
                )}
            </div>

            {/* Dashboard content */}
            <h1>Dashboard</h1>
        </div>
    );
}
```

## 📱 Component Features

### Real-time Toast Notifications
- Auto popup saat notifikasi baru
- Auto dismiss dalam 5 detik
- Sound notification (optional)
- Smooth animations

### Notification Bell Icon
- Badge dengan unread count
- Green dot untuk WebSocket connected
- Pulse animation saat ada unread

### Dropdown Panel
- Scrollable list (max 500px)
- Grouped by read/unread
- Color-coded by urgency
- Icons per notification type:
  - 🔧 Preventive Maintenance
  - 📋 Work Orders
  - 🎫 Tickets
  - 📦 Inventory
  - 💼 Vendor/Contract
  - ⚠️ SLA/Escalation
  - 🚨 Incidents

### Actions
- Mark single as read
- Mark all as read
- Delete notification
- Auto-refresh on new notification

## 🔧 Customization

### Custom Position di Layout

```tsx
// Pojok kanan atas
<div className="fixed top-4 right-4 z-50">
    <NotificationPopup userId={userId} token={token} />
</div>

// Di navbar flex
<div className="flex items-center gap-4">
    <span>Welcome, {username}</span>
    <NotificationPopup userId={userId} token={token} />
    <button>Logout</button>
</div>
```

### Custom Styling

Komponen menggunakan Tailwind CSS. Edit di `NotificationPopup.tsx`:

```tsx
// Contoh: ubah warna badge
<span className="bg-purple-500 text-white ...">

// Contoh: ubah ukuran dropdown
<div className="w-80 ..."> {/* dari w-96 */}
```

### Disable Sound

Di `NotificationPopup.tsx`, comment out bagian audio:

```tsx
// try {
//     const audio = new Audio('/notification-sound.mp3');
//     audio.play().catch(e => console.log('Audio play failed:', e));
// } catch (e) {
//     // Ignore audio errors
// }
```

## ✅ Testing

### 1. Run Backend

```bash
# Terminal 1: PHP
php spark serve

# Terminal 2: WebSocket
cd websocket && node server.js
```

### 2. Trigger Notification

```bash
# Test PM notification
php spark notify:pm --verbose
```

### 3. Check Browser Console

Seharusnya tampil:
```
Connecting to WebSocket as user: 1
WebSocket connected
Received notification: { type: 'pm:due', ... }
```

### 4. Visual Check

✅ Bell icon tampil di navbar/header  
✅ Badge unread count muncul  
✅ Green dot indicator (connected)  
✅ Toast popup muncul (kanan atas)  
✅ Click bell → dropdown panel muncul  
✅ List notifications tampil  

## 🚨 Troubleshooting

### NotificationPopup tidak muncul
- ✅ Check import path: `@/components/NotificationPopup`
- ✅ Pastikan `userId` dan `token` ada
- ✅ Check console untuk errors

### WebSocket tidak connect
- ✅ Pastikan WebSocket server running: `node websocket/server.js`
- ✅ Check `.env.local` - `NEXT_PUBLIC_WS_URL`
- ✅ Check browser console untuk connection errors

### Notifications tidak load dari API
- ✅ Check `.env.local` - `NEXT_PUBLIC_API_URL`
- ✅ Verify token valid: `localStorage.getItem('key')`
- ✅ Check Network tab di DevTools

### Toast tidak muncul
- ✅ WebSocket harus connected (check green dot)
- ✅ Run worker: `php spark notify:pm`
- ✅ Check browser console untuk event logs

## 📦 File Structure

```
src/
├── components/
│   ├── NotificationPopup.tsx       ← Main component
│   └── NOTIFICATION_USAGE.md       ← This file
├── hooks/
│   ├── useNotifications.ts         ← API hooks
│   └── useRealtimeNotification.ts  ← WebSocket hooks
├── types/
│   └── notification.ts             ← TypeScript types
└── pages/
    ├── _app.tsx                    ← App entry
    └── _components/
        └── Layout.tsx              ← Add NotificationPopup here
```

## 🚀 Production Ready

Setelah testing berhasil:

1. **Update production URLs** di `.env.production`:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
NEXT_PUBLIC_WS_URL=https://ws.yourdomain.com
```

2. **Setup WebSocket dengan PM2**:
```bash
pm2 start websocket/server.js --name "bfm-websocket"
pm2 startup
pm2 save
```

3. **Setup Nginx** untuk WebSocket proxy:
```nginx
location /socket.io/ {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

## 📊 Component Props

```tsx
interface NotificationPopupProps {
    userId: number | null;  // User ID dari session/cookies
    token: string | null;   // JWT token untuk API calls
}
```

## 🎨 Customization Examples

### Change Toast Position
```tsx
{/* Toast Notification (Real-time) */}
{toast && (
    <div className="fixed top-4 left-4 z-50"> {/* Kiri atas */}
    {/* atau bottom-4 right-4 untuk kanan bawah */}
    </div>
)}
```

### Custom Notification Filter
```tsx
const [filter, setFilter] = useState<'all' | 'unread'>('all');

// Di dropdown header
<select onChange={(e) => setFilter(e.target.value)}>
    <option value="all">Semua</option>
    <option value="unread">Belum dibaca</option>
</select>
```

### Add Notification Sound File
Letakkan file MP3 di `public/notification-sound.mp3`, atau download free sounds dari:
- https://notificationsounds.com/
- https://mixkit.co/free-sound-effects/notification/

---

**Semua sudah ready! Tinggal tambahkan `<NotificationPopup />` di Layout.tsx Anda** 🎉
