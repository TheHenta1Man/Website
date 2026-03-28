/* =============================================
   croco.stitches — script.js
   Interactive: follow toggle, counters, modals
   ============================================= */

// ── STATE ──────────────────────────────────────
const state = {
  following: true,        // starts as "following"
  followers: 800,
  posts: 118,
  following_count: 112,
};

// ── ELEMENTS ───────────────────────────────────
const followBtn        = document.getElementById('followBtn');
const followLabel      = document.getElementById('followLabel');
const followersEl      = document.getElementById('followersCount');
const followingCountEl = document.getElementById('followingCount');
const postsCountEl     = document.getElementById('postsCount');
const menuBtn          = document.getElementById('menuBtn');
const dropdown         = document.getElementById('dropdown');
const toast            = document.getElementById('toast');
const modalOverlay     = document.getElementById('modalOverlay');

// ── FOLLOW TOGGLE ──────────────────────────────
function toggleFollow() {
  state.following = !state.following;

  if (state.following) {
    // Just followed
    state.followers += 1;
    followLabel.textContent = 'following';
    followBtn.classList.remove('not-following');
    showToast('You followed croco.stitches 🐸');
  } else {
    // Unfollowed
    state.followers -= 1;
    followLabel.textContent = 'follow';
    followBtn.classList.add('not-following');
    showToast('Unfollowed croco.stitches');
  }

  animateStat(followersEl, state.followers);
}

// ── ANIMATED STAT UPDATE ───────────────────────
function animateStat(el, targetValue) {
  const start = parseInt(el.textContent.replace(/,/g, ''), 10);
  const end   = targetValue;
  const diff  = end - start;
  const duration = 600;
  const startTime = performance.now();

  function tick(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.round(start + diff * eased);
    el.textContent = current.toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);

  // Pop animation
  el.classList.remove('pop');
  void el.offsetWidth; // reflow
  el.classList.add('pop');
  el.addEventListener('animationend', () => el.classList.remove('pop'), { once: true });
}

// ── TOAST ──────────────────────────────────────
let toastTimeout;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ── DROPDOWN MENU ──────────────────────────────
menuBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  dropdown.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', dropdown.classList.contains('open'));
});

document.addEventListener('click', () => {
  dropdown.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
});

dropdown.addEventListener('click', (e) => e.stopPropagation());

// ── COPY USERNAME ──────────────────────────────
function copyUsername() {
  navigator.clipboard.writeText('@croco.stitches').then(() => {
    showToast('Username copied! 📋');
  }).catch(() => {
    showToast('@croco.stitches');
  });
  dropdown.classList.remove('open');
}

// ── SHARE ──────────────────────────────────────
function shareProfile() {
  const shareData = {
    title: 'croco.stitches',
    text: 'yarn gremlin with a hook 🧶 — check out croco.stitches!',
    url: 'https://crocostitches.carrd.co/?utm_source=ig&utm_medium=social&utm_content=link_in_bio',
  };
  if (navigator.share) {
    navigator.share(shareData).catch(() => {});
  } else {
    navigator.clipboard.writeText(shareData.url).then(() => {
      showToast('Link copied to clipboard! 🔗');
    });
  }
  dropdown.classList.remove('open');
}

// ── MESSAGE MODAL ──────────────────────────────
function openMessage() {
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('msgText').focus(), 350);
}

function closeMessage() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

function sendMessage() {
  const txt = document.getElementById('msgText').value.trim();
  if (!txt) {
    showToast('Write something first! ✍️');
    return;
  }
  closeMessage();
  document.getElementById('msgText').value = '';
  showToast('Message sent to croco.stitches 💚');
}

// Close modal on overlay click
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeMessage();
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeMessage();
    dropdown.classList.remove('open');
  }
});

// ── STAT CLICK (expand effect) ─────────────────
document.querySelectorAll('.stat').forEach((el) => {
  el.addEventListener('click', function () {
    const numEl = this.querySelector('.stat-num');
    numEl.classList.remove('pop');
    void numEl.offsetWidth;
    numEl.classList.add('pop');
    numEl.addEventListener('animationend', () => numEl.classList.remove('pop'), { once: true });
    const label = this.querySelector('.stat-label').textContent;
    showToast(`${numEl.textContent} ${label} 🐸`);
  });
});

// ── INITIAL RENDER ─────────────────────────────
(function init() {
  // Set follow button correct initial state (following = true)
  followBtn.classList.remove('not-following');
  followLabel.textContent = 'following';

  // Animate stats in on load with a stagger
  const nums = [
    { el: postsCountEl,     target: state.posts },
    { el: followersEl,      target: state.followers },
    { el: followingCountEl, target: state.following_count },
  ];

  nums.forEach(({ el, target }, i) => {
    el.textContent = '0';
    setTimeout(() => animateStat(el, target), 400 + i * 180);
  });
})();
