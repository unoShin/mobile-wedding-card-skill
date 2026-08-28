#!/usr/bin/env node

/**
 * init.js — Interactive CLI wizard for creating a customized Mobile Wedding Card.
 * Usage: node scripts/init.js [target-directory]
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const templateDir = path.resolve(__dirname, '../templates');

// Theme Color Palettes
const THEMES = {
  1: {
    name: 'Romantic Rose (로맨틱 로즈 핑크 - 기본)',
    variables: `  /* Theme Colors (Romantic Theme) */
  --theme-text-body: #1a1a1a;
  --theme-text-heading: #1a1a1a;
  --theme-text-secondary: #ad868b;
  --theme-text-tertiary: #ad868b;
  --theme-text-countdown: #ad868b;
  --theme-text-muted: #9a9a9a;
  
  --theme-color-accent: #d099a1;      /* Rose Pink Accent */
  --theme-color-accent-subtle: #faf2f3;
  --theme-text-groom: #23679f;        /* Groom Accent */
  --theme-text-bride: #d08c95;        /* Bride Accent */
  
  /* Backgrounds */
  --theme-bg-default: #ffffff;
  --theme-bg-primary: #f9f9f9;
  --theme-bg-secondary: #f8f5f3;      /* Warm Beige */
  
  /* Borders and Dividers */
  --theme-bg-default-line: #eeeeee;
  --theme-bg-primary-line: #d7d7d7;
  --theme-bg-secondary-line: #d7d7d7;
  --theme-border-timeline: #eaeaea;
  --theme-border-divider: #eeeeee;
  --theme-border-subtle: #ede6e7;
  --theme-detail-border: #eeeeee;
  
  /* Buttons */
  --theme-btn-primary-bg: #f9f9f9;
  --theme-btn-primary-border: #eeeeee;
  --theme-btn-secondary-bg: #ffffff;
  --theme-btn-secondary-border: #eeeeee;
  --theme-btn-contact-bg: #ffffff;
  --theme-btn-contact-border: #eeeeee;
  
  /* Calendar */
  --theme-cal-highlight-text: #ad868b;
  --theme-cal-text: #1a1a1a;
  --theme-cal-sunday-text: #d099a1;
  --theme-cal-marker-bg: #dab1b6;
  
  /* D-Day & Accounts */
  --theme-dday-bg: #faf8f8;
  --theme-dday-border: #f2eeee;
  --theme-location-bg: #ffffff;
  --theme-location-border: #eeeeee;
  --theme-account-button-bg: #ffffff;
  --theme-account-button-border: #eeeeee;
  --theme-account-content-bg: #ffffff;
  --theme-account-content-border: #eeeeee;
  --theme-account-copy-bg: #f9f9f9;
  --theme-account-copy-border: #eeeeee;`
  },
  2: {
    name: 'Classic Elegance (클래식 네이비 & 샴페인 골드)',
    variables: `  /* Theme Colors (Classic Navy & Gold) */
  --theme-text-body: #1e242b;
  --theme-text-heading: #1e242b;
  --theme-text-secondary: #c5a059;
  --theme-text-tertiary: #c5a059;
  --theme-text-countdown: #c5a059;
  --theme-text-muted: #8b95a1;
  
  --theme-color-accent: #c5a059;      /* Champagne Gold */
  --theme-color-accent-subtle: #faf7f0;
  --theme-text-groom: #1d3557;        /* Deep Navy */
  --theme-text-bride: #c5a059;        /* Gold */
  
  /* Backgrounds */
  --theme-bg-default: #ffffff;
  --theme-bg-primary: #f8f9fa;
  --theme-bg-secondary: #f3f5f7;      /* Subtle Cool Grey */
  
  /* Borders and Dividers */
  --theme-bg-default-line: #e9ecef;
  --theme-bg-primary-line: #dee2e6;
  --theme-bg-secondary-line: #dee2e6;
  --theme-border-timeline: #e9ecef;
  --theme-border-divider: #e9ecef;
  --theme-border-subtle: #ede9df;
  --theme-detail-border: #e9ecef;
  
  /* Buttons */
  --theme-btn-primary-bg: #f8f9fa;
  --theme-btn-primary-border: #e9ecef;
  --theme-btn-secondary-bg: #ffffff;
  --theme-btn-secondary-border: #dee2e6;
  --theme-btn-contact-bg: #ffffff;
  --theme-btn-contact-border: #e9ecef;
  
  /* Calendar */
  --theme-cal-highlight-text: #c5a059;
  --theme-cal-text: #1e242b;
  --theme-cal-sunday-text: #d9534f;
  --theme-cal-marker-bg: #e6c987;
  
  /* D-Day & Accounts */
  --theme-dday-bg: #faf9f5;
  --theme-dday-border: #f0ebe1;
  --theme-location-bg: #ffffff;
  --theme-location-border: #e9ecef;
  --theme-account-button-bg: #ffffff;
  --theme-account-button-border: #e9ecef;
  --theme-account-content-bg: #ffffff;
  --theme-account-content-border: #e9ecef;
  --theme-account-copy-bg: #f8f9fa;
  --theme-account-copy-border: #e9ecef;`
  },
  3: {
    name: 'Modern Pure (모던 미니멀 블랙 & 화이트)',
    variables: `  /* Theme Colors (Modern Pure Minimalist) */
  --theme-text-body: #111111;
  --theme-text-heading: #111111;
  --theme-text-secondary: #666666;
  --theme-text-tertiary: #666666;
  --theme-text-countdown: #444444;
  --theme-text-muted: #888888;
  
  --theme-color-accent: #333333;      /* Charcoal Accent */
  --theme-color-accent-subtle: #f0f0f0;
  --theme-text-groom: #333333;
  --theme-text-bride: #333333;
  
  /* Backgrounds */
  --theme-bg-default: #ffffff;
  --theme-bg-primary: #fafafa;
  --theme-bg-secondary: #f4f4f4;
  
  /* Borders and Dividers */
  --theme-bg-default-line: #eeeeee;
  --theme-bg-primary-line: #dcdcdc;
  --theme-bg-secondary-line: #dcdcdc;
  --theme-border-timeline: #e5e5e5;
  --theme-border-divider: #eeeeee;
  --theme-border-subtle: #e0e0e0;
  --theme-detail-border: #eeeeee;
  
  /* Buttons */
  --theme-btn-primary-bg: #fafafa;
  --theme-btn-primary-border: #e5e5e5;
  --theme-btn-secondary-bg: #ffffff;
  --theme-btn-secondary-border: #e5e5e5;
  --theme-btn-contact-bg: #ffffff;
  --theme-btn-contact-border: #eeeeee;
  
  /* Calendar */
  --theme-cal-highlight-text: #222222;
  --theme-cal-text: #111111;
  --theme-cal-sunday-text: #c0392b;
  --theme-cal-marker-bg: #cccccc;
  
  /* D-Day & Accounts */
  --theme-dday-bg: #f8f8f8;
  --theme-dday-border: #eeeeee;
  --theme-location-bg: #ffffff;
  --theme-location-border: #eeeeee;
  --theme-account-button-bg: #ffffff;
  --theme-account-button-border: #eeeeee;
  --theme-account-content-bg: #ffffff;
  --theme-account-content-border: #eeeeee;
  --theme-account-copy-bg: #f5f5f5;
  --theme-account-copy-border: #eeeeee;`
  }
};

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function parseDateToISO(dateStr) {
  if (!dateStr) return '2027-01-24T13:10:00+09:00';
  if (dateStr.includes('T')) return dateStr;
  
  const cleaned = dateStr.replace(/\./g, '-').trim();
  const parts = cleaned.split(' ');
  const datePart = parts[0];
  const timePart = parts[1] || '12:00';
  const fullTime = timePart.length === 5 ? timePart + ':00' : timePart;
  return `${datePart}T${fullTime}+09:00`;
}

function ask(rl, questionText, defaultValue = '') {
  if (rl.closed) return Promise.resolve(defaultValue);
  return new Promise(resolve => {
    let resolved = false;
    const onAnswer = answer => {
      if (!resolved) {
        resolved = true;
        resolve(answer.trim() || defaultValue);
      }
    };
    try {
      rl.question(questionText, onAnswer);
    } catch (e) {
      return resolve(defaultValue);
    }
    rl.once('close', () => {
      if (!resolved) {
        resolved = true;
        resolve(defaultValue);
      }
    });
  });
}

async function promptInteractive() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log(`
======================================================================
  💍 예비 신혼부부를 위한 모바일 청첩장 제작 위저드 (Mobile Wedding Card)
======================================================================
엔터(Enter)를 누르면 [기본값]이 자동으로 적용됩니다.
`);

  // 1. Target directory
  const defaultDir = process.argv[2] || './my-wedding-card';
  const targetDirInput = await ask(rl, `📁 생성할 프로젝트 경로 [${defaultDir}]: `, defaultDir);
  const targetDir = path.resolve(process.cwd(), targetDirInput);

  // 2. Component/Section Selection Checkbox
  console.log(`\n--- 🧩 청첩장에 포함할 구성요소(섹션)를 선택해 주세요 ---`);
  console.log(`  [1] 📅 캘린더 & D-Day 실시간 카운트다운 (Calendar & Countdown)`);
  console.log(`  [2] 🖼️ 사진 갤러리 & 풀스크린 라이트박스 (Photo Gallery)`);
  console.log(`  [3] 🗺️ 오시는 길 & 지도/대중교통 안내 (Location & Map)`);
  console.log(`  [4] 💳 마음 전하실 곳 (신랑/신부 축의금 계좌번호 아코디언)`);
  console.log(`  [5] 💌 참석 여부 전달 (RSVP 팝업 설문)`);
  console.log(`  [6] 💬 축하 한마디 방명록 게시판 (Guestbook)`);
  console.log(`  [7] 🔗 청첩장 공유하기 (카카오톡/링크 복사)`);
  console.log(`  [8] 🌸 벚꽃/꽃잎 흩날림 애니메이션 효과 (Falling Petals)`);
  console.log(`  [9] 🎵 배경음악(BGM) 오디오 플레이어 (Background Audio)`);

  const sectionsInput = await ask(rl, `\n포함할 섹션 번호 입력 (쉼표 구분, 엔터 누르면 전체 선택) [1,2,3,4,5,6,7,8,9]: `, '1,2,3,4,5,6,7,8,9');
  const selectedNums = sectionsInput.split(/[,\s]+/).map(s => s.trim()).filter(Boolean);

  const hasCalendar = selectedNums.includes('1') || selectedNums.length === 0;
  const hasGallery = selectedNums.includes('2') || selectedNums.length === 0;
  const hasMap = selectedNums.includes('3') || selectedNums.length === 0;
  const hasAccounts = selectedNums.includes('4') || selectedNums.length === 0;
  const hasRsvp = selectedNums.includes('5') || selectedNums.length === 0;
  const hasGuestbook = selectedNums.includes('6') || selectedNums.length === 0;
  const hasShare = selectedNums.includes('7') || selectedNums.length === 0;
  const hasPetals = selectedNums.includes('8') || selectedNums.length === 0;
  const hasBgm = selectedNums.includes('9') || selectedNums.length === 0;

  console.log(`\n--- 🤵 신랑 정보 ---`);
  const groomLastName = await ask(rl, `신랑 성 [신]: `, '신');
  const groomFirstName = await ask(rl, `신랑 이름 [윤호]: `, '윤호');
  const groomPhone = await ask(rl, `신랑 연락처 [010-1234-5678]: `, '010-1234-5678');
  const groomFather = await ask(rl, `신랑 아버지 성함 (없으면 빈칸): `, '');
  const groomMother = await ask(rl, `신랑 어머니 성함 [이정희]: `, '이정희');

  console.log(`\n--- 👰 신부 정보 ---`);
  const brideLastName = await ask(rl, `신부 성 [이]: `, '이');
  const brideFirstName = await ask(rl, `신부 이름 [다연]: `, '다연');
  const bridePhone = await ask(rl, `신부 연락처 [010-9876-5432]: `, '010-9876-5432');
  const brideFather = await ask(rl, `신부 아버지 성함 [이주엽]: `, '이주엽');
  const brideMother = await ask(rl, `신부 어머니 성함 [정현]: `, '정현');

  console.log(`\n--- 📅 예식 일시 및 장소 ---`);
  const weddingDateStr = await ask(rl, `예식 일시 (YYYY-MM-DD HH:mm) [2027-01-24 13:10]: `, '2027-01-24 13:10');
  const weddingPlace = await ask(rl, `예식장 이름 [여의도 웨딩컨벤션 3층 그랜드블룸홀]: `, '여의도 웨딩컨벤션 3층 그랜드블룸홀');
  const weddingAddress = await ask(rl, `예식장 도로명 주소 [서울특별시 영등포구 여의대로 14]: `, '서울특별시 영등포구 여의대로 14');
  const weddingAddressDetail = await ask(rl, `상세 건물명 [KT여의도빌딩]: `, 'KT여의도빌딩');

  let groomBank = '국민', groomAccNumber = '92011171041', groomAccOwner = `${groomLastName}${groomFirstName}`;
  let brideBank = '농협', brideAccNumber = '3524966230793', brideAccOwner = `${brideLastName}${brideFirstName}`;

  if (hasAccounts) {
    console.log(`\n--- 💳 축의금 계좌번호 ---`);
    groomBank = await ask(rl, `신랑측 은행명 [국민]: `, '국민');
    groomAccNumber = await ask(rl, `신랑측 계좌번호 [92011171041]: `, '92011171041');
    groomAccOwner = await ask(rl, `신랑측 예금주 [${groomLastName}${groomFirstName}]: `, `${groomLastName}${groomFirstName}`);

    brideBank = await ask(rl, `신부측 은행명 [농협]: `, '농협');
    brideAccNumber = await ask(rl, `신부측 계좌번호 [3524966230793]: `, '3524966230793');
    brideAccOwner = await ask(rl, `신부측 예금주 [${brideLastName}${brideFirstName}]: `, `${brideLastName}${brideFirstName}`);
  }

  let bgmSrc = '';
  if (hasBgm) {
    console.log(`\n--- 🎵 배경음악(BGM) 설정 ---`);
    bgmSrc = await ask(rl, `배경음악 파일 경로 또는 URL [audio/bgm.mp3]: `, 'audio/bgm.mp3');
  }

  console.log(`\n--- 🎨 디자인 & 컬러 테마 설정 ---`);
  console.log(`  1. Romantic Rose (로맨틱 로즈 핑크 - 기본)`);
  console.log(`  2. Classic Elegance (클래식 네이비 & 샴페인 골드)`);
  console.log(`  3. Modern Pure (모던 미니멀 블랙 & 화이트)`);
  const themeChoice = await ask(rl, `컬러 테마 번호 선택 (1~3) [1]: `, '1');
  const selectedThemeKey = ['1', '2', '3'].includes(themeChoice) ? parseInt(themeChoice, 10) : 1;

  let rsvpApiUrl = '';
  let kakaoAppKey = '';

  if (hasRsvp || hasGuestbook || hasShare) {
    console.log(`\n--- ⚙️ 외부 API 연동 (나중에 설정 가능) ---`);
    if (hasRsvp || hasGuestbook) {
      rsvpApiUrl = await ask(rl, `Google Apps Script URL (없으면 엔터): `, '');
    }
    if (hasShare) {
      kakaoAppKey = await ask(rl, `카카오 JavaScript 앱 키 (없으면 엔터): `, '');
    }
  }

  try { rl.close(); } catch (e) {}

  console.log(`\n⚙️ 선택하신 구성으로 맞춤 청첩장 프로젝트 생성 중...`);

  // 1. Copy Template Files
  copyDirRecursive(templateDir, targetDir);

  // 2. Build Config Object
  const config = {
    bgm: bgmSrc,
    rsvp_api_url: rsvpApiUrl || "https://script.google.com/macros/s/AKfycbyHQgh4q6knyze6yV1KJVb4L4i74B-NOfV5D0NJRGA7ny6W2kq9blY3La56VnPYRT3Qcw/exec",
    kakao_app_key: kakaoAppKey || "f6d7f2bb38649f6d4adb57e05621d326",
    groom: {
      lastName: groomLastName,
      firstName: groomFirstName,
      phoneNumber: groomPhone,
      father: { name: groomFather, phoneNumber: "" },
      mother: { name: groomMother, phoneNumber: "" }
    },
    bride: {
      lastName: brideLastName,
      firstName: brideFirstName,
      phoneNumber: bridePhone,
      father: { name: brideFather, phoneNumber: "" },
      mother: { name: brideMother, deceased: false, phoneNumber: "" }
    },
    wedding: {
      date: parseDateToISO(weddingDateStr),
      place: weddingPlace,
      hall: "",
      address: weddingAddress,
      addressDetail: weddingAddressDetail
    },
    accounts: {
      groom: [
        { relation: "신랑", bank: groomBank, number: groomAccNumber, owner: groomAccOwner }
      ],
      bride: [
        { relation: "신부", bank: brideBank, number: brideAccNumber, owner: brideAccOwner }
      ]
    },
    transport: [
      {
        type: "subway",
        title: "지하철 🚇",
        body: "대중교통 이용 시 편리하게 오실 수 있습니다."
      },
      {
        type: "bus",
        title: "버스 🚌",
        body: "인근 정류장에서 하차 후 도보로 이동해 주세요."
      },
      {
        type: "car",
        title: "자가용 & 주차 🚗",
        body: `내비게이션에 <b>'${weddingPlace}'</b> 또는 <b>'${weddingAddress}'</b> 입력`
      }
    ]
  };

  // Write data/config.json
  const configPath = path.join(targetDir, 'data/config.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');

  // Update Theme in css/variables.css if needed
  if (selectedThemeKey !== 1) {
    const varCssPath = path.join(targetDir, 'css/variables.css');
    if (fs.existsSync(varCssPath)) {
      let varCss = fs.readFileSync(varCssPath, 'utf8');
      const themeBlock = THEMES[selectedThemeKey].variables;
      varCss = varCss.replace(/\/\* Theme Colors[\s\S]*?(?=\/\* Layout Specs)/, themeBlock + '\n  \n');
      fs.writeFileSync(varCssPath, varCss, 'utf8');
    }
  }

  // Handle section assembly in index.html
  const indexPath = path.join(targetDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    let indexHtml = fs.readFileSync(indexPath, 'utf8');
    indexHtml = indexHtml.replace(/<title>.*?<\/title>/, `<title>${groomFirstName} 🤍 ${brideFirstName} 결혼합니다</title>`);
    indexHtml = indexHtml.replace(/<meta property="og:title" content=".*?">/, `<meta property="og:title" content="${groomFirstName} 🤍 ${brideFirstName} 결혼합니다">`);
    
    // Selective section removal if disabled
    if (!hasBgm) {
      indexHtml = indexHtml.replace(/<!-- BGM Toggle Button[\s\S]*?<\/button>\s*/, '');
      indexHtml = indexHtml.replace(/<script defer src="js\/bgm\.js"><\/script>\n?/, '');
    }
    if (!hasCalendar) {
      indexHtml = indexHtml.replace(/<!-- 4\. Calendar & Countdown Section -->[\s\S]*?<\/section>/, '');
    }
    if (!hasGallery) {
      indexHtml = indexHtml.replace(/<!-- 5\. Gallery Section -->[\s\S]*?<\/section>/, '');
      indexHtml = indexHtml.replace(/<!-- Lightbox Gallery Modal -->[\s\S]*?<\/div>\s*<\/div>/, '');
    }
    if (!hasMap) {
      indexHtml = indexHtml.replace(/<!-- 6\. Map & Way to come -->[\s\S]*?<\/section>/, '');
    }
    if (!hasAccounts) {
      indexHtml = indexHtml.replace(/<!-- 7\. Accounts Section[\s\S]*?<\/section>/, '');
    }
    if (!hasRsvp) {
      indexHtml = indexHtml.replace(/<!-- 8\. RSVP Section[\s\S]*?<\/section>/, '');
      indexHtml = indexHtml.replace(/<!-- RSVP Modal -->[\s\S]*?<\/div>\s*<\/div>/, '');
    }
    if (!hasGuestbook) {
      indexHtml = indexHtml.replace(/<!-- 9\. Guestbook Section -->[\s\S]*?<\/section>/, '');
      indexHtml = indexHtml.replace(/<!-- Guestbook Write Modal -->[\s\S]*?<\/div>\s*<\/div>/, '');
    }
    if (!hasShare) {
      indexHtml = indexHtml.replace(/<!-- 10\. Share Section -->[\s\S]*?<\/section>/, '');
    }
    if (!hasPetals) {
      indexHtml = indexHtml.replace(/<script defer src="js\/petals\.js"><\/script>\n?/, '');
    }

    fs.writeFileSync(indexPath, indexHtml, 'utf8');
  }

  // Ensure images and audio directories exist
  const imagesFinalDir = path.join(targetDir, 'images/final');
  const imagesOrgDir = path.join(targetDir, 'images/org');
  const audioDir = path.join(targetDir, 'audio');
  fs.mkdirSync(imagesFinalDir, { recursive: true });
  fs.mkdirSync(imagesOrgDir, { recursive: true });
  if (hasBgm) {
    fs.mkdirSync(audioDir, { recursive: true });
  }

  // Make deploy.sh executable
  const deployScript = path.join(targetDir, 'deploy.sh');
  if (fs.existsSync(deployScript)) {
    try { fs.chmodSync(deployScript, '755'); } catch (e) {}
  }

  const enabledSectionList = [
    hasBgm && '🎵 배경음악(BGM)',
    hasCalendar && '📅 캘린더/D-Day',
    hasGallery && '🖼️ 사진 갤러리',
    hasMap && '🗺️ 오시는 길/지도',
    hasAccounts && '💳 축의금 계좌',
    hasRsvp && '💌 참석여부(RSVP)',
    hasGuestbook && '💬 축하 방명록',
    hasShare && '🔗 공유하기',
    hasPetals && '🌸 꽃잎 애니메이션'
  ].filter(Boolean).join(', ');

  console.log(`
======================================================================
  ✨ ${groomLastName}${groomFirstName} 🤍 ${brideLastName}${brideFirstName} 예비부부님의 모바일 청첩장이 생성되었습니다!
======================================================================
📂 프로젝트 경로: ${targetDir}
🎨 선택된 테마: ${THEMES[selectedThemeKey].name}
🧩 활성화된 섹션: ${enabledSectionList}

🚀 다음 진행 단계:
  1. cd ${path.relative(process.cwd(), targetDir) || '.'}
  2. npm install
  3. 사진 파일(new_main.jpg, 01.jpg ~ 15.jpg)을 images/final/ 폴더에 넣기
  4. node optimize_images.js  (고화질 사진 자동 압축)
  5. npm test                 (배포 전 백화 현상 검증)
  6. ./deploy.sh              (GitHub Pages 배포)
`);
  process.exit(0);
}

promptInteractive().catch(err => {
  console.error('❌ Error initializing wedding card:', err);
  process.exit(1);
});
