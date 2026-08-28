/**
 * bgm.js — 배경음악(BGM) 재생/정지 제어 스크립트
 * 
 * 특징:
 * - configData.bgm 경로의 오디오 파일 재생
 * - 모바일 브라우저 자동 재생 정책 대응: 첫 사용자 인터랙션(터치/스크롤/클릭) 시 자동 재생 시도
 * - 탭 전환(visibilitychange) 시 백그라운드 자동 일시정지, 복귀 시 자동 복원
 * - BGM 설정이 없거나 로드 실패 시 버튼을 조용히 숨김
 */
(function () {
  'use strict';

  function initBgm() {
    const btn = document.getElementById('bgm-toggle');
    if (!btn) return;

    // Load configData or wait for fetch
    fetch('data/config.json?v=' + new Date().getTime())
      .then(res => res.json())
      .then(config => {
        const bgmSrc = (config && config.bgm) ? config.bgm.trim() : '';
        if (!bgmSrc) {
          btn.style.display = 'none';
          return;
        }

        setupAudioPlayer(btn, bgmSrc);
      })
      .catch(() => {
        btn.style.display = 'none';
      });
  }

  function setupAudioPlayer(btn, bgmSrc) {
    const audio = new Audio();
    audio.loop = true;
    audio.preload = 'none';

    let isPlaying = false;
    let userPaused = false;

    const ICON_SOUND_ON = `
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor">
        <path d="M4 9v6h4l5 5V4L8 9H4z"/>
        <path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" d="M16 9a4 4 0 0 1 0 6M18.6 6.4a7 7 0 0 1 0 11.2"/>
      </svg>`;

    const ICON_MUTED = `
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor">
        <path d="M4 9v6h4l5 5V4L8 9H4z"/>
        <path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" d="M16.5 9.5l5 5M21.5 9.5l-5 5"/>
      </svg>`;

    function updateBtn() {
      if (isPlaying) {
        btn.innerHTML = ICON_SOUND_ON;
        btn.setAttribute('aria-label', '배경음악 끄기');
        btn.classList.add('bgm-playing');
      } else {
        btn.innerHTML = ICON_MUTED;
        btn.setAttribute('aria-label', '배경음악 켜기');
        btn.classList.remove('bgm-playing');
      }
    }

    function tryPlay() {
      if (!audio.src || audio.src === window.location.href) {
        audio.src = bgmSrc;
      }
      const promise = audio.play();
      if (promise !== undefined) {
        promise.then(() => {
          isPlaying = true;
          updateBtn();
        }).catch(err => {
          isPlaying = false;
          updateBtn();
          if (err.name !== 'NotAllowedError' && err.name !== 'AbortError') {
            btn.style.display = 'none';
          }
        });
      } else {
        isPlaying = true;
        updateBtn();
      }
    }

    function doPause() {
      audio.pause();
      isPlaying = false;
      updateBtn();
    }

    audio.addEventListener('error', () => {
      btn.style.display = 'none';
    });

    btn.addEventListener('click', () => {
      if (isPlaying) {
        userPaused = true;
        doPause();
      } else {
        userPaused = false;
        tryPlay();
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (isPlaying) audio.pause();
      } else {
        if (isPlaying && !userPaused) tryPlay();
      }
    });

    function autoPlayOnce() {
      if (!isPlaying && !userPaused) tryPlay();
      removeAutoPlayListeners();
    }

    function removeAutoPlayListeners() {
      ['pointerdown', 'touchstart', 'click', 'scroll'].forEach(ev => {
        window.removeEventListener(ev, autoPlayOnce);
      });
    }

    updateBtn();
    tryPlay();

    ['pointerdown', 'touchstart', 'click', 'scroll'].forEach(ev => {
      window.addEventListener(ev, autoPlayOnce, { once: false, passive: true });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBgm);
  } else {
    initBgm();
  }
})();
