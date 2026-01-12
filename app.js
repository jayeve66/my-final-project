// ---------------------------
// app.js (Auth + Firestore + UI)
// ---------------------------

const ADMIN_EMAIL = "hauwahudsufyan@gmail.com"; 

// Elements
const signupForm = document.getElementById('signupForm');
const loginForm  = document.getElementById('loginForm');
const contactForm= document.getElementById('contactForm');
const submissionsList = document.getElementById('submissionsList');
const userEmailEl = document.getElementById('userEmail');
const userAvatar = document.getElementById('userAvatar');
const logoutBtn = document.getElementById('logoutBtn');
const totalSubmissionsEl = document.getElementById('totalSubmissions');
const recentEl = document.getElementById('recent');
const refreshBtn = document.getElementById('refreshBtn');
const clearAllBtn = document.getElementById('clearAllBtn');

// ----------------- Signup -----------------
signupForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = signupForm['email'].value.trim();
  const password = signupForm['password'].value;

  try {
    await auth.createUserWithEmailAndPassword(email, password);
    // Redirect standard users to Home
    window.location.href = 'index.html';
  } catch(err) {
    alert(err.message);
  }
});

// ----------------- Login -----------------
loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = loginForm['email'].value.trim();
  const password = loginForm['password'].value;

  try {
    await auth.signInWithEmailAndPassword(email, password);
    if (email === ADMIN_EMAIL) {
      window.location.href = "dashboard.html";
    } else {
      window.location.href = "index.html"; 
    }
  } catch(err) {
    alert(err.message);
  }
});

// ----------------- Contact Form -----------------
contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = contactForm['name'].value.trim();
  const email = contactForm['email'].value.trim();
  const message = contactForm['message'].value.trim();

  try {
    await db.collection('submissions').add({
      name, email, message,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    alert('Message sent!');
    contactForm.reset();
  } catch (err) {
    alert(err.message);
  }
});

// ----------------- Admin Protection -----------------
let unsubscribeSubmissions = null;

auth.onAuthStateChanged(user => {
  const isDashboard = window.location.pathname.includes('dashboard.html');

  if (isDashboard || submissionsList) {
    if (!user || user.email !== ADMIN_EMAIL) {
      window.location.href = "index.html";
      return;
    }
    if (userEmailEl) userEmailEl.textContent = user.email;
    startRealtime();
  }
});

// ----------------- Logout -----------------
logoutBtn?.addEventListener('click', async () => {
  await auth.signOut();
  window.location.href = 'index.html';
});

// ----------------- Realtime Dashboard -----------------
function startRealtime(){
  if (unsubscribeSubmissions) unsubscribeSubmissions();
  const col = db.collection('submissions').orderBy('createdAt', 'desc');

  unsubscribeSubmissions = col.onSnapshot(snapshot => {
    if (!submissionsList) return;
    submissionsList.innerHTML = '';
    const items = [];
    
    snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() }));

    totalSubmissionsEl && (totalSubmissionsEl.textContent = items.length);
    recentEl && (recentEl.textContent = items[0] ? formatDate(items[0].createdAt) : '—');

    items.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div class="submission-left">
          <div class="avatar">${(item.name||'U').charAt(0).toUpperCase()}</div>
          <div class="submission-content">
            <div class="meta">${escapeHtml(item.name)} • ${escapeHtml(item.email)}</div>
            <div class="msg">${escapeHtml(item.message)}</div>
          </div>
        </div>
        <div class="item-actions">
          <button class="btn btn-danger small delete" data-id="${item.id}">Delete</button>
        </div>
      `;
      li.querySelector('.delete')?.addEventListener('click', () => {
        if(confirm('Delete?')) db.collection('submissions').doc(item.id).delete();
      });
      submissionsList.appendChild(li);
    });
  });
}

function formatDate(ts){
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString();
}

function escapeHtml(str){
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#039;"}[m]));
}