import React, { useState, useRef, useEffect } from 'react';
import { Bell, BellRing, CheckCheck, Trash2, Info, AlertTriangle, AlertCircle, X } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export const NotificationCenter = ({ isMobile }) => {
  const { notifications, markNotifRead, markAllNotifsRead, deleteNotif } = useFinance();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type, severity) => {
    if (type === 'debt') return <AlertCircle size={16} color={severity === 'high' ? '#ef4444' : '#f59e0b'} />;
    if (type === 'expense') return <AlertTriangle size={16} color="#f59e0b" />;
    return <Info size={16} color="#3b82f6" />;
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      {/* Trigger Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          padding: isMobile ? 8 : 10, borderRadius: 12, position: 'relative',
          color: unreadCount > 0 ? 'var(--accent)' : 'var(--text-muted)',
          transition: 'all 0.2s',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface-hover)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        {unreadCount > 0 ? <BellRing size={isMobile ? 20 : 24} /> : <Bell size={isMobile ? 20 : 24} />}
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: isMobile ? 6 : 4, right: isMobile ? 6 : 4,
            minWidth: isMobile ? 16 : 20, height: isMobile ? 16 : 20, borderRadius: 10,
            background: '#ef4444', color: '#fff',
            fontSize: isMobile ? 10 : 11, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid var(--bg-sidebar)',
            padding: '0 4px'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 12px)',
          right: isMobile ? -50 : 0,
          width: isMobile ? 'calc(100vw - 32px)' : 380,
          maxHeight: 520,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'var(--bg-sidebar)'
          }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllNotifsRead}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 600, color: 'var(--accent)',
                  display: 'flex', alignItems: 'center', gap: 4
                }}
              >
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {notifications.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center' }}>
                <Bell size={24} color="var(--text-muted)" style={{ opacity: 0.3, marginBottom: 12 }} />
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>No new notifications</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => markNotifRead(notif.id)}
                  style={{
                    padding: '14px 20px',
                    borderBottom: '1px solid var(--border-light)',
                    cursor: 'pointer',
                    background: notif.read ? 'transparent' : 'var(--accent-light)',
                    transition: 'background 0.2s',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = notif.read ? 'var(--bg-surface-hover)' : 'var(--accent-light)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = notif.read ? 'transparent' : 'var(--accent-light)'}
                >
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ marginTop: 2 }}>{getIcon(notif.type, notif.severity)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                        <p style={{ 
                          fontSize: 13, fontWeight: notif.read ? 600 : 700, 
                          color: 'var(--text-primary)', margin: '0 0 4px',
                          lineHeight: 1.4
                        }}>
                          {notif.title}
                        </p>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteNotif(notif.id); }}
                          style={{ background: 'none', border: 'none', padding: 2, cursor: 'pointer', color: 'var(--text-muted)' }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '0 0 6px', lineHeight: 1.5 }}>
                        {notif.message}
                      </p>
                      <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: 0 }}>
                        {formatDate(notif.time)}
                      </p>
                    </div>
                  </div>
                  {!notif.read && (
                    <div style={{
                      position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
                      width: 4, height: 4, borderRadius: 2, background: 'var(--accent)'
                    }} />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div style={{ padding: '12px 20px', textAlign: 'center', borderTop: '1px solid var(--border)', background: 'var(--bg-sidebar)' }}>
               <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>
                 You have {unreadCount} unread alerts
               </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
