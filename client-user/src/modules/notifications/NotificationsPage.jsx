import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useLanguage } from '../../context/LanguageContext';
import './notifications.css';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isKhmer = language === 'km';

  // Active Tab: 'broadcasts' (សារជូនដំណឹង) | 'activities' (ប្រតិបត្តិការ)
  const [activeTab, setActiveTab] = useState('broadcasts');

  // Currently empty as requested
  const announcementGroups = [];
  const activityGroups = [];

  return (
    <div className="notifications-page-container">
      {/* ── Top Header with Back Arrow ── */}
      <div className="notif-top-bar">
        <button
          type="button"
          className="notif-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Back"
          title={isKhmer ? 'ត្រឡប់ក្រោយ' : 'Go back'}
        >
          <Icon icon="lucide:arrow-left" width={24} />
        </button>

        <h1 className="notif-page-title">
          {isKhmer ? 'ដំណឹង' : 'Notifications'}
        </h1>

        <div className="notif-bar-placeholder" />
      </div>

      {/* ── Segment Switcher (Pill Style) ── */}
      <div className="notif-tab-pills">
        <button
          type="button"
          className={`notif-pill-btn ${activeTab === 'activities' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('activities')}
        >
          {isKhmer ? 'ប្រតិបត្តិការ' : 'Activities'}
        </button>

        <button
          type="button"
          className={`notif-pill-btn ${activeTab === 'broadcasts' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('broadcasts')}
        >
          {isKhmer ? 'សារជូនដំណឹង' : 'Announcements'}
        </button>
      </div>

      {/* ── Tab Content: Broadcasts / Announcements (សារជូនដំណឹង) ── */}
      {activeTab === 'broadcasts' && (
        <div className="notif-tab-content">
          {announcementGroups.length > 0 ? (
            announcementGroups.map((group) => (
              <div key={group.date} className="notif-date-group">
                <div className="notif-date-header">{group.date}</div>
                <div className="notif-cards-list">
                  {group.items.map((item) => (
                    <div key={item.id} className="notif-card">
                      <div className="notif-card-body">
                        <div className="notif-title-row">
                          <h3 className="notif-card-title">{item.title}</h3>
                          <span className="notif-card-time">{item.time}</span>
                        </div>
                        <p className="notif-card-desc">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            /* Empty State for Announcements */
            <div className="notif-empty-state">
              <div className="notif-empty-icon">
                <Icon icon="lucide:bell-off" width={38} />
              </div>
              <div className="notif-empty-title">
                {isKhmer ? 'មិនទាន់មានដំណឹងនៅឡើយទេ' : 'No Notifications Yet'}
              </div>
              <p className="notif-empty-sub">
                {isKhmer
                  ? 'ព័ត៌មានថ្មីៗ ឬសារជូនដំណឹងពីប្រព័ន្ធ នឹងបង្ហាញនៅទីនេះ។'
                  : 'New updates and system announcements will appear here.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Tab Content: Activities (ប្រតិបត្តិការ) ── */}
      {activeTab === 'activities' && (
        <div className="notif-tab-content">
          {activityGroups.length > 0 ? (
            activityGroups.map((group) => (
              <div key={group.date} className="notif-date-group">
                <div className="notif-date-header">{group.date}</div>
                <div className="notif-cards-list">
                  {group.items.map((item) => (
                    <div key={item.id} className="notif-activity-card">
                      <div className="notif-activity-info">
                        <h4 className="notif-activity-title">{item.title}</h4>
                        <p className="notif-activity-desc">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            /* Empty State for Activities */
            <div className="notif-empty-state">
              <div className="notif-empty-icon">
                <Icon icon="lucide:inbox" width={38} />
              </div>
              <div className="notif-empty-title">
                {isKhmer ? 'មិនទាន់មានប្រតិបត្តិការនៅឡើយទេ' : 'No Activities Yet'}
              </div>
              <p className="notif-empty-sub">
                {isKhmer
                  ? 'រាល់សកម្មភាពសិក្សា និងការឈ្នះពានរង្វាន់របស់អ្នក នឹងកត់ត្រានៅទីនេះ។'
                  : 'Your learning achievements and daily study milestones will appear here.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
