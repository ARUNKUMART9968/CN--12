/**
 * Shared Navigation - Injects sidebar and sets up common functionality
 */

const Nav = {
  init(activePage) {
    if (!requireAuth()) return;
    const user = getUser();
    if (!user) return;

    const isAlumni = user.role === 'alumni';

    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    const commonNav = `
      <a href="dashboard.html" class="nav-item ${activePage === 'dashboard' ? 'active' : ''}" data-page="dashboard">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
        </svg>
        Dashboard
      </a>
      <a href="profile.html" class="nav-item ${activePage === 'profile' ? 'active' : ''}" data-page="profile">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        My Profile
      </a>
    `;

    const studentNav = `
      <a href="matches.html" class="nav-item ${activePage === 'matches' ? 'active' : ''}" data-page="matches">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        AI Matches
      </a>
      <a href="jobs.html" class="nav-item ${activePage === 'jobs' ? 'active' : ''}" data-page="jobs">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
        </svg>
        Job Board
      </a>
    `;

    const alumniNav = `
      <a href="students.html" class="nav-item ${activePage === 'students' ? 'active' : ''}" data-page="students">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        Browse Students
      </a>
      <a href="jobs.html" class="nav-item ${activePage === 'jobs' ? 'active' : ''}" data-page="jobs">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
        </svg>
        Post Jobs
      </a>
    `;

    sidebar.innerHTML = `
      <div class="sidebar-logo">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
        </div>
        <span class="logo-text">Campus<span>Connect</span></span>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section-label">Main</div>
        ${commonNav}
        ${isAlumni ? alumniNav : studentNav}

        <div class="nav-section-label" style="margin-top:8px;">Social</div>
        <a href="connections.html" class="nav-item ${activePage === 'connections' ? 'active' : ''}" id="connectionsNav">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
          </svg>
          Connections
          <span class="nav-badge" id="pendingBadge" style="display:none">0</span>
        </a>
        <a href="chat.html" class="nav-item ${activePage === 'chat' ? 'active' : ''}">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          Messages
          <span class="nav-badge" id="unreadBadge" style="display:none">0</span>
        </a>
      </nav>

      <div class="sidebar-bottom">
        <div class="user-card" onclick="window.location.href='profile.html'">
          <div class="avatar" id="navAvatar">${Helpers.initials(user.name)}</div>
          <div class="user-info">
            <div class="user-name">${user.name}</div>
            <div class="user-role">${user.role === 'alumni' ? 'Alumni' : 'Student'}</div>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm w-full mt-8" onclick="Nav.logout()">
          <svg style="width:14px;height:14px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign Out
        </button>
      </div>
    `;

    // Load badges
    this.loadBadges();
  },

  async loadBadges() {
    try {
      const [pending, unread] = await Promise.all([
        api.getPendingConnections().catch(() => ({ pending: [] })),
        api.getUnreadCount().catch(() => ({ unreadCount: 0 }))
      ]);

      const pendingCount = (pending.pending || []).length;
      const unreadCount = unread.unreadCount || 0;

      const pendingBadge = document.getElementById('pendingBadge');
      const unreadBadge = document.getElementById('unreadBadge');

      if (pendingBadge && pendingCount > 0) {
        pendingBadge.textContent = pendingCount;
        pendingBadge.style.display = 'inline';
      }

      if (unreadBadge && unreadCount > 0) {
        unreadBadge.textContent = unreadCount;
        unreadBadge.style.display = 'inline';
      }
    } catch {}
  },

  logout() {
    if (confirm('Sign out of CareerNexus?')) {
      clearAuth();
      window.location.href = 'login.html';
    }
  }
};