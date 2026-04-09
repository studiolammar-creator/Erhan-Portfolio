/**
 * Erhan Lammar Portfolio — main.js
 * Minimal vanilla JS: hero animation + scroll reveals + active nav + year
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Year ── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Hero fade-in ── */
  function initHero() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    if (prefersReducedMotion) {
      hero.classList.add('hero--loaded');
      return;
    }

    // Small rAF delay to ensure paint before animation starts
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        hero.classList.add('hero--loaded');
      });
    });
  }

  /* ── Scroll reveals (IntersectionObserver) ── */
  function initReveal() {
    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal').forEach(el => {
        el.classList.add('is-visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  /* ── Active nav link on scroll ── */
  function initActiveNav() {
    const links = document.querySelectorAll('.nav__link');
    const sections = document.querySelectorAll('main section[id]');

    if (!links.length || !sections.length) return;

    const setActive = (id) => {
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${id}`) {
          link.classList.add('nav__link--active');
          link.setAttribute('aria-current', 'true');
        } else {
          link.classList.remove('nav__link--active');
          link.removeAttribute('aria-current');
        }
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach(section => observer.observe(section));
  }

  /* ── Smooth scroll for nav links (keyboard-safe) ── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'instant' : 'smooth' });
        // Move focus to target for keyboard / AT users
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      });
    });
  }

  /* ── Mobile nav toggle ── */
  function initMobileNav() {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    if (!toggle || !menu) return;

    function openMenu() {
      menu.dataset.open = 'true';
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close navigation');
    }

    function closeMenu() {
      menu.dataset.open = 'false';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
    }

    toggle.addEventListener('click', () => {
      toggle.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
    });

    // Close when a nav link is clicked
    menu.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        toggle.focus();
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (
        toggle.getAttribute('aria-expanded') === 'true' &&
        !toggle.closest('.nav').contains(e.target)
      ) {
        closeMenu();
      }
    });
  }

  /* ── Theme toggle ── */
  function initThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    function getTheme() {
      const stored = localStorage.getItem('theme');
      if (stored) return stored;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }

    applyTheme(getTheme());

    btn.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      applyTheme(next);
    });
  }

  /* ── Figma file collapsibles ── */
  function initFigmaCollapsibles() {
    document.querySelectorAll('.cs-figma-file__toggle').forEach(toggle => {
      toggle.addEventListener('click', () => {
        const file = toggle.closest('.cs-figma-file');
        const embed = file.querySelector('.cs-figma-embed');
        const isOpen = file.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', isOpen);
        if (isOpen) {
          embed.removeAttribute('hidden');
        } else {
          embed.setAttribute('hidden', '');
        }
      });
    });
  }

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', () => {
    initHero();
    initReveal();
    initActiveNav();
    initSmoothScroll();
    initThemeToggle();
    initMobileNav();
    initFigmaCollapsibles();
  });

})();
