const SESSION_KEY = 'portal_auth_v3';
async function serverLogin(username, password) {
  try {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (!res.ok) {
      return { ok: false, error: data.error || 'Login gagal.' };
    }

    // Simpan token + info user ke sessionStorage
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      token: data.token,
      expiresAt: data.expiresAt,
      username: data.user.username,
      displayName: data.user.displayName,
      role: data.user.role
    }));

    return { ok: true, user: data.user };
  } catch (err) {
    return { ok: false, error: 'Koneksi ke server gagal. Coba lagi.' };
  }
}

/**
 * Ambil sesi aktif dari sessionStorage (tanpa server call).
 * @returns {object|null}
 */
function getSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (Date.now() > session.expiresAt) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch { return null; }
}

/**
 * Ambil token Bearer untuk dipakai di API call.
 * @returns {string|null}
 */
function getToken() {
  const session = getSession();
  return session ? session.token : null;
}

/**
 * Hapus sesi (logout).
 */
function destroySession() {
  sessionStorage.removeItem(SESSION_KEY);
}

/**
 * Guard: redirect ke login jika belum auth.
 * Juga verifikasi token ke server (async).
 * @returns {object|null} session jika valid
 */
async function requireAuth() {
  const session = getSession();
  if (!session) {
    sessionStorage.setItem('portal_redirect', window.location.pathname);
    window.location.replace('login.html');
    return null;
  }

  // Verifikasi token ke server (opsional tapi lebih aman)
  try {
    const res = await fetch('/api/auth', {
      headers: { Authorization: `Bearer ${session.token}` }
    });
    if (!res.ok) {
      destroySession();
      window.location.replace('login.html');
      return null;
    }
  } catch {
    // Jika offline, gunakan sesi lokal saja
  }

  return session;
}


async function authFetch(url, options = {}) {
  const token = getToken();
  if (!token) throw new Error('Tidak ada token. Silakan login ulang.');
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`
    }
  });
}

// Expose ke global (dipakai oleh admin pages)
window.serverLogin  = serverLogin;
window.getSession   = getSession;
window.getToken     = getToken;
window.destroySession = destroySession;
window.requireAuth  = requireAuth;
window.authFetch    = authFetch;
