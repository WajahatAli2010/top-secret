(() => {
  const revealItems = [...document.querySelectorAll('.reveal:not(.visible)')];
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealItems.forEach(el => observer.observe(el));

  const glow = document.getElementById('cursorGlow');
  let mx = innerWidth / 2, my = innerHeight / 2, gx = mx, gy = my;
  addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; });
  const animateGlow = () => {
    gx += (mx - gx) * .12;
    gy += (my - gy) * .12;
    glow.style.left = gx + 'px';
    glow.style.top = gy + 'px';
    requestAnimationFrame(animateGlow);
  };
  animateGlow();

  const modal = document.getElementById('modal');
  const modalText = document.getElementById('modalText');
  document.querySelectorAll('.joke').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.loading) {
        btn.classList.add('loading-active');
        modalText.innerHTML = '<div class="loading-card"><div>Authenticating cousin credentials…</div><div class="loading-bar"><span></span></div><div class="loading-status">Please wait 2.6 seconds</div></div>';
        document.getElementById('modalTitle').textContent = 'Verifying…';
        modal.classList.add('open');
        setTimeout(() => {
          document.getElementById('modalTitle').textContent = 'Verified.';
          modalText.textContent = 'Credentials accepted. Unfortunately, this accomplished absolutely nothing.';
          btn.classList.remove('loading-active');
        }, 2600);
        return;
      }
      if (btn.dataset.question) {
        document.getElementById('modalTitle').textContent = btn.dataset.prompt || 'Questionnaire';
        modal.classList.add('questionnaire-open');
        const options = (btn.dataset.options || 'Obviously me|Definitely not me|The cousin who is asking').split('|');
        modalText.className = 'question-options';
        modalText.innerHTML = options.map(option => '<button class="fake-btn answer-option" type="button" data-wrong="true"></button>').join('');
        modalText.querySelectorAll('[data-wrong]').forEach((option, index) => {
          option.textContent = options[index];
          option.addEventListener('click', () => {
            option.textContent = 'Wrong answer 💀';
            option.disabled = true;
            option.animate([{transform:'translateX(0)'},{transform:'translateX(-5px)'},{transform:'translateX(5px)'},{transform:'translateX(0)'}], {duration:260});
          });
        });
        modal.classList.add('open');
        return;
      }
      modalText.textContent = btn.dataset.joke || 'This button was suspicious from the beginning.';
      modal.classList.add('open');
    });
  });
  document.getElementById('closeModal').addEventListener('click', () => { modal.classList.remove('open', 'questionnaire-open'); modalText.className = ''; });
  modal.addEventListener('click', e => { if (e.target === modal) { modal.classList.remove('open', 'questionnaire-open'); modalText.className = ''; } });
  addEventListener('keydown', e => { if (e.key === 'Escape') { modal.classList.remove('open', 'questionnaire-open'); modalText.className = ''; } });

  const ending = document.getElementById('ending');
  const blackout = document.getElementById('finaleBlackout');
  const finale = document.getElementById('birthdayFinale');
  const devNote = document.getElementById('dev-note');
  const devNoteExit = document.getElementById('devNoteExit');
  const birthdayAudio = document.getElementById('birthdayAudio');
const birthdayScrollReveal = document.getElementById('birthdayScrollReveal');
  const birthdayProgress = document.getElementById('birthdayProgress');
  const birthdayProgressText = document.getElementById('birthdayProgressText');
  let finaleStarted = false;
  const birthdayCatVideo = document.getElementById('birthdayCatVideo');
  const birthdayCatCanvas = document.getElementById('birthdayCatCanvas');
  const birthdayCatCtx = birthdayCatCanvas.getContext('2d', {willReadFrequently:true});
  let birthdayCatFrame = 0;
  let birthdayCatLastPaint = 0;
  let birthdayCatReady = false;

  function paintBirthdayCat() {
    if (!finale.classList.contains('active') || !birthdayCatReady || birthdayCatVideo.paused) return;
    const maxWidth = Math.min(320, Math.round(innerWidth * 0.24));
    const scale = Math.min(1, maxWidth / birthdayCatVideo.videoWidth);
    const w = Math.max(1, Math.round(birthdayCatVideo.videoWidth * scale));
    const h = Math.max(1, Math.round(birthdayCatVideo.videoHeight * scale));
    if (birthdayCatCanvas.width !== w || birthdayCatCanvas.height !== h) {
      birthdayCatCanvas.width = w;
      birthdayCatCanvas.height = h;
    }

    birthdayCatCtx.drawImage(birthdayCatVideo,0,0,w,h);
    const frame = birthdayCatCtx.getImageData(0,0,w,h);
    const px = frame.data;

    for (let i=0;i<px.length;i+=4) {
      const r=px[i], g=px[i+1], b=px[i+2];
      const green=g-Math.max(r,b);
      if (g>70 && green>22) px[i+3]=green>55 ? 0 : Math.max(0,255-green*6);
    }

    birthdayCatCtx.putImageData(frame,0,0);
  }

  function scheduleBirthdayCat() {
    if (!finale.classList.contains('active') || !birthdayCatReady) return;
    const now = performance.now();
    if (now - birthdayCatLastPaint >= 42) {
      birthdayCatLastPaint = now;
      paintBirthdayCat();
    }
    birthdayCatFrame = requestAnimationFrame(scheduleBirthdayCat);
  }

  birthdayCatVideo.addEventListener('loadedmetadata', () => {
    birthdayCatReady = true;
    birthdayCatVideo.muted = true;
  });
  birthdayCatVideo.addEventListener('loadeddata', () => {
    birthdayCatReady = true;
  });
  birthdayCatVideo.addEventListener('error', () => {
    birthdayCatReady = false;
    cancelAnimationFrame(birthdayCatFrame);
  });
  birthdayCatVideo.load();

  let poemPlayed = false;
  let birthdayScrollReady = false;
  let birthdayScrollAmount = 0;
  const birthdayScrollTarget = 2600;
  const poemObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !poemPlayed && entry.intersectionRatio >= .5) {
        poemPlayed = true;
        devNote.classList.add('poem-playing');
        setTimeout(() => {
          devNoteExit.classList.add('visible');
        }, 8500);
      }
    });
  }, {threshold:.45});
  poemObserver.observe(devNote);

  addEventListener('scroll', () => {
    if (finaleStarted || birthdayScrollReady) return;
    const rect = devNote.getBoundingClientRect();
    const poem = devNote.querySelector('.poem');
    if (!poem) return;
    const poemRect = poem.getBoundingClientRect();
    const poemCenter = poemRect.top + poemRect.height / 2;
    const viewportCenter = innerHeight / 2;
    const nearCenter = Math.abs(poemCenter - viewportCenter) < Math.max(130, innerHeight * .16);
    const passedPoem = rect.top < innerHeight * .72 && poemRect.bottom < innerHeight * .82;
    if (nearCenter || passedPoem) {
      birthdayScrollReady = true;
      birthdayScrollReveal.classList.add('visible');
      birthdayScrollReveal.setAttribute('aria-hidden','false');
    }
  }, {passive:true});

  const birthdaySound = document.getElementById('birthdaySound');
  const soundRequest = document.getElementById('soundRequest');
  const soundChoiceYes = document.getElementById('soundChoiceYes');
  const soundChoiceNo = document.getElementById('soundChoiceNo');
  let soundConsent = null;

  function closeSoundRequest(consent) {
    soundConsent = consent;
    soundRequest.classList.add('dismissed');
    soundRequest.setAttribute('aria-hidden', 'true');
    // Choosing sound is only permission for later; it must not start playback here.
  }

  // On iOS Safari (including iPhone 16 Plus), consent alone does not unlock
  // audio for playback much later. Prime this exact audio element during the tap,
  // silently, so the finale can start it without a second tap.
  function primeBirthdayAudioFromGesture() {
    if (!birthdayAudio) return;
    const wasMuted = birthdayAudio.muted;
    birthdayAudio.muted = true;
    let primePromise;
    try {
      primePromise = birthdayAudio.play();
    } catch (_) {
      birthdayAudio.muted = wasMuted;
      return;
    }
    if (primePromise && typeof primePromise.then === 'function') {
      primePromise.then(() => {
        birthdayAudio.pause();
        try { birthdayAudio.currentTime = 0; } catch (_) {}
        birthdayAudio.muted = wasMuted;
      }).catch(() => {
        birthdayAudio.muted = wasMuted;
      });
    } else {
      birthdayAudio.pause();
      try { birthdayAudio.currentTime = 0; } catch (_) {}
      birthdayAudio.muted = wasMuted;
    }
  }

  soundChoiceYes.addEventListener('click', () => {
    soundConsent = true;
    primeBirthdayAudioFromGesture();
    closeSoundRequest(true);
  });

  // The decline button is a harmless, impossible-to-catch prank.
  // Move it synchronously as soon as the pointer approaches; it never declines.
  function teleportDeclineButton() {
    if (!soundChoiceNo || soundRequest.classList.contains('dismissed')) return;
    const rect = soundChoiceNo.getBoundingClientRect();
    const margin = 12;
    const maxLeft = Math.max(margin, innerWidth - rect.width - margin);
    const maxTop = Math.max(margin, innerHeight - rect.height - margin);
    const left = margin + Math.random() * Math.max(0, maxLeft - margin);
    const top = margin + Math.random() * Math.max(0, maxTop - margin);
    soundChoiceNo.classList.add('teleporting');
    soundChoiceNo.style.left = Math.round(left) + 'px';
    soundChoiceNo.style.top = Math.round(top) + 'px';
  }
  soundChoiceNo.addEventListener('pointerenter', teleportDeclineButton);
  soundChoiceNo.addEventListener('pointerdown', event => {
    event.preventDefault();
    teleportDeclineButton();
  });
  soundChoiceNo.addEventListener('click', event => {
    event.preventDefault();
    teleportDeclineButton();
  });
  soundChoiceNo.addEventListener('focus', teleportDeclineButton);

  function attemptBirthdayAudio(reset = false) {
    if (!birthdayAudio) return Promise.resolve(false);
    if (reset) {
      try { birthdayAudio.currentTime = 0; } catch (_) {}
    }
    const playPromise = birthdayAudio.play();
    if (!playPromise || !playPromise.then) {
      if (birthdaySound) birthdaySound.classList.remove('visible');
      return Promise.resolve(true);
    }
    return playPromise.then(() => {
      if (birthdaySound) birthdaySound.classList.remove('visible');
      return true;
    }).catch(() => {
      if (birthdaySound) birthdaySound.classList.add('visible');
      return false;
    });
  }

  if (birthdayAudio) {
    birthdayAudio.preload = 'auto';
    birthdayAudio.addEventListener('error', () => {
      if (birthdaySound) birthdaySound.classList.add('visible');
    });
  }

  function advanceBirthdayScroll(amount) {
    if (finaleStarted || !birthdayScrollReady || amount <= 0) return;
    birthdayScrollAmount = Math.min(birthdayScrollTarget, birthdayScrollAmount + amount);
    const percent = Math.round((birthdayScrollAmount / birthdayScrollTarget) * 100);
    birthdayProgress.style.width = percent + '%';
    birthdayProgressText.textContent = percent + '%';

    if (percent >= 100) {
      birthdayScrollReady = false;
      birthdayScrollReveal.classList.remove('visible');
      birthdayScrollReveal.setAttribute('aria-hidden','true');

      // Only start the song at the chaos reveal if she opted in on entry.
      if (birthdayAudio) {
        birthdayAudio.pause();
        if (soundConsent === true) {
          attemptBirthdayAudio(true);
        } else {
          birthdayAudio.currentTime = 0;
          if (birthdaySound) birthdaySound.classList.add('visible');
        }
      }

      if (birthdayCatVideo) {
        birthdayCatVideo.currentTime = 0;
        birthdayCatVideo.muted = true;
        birthdayCatVideo.play().catch(() => {});
      }

      startFinale();
    }
  }

  // Mouse-wheel support for desktop.
  addEventListener('wheel', e => {
    advanceBirthdayScroll(e.deltaY);
  }, {passive:true});

  // Touch support: mobile browsers do not fire wheel events for finger swipes.
  let birthdayTouchY = null;
  addEventListener('touchstart', e => {
    if (!birthdayScrollReady || !e.touches.length) return;
    birthdayTouchY = e.touches[0].clientY;
  }, {passive:true});

  addEventListener('touchmove', e => {
    if (finaleStarted || !birthdayScrollReady || birthdayTouchY === null || !e.touches.length) return;
    const currentY = e.touches[0].clientY;
    const delta = birthdayTouchY - currentY;
    birthdayTouchY = currentY;
    if (delta > 0) {
      e.preventDefault();
      advanceBirthdayScroll(delta);
    }
  }, {passive:false});

  addEventListener('touchend', () => {
    birthdayTouchY = null;
  }, {passive:true});

  function startFinale() {
    if (finaleStarted) return;
    finaleStarted = true;
    blackout.classList.add('active');

    setTimeout(() => {
      finale.classList.add('active');
      blackout.classList.remove('active');
      birthdayCatLastPaint = 0;
      cancelAnimationFrame(birthdayCatFrame);
      scheduleBirthdayCat();

      // If autoplay was rejected outside the user gesture, expose the click-to-play control.
      if (birthdayAudio && birthdayAudio.paused && birthdaySound) {
        birthdaySound.classList.add('visible');
      }
    }, 1000);
  }

  document.getElementById('birthdayClose').addEventListener('click', () => {
    if (birthdayAudio) {
      birthdayAudio.pause();
      birthdayAudio.currentTime = 0;
    }
    if (birthdayCatVideo) {
      birthdayCatVideo.pause();
      birthdayCatVideo.currentTime = 0;
    }
    cancelAnimationFrame(birthdayCatFrame);
    finale.classList.remove('active');
    if (birthdaySound) birthdaySound.classList.remove('visible');
  });

  if (birthdaySound) {
    birthdaySound.addEventListener('click', () => {
      attemptBirthdayAudio();
    });
  }

  addEventListener('pagehide', () => {
    if (birthdayAudio) birthdayAudio.pause();
    if (birthdayCatVideo) birthdayCatVideo.pause();
  });

  document.querySelectorAll('.frame').forEach(frame => {
    frame.addEventListener('click', () => {
      const title = frame.dataset.title || 'Memory';
      modalText.textContent = title + '. Real photos will replace this placeholder in the next pass.';
      document.getElementById('modalTitle').textContent = 'Memory preview';
      modal.classList.add('open');
    });
  });
})();