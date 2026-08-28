/**
 * petals.js — 벚꽃/꽃잎 흩날림 애니메이션 효과 (오버레이)
 *
 * 특징:
 *   - 화면 위에 화이트 & 로즈핑크 꽃잎이 부드럽게 흩날리는 효과
 *   - 청첩장 카드 너비(--layout-max-width, 440px) 안에서만 자연스럽게 떨어짐
 *   - pointer-events: none 설정으로 클릭, 터치, 스크롤을 전혀 방해하지 않음
 *   - prefers-reduced-motion(모션 최소화) 설정 시 자동 비활성화 (웹 접근성 준수)
 */
(function () {
  'use strict';

  // 접근성: 사용자가 모션 줄이기를 켜두면 효과 생략
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  var PETAL_COUNT = 18;

  // 꽃잎 색상 (로맨틱 테마에 맞춘 화이트, 블러쉬 핑크, 로즈 크림 톤)
  var COLORS = [
    'linear-gradient(135deg, #ffffff, #f3ece6)', // 아이보리 / 화이트
    'linear-gradient(135deg, #fbeef0, #f3d9dc)', // 아주 연한 베이비 핑크
    'linear-gradient(135deg, #f3d9dc, #e8bcc4)', // 블러쉬 핑크
    'linear-gradient(135deg, #f8eef0, #ead6da)'  // 로즈 크림
  ];

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createPetals() {
    if (typeof document === 'undefined') return;
    if (document.querySelector('.petals')) return; // 중복 생성 방지

    var container = document.createElement('div');
    container.className = 'petals';
    container.setAttribute('aria-hidden', 'true');

    for (var i = 0; i < PETAL_COUNT; i++) {
      var petal = document.createElement('span');
      petal.className = 'petal';

      var size = rand(9, 17);                         // 꽃잎 크기 (9px ~ 17px)
      petal.style.left = rand(-2, 100) + '%';          // 가로 시작 위치
      petal.style.width = size + 'px';
      petal.style.height = (size * 0.72) + 'px';       // 살짝 납작한 꽃잎 형태
      petal.style.background = COLORS[i % COLORS.length];
      petal.style.opacity = rand(0.45, 0.9).toFixed(2);
      petal.style.animationDuration = rand(9, 17) + 's';   // 떨어지는 속도
      petal.style.animationDelay = '-' + rand(0, 17) + 's'; // 시작 시점 분산 (처음부터 흩날리도록)
      petal.style.setProperty('--drift', rand(-45, 45) + 'px'); // 좌우 흔들림 폭
      petal.style.setProperty('--spin', rand(180, 600) + 'deg'); // 회전 각도

      container.appendChild(petal);
    }

    document.body.appendChild(container);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createPetals);
  } else {
    createPetals();
  }
})();
