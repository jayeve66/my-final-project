/* =========================================================================
   EventPro - Interactive Script
   =========================================================================
   Features:
   - Sticky / Shrink header on scroll
   - Smooth scroll for nav links
   - Scroll reveal animation (Intersection Observer)
   - Active nav link highlight
   - Auto year update
   - Gentle hover ripple effect
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');
  const yearSpan = document.querySelector('#year');
  const revealEls = document.querySelectorAll('.reveal');
  const body = document.body;

  /* -----------------------------
     🎥 Video Play / Pause Toggle
     ----------------------------- */
  const video = document.querySelector('#weddingVideo');
  const toggleBtn = document.querySelector('#videoToggle');

if (video && toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      toggleBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
      video.pause();
      toggleBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
  });
}

  /* -----------------------------
     1. Sticky + Shrinking Header
     ----------------------------- */
  const handleScroll = () => {
    const scrolled = window.scrollY > 60;
    header.classList.toggle('scrolled', scrolled);
    highlightNav();
  };
  window.addEventListener('scroll', handleScroll);

  /* -----------------------------
     2. Smooth Scroll for Nav Links
     ----------------------------- */
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');

    // Allow normal navigation for external pages
    if (!href.startsWith('#')) return;

    e.preventDefault();

    const target = document.querySelector(href);
    if (!target) return;

    window.scrollTo({
      top: target.offsetTop - 60,
      behavior: 'smooth'
    });
  });
});

  /* -----------------------------
     3. Active Nav Highlight
     ----------------------------- */
  function highlightNav() {
    const scrollY = window.scrollY + window.innerHeight / 3;
    let currentId = '';
    sections.forEach(section => {
      if (scrollY >= section.offsetTop) currentId = section.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  }

  /* -----------------------------
     4. Reveal on Scroll
     ----------------------------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        io.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });

  revealEls.forEach(el => io.observe(el));

  

  /* -----------------------------
     5. Footer Year Auto Update
     ----------------------------- */
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  /* -----------------------------
     6. Button Hover Ripple Effect
     ----------------------------- */
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      btn.style.setProperty('--x', `${x}px`);
      btn.style.setProperty('--y', `${y}px`);
    });
  });

  /* -----------------------------
     7. Gentle Fade-In Body on Load
     ----------------------------- */
  body.classList.add('page-loaded');
});

// booking.js 
const bookingForm = document.querySelector("#bookingForm");
const formStatus = document.querySelector("#formStatus");

if (bookingForm) {
  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = {
      name: bookingForm.name.value,
      email: bookingForm.email.value,
      eventType: bookingForm.eventType.value,
      message: bookingForm.message.value,
    };

    formStatus.textContent = "Sending...";

    try {
      const res = await fetch("http://localhost:5000/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        formStatus.textContent = "✅ Booking sent successfully!";
        bookingForm.reset();
      } else {
        formStatus.textContent = "⚠️ Failed to send booking.";
      }
    } catch (error) {
      formStatus.textContent = "❌ Network error. Try again later.";
    }
  });
}