/**
 * AVM Housing Society Blood Donation Drive
 * Date: 30th October 2026 at City Hall
 * Desk of Sunil, Honorary Secretary
 */

// Immediately reset scroll restoration so reloads don't jump down the page
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Clear trailing section hashes (e.g. #register) so reloads always start at the hero top
if (window.location.hash) {
  history.replaceState(null, '', window.location.pathname + window.location.search);
}
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

  // Handle smooth scroll for navigation links without locking the URL hash
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  initCountdown();
  initBloodMatcher();
  initEligibilityQuiz();
  initRegistrationAndPledges();
  initFAQAccordion();
});

window.addEventListener('load', () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
});

// -------------------------------------------------------------
// 1. COUNTDOWN TIMER (Target: October 30, 2026 09:00 AM IST)
// -------------------------------------------------------------
function initCountdown() {
  const targetDate = new Date('2026-10-30T09:00:00+05:30').getTime();

  const daysEl = document.getElementById('timer-days');
  const hoursEl = document.getElementById('timer-hours');
  const minutesEl = document.getElementById('timer-minutes');
  const secondsEl = document.getElementById('timer-seconds');

  function updateClock() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = days < 10 ? '0' + days : days;
    hoursEl.textContent = hours < 10 ? '0' + hours : hours;
    minutesEl.textContent = minutes < 10 ? '0' + minutes : minutes;
    secondsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

// -------------------------------------------------------------
// 2. BLOOD COMPATIBILITY MATCHER
// -------------------------------------------------------------
const bloodData = {
  'O+': {
    canDonateTo: ['O+', 'A+', 'B+', 'AB+'],
    canReceiveFrom: ['O+', 'O-'],
    fact: 'O+ is the most common and needed blood type in India. 1 in 3 hospital patients requires O+ blood.'
  },
  'O-': {
    canDonateTo: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    canReceiveFrom: ['O-'],
    fact: 'Universal Red Blood Cell Donor! O- blood is critical in trauma emergencies when a patient’s type is unknown.'
  },
  'A+': {
    canDonateTo: ['A+', 'AB+'],
    canReceiveFrom: ['A+', 'A-', 'O+', 'O-'],
    fact: 'A+ is one of the highest in-demand types for platelets and plasma treatments.'
  },
  'A-': {
    canDonateTo: ['A-', 'A+', 'AB-', 'AB+'],
    canReceiveFrom: ['A-', 'O-'],
    fact: 'Only ~2% of people have A- blood. Your donation is vital for specialized emergency transfusions.'
  },
  'B+': {
    canDonateTo: ['B+', 'AB+'],
    canReceiveFrom: ['B+', 'B-', 'O+', 'O-'],
    fact: 'B+ is especially prevalent in South Asia and plays an enormous role in local hospital blood banks.'
  },
  'B-': {
    canDonateTo: ['B-', 'B+', 'AB-', 'AB+'],
    canReceiveFrom: ['B-', 'O-'],
    fact: 'B- is extremely rare (~1.5% of population). Blood banks constantly face shortages of B- units.'
  },
  'AB+': {
    canDonateTo: ['AB+'],
    canReceiveFrom: ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'],
    fact: 'Universal Recipient! People with AB+ can safely receive red blood cells from any blood group.'
  },
  'AB-': {
    canDonateTo: ['AB-', 'AB+'],
    canReceiveFrom: ['AB-', 'A-', 'B-', 'O-'],
    fact: 'The rarest blood type in the world (less than 1%). Every single unit donated is celebrated.'
  }
};

function initBloodMatcher() {
  const bloodButtons = document.querySelectorAll('.blood-type-tile, .blood-btn');
  const donateListEl = document.getElementById('can-donate-to-list');
  const receiveListEl = document.getElementById('can-receive-from-list');
  const factEl = document.getElementById('blood-fun-fact');

  function renderBloodInfo(type) {
    const data = bloodData[type];
    if (!data) return;

    // Render Can Donate To
    donateListEl.innerHTML = data.canDonateTo.map(group => {
      const isUniversal = group === 'All' || data.canDonateTo.length >= 8;
      return `<span class="badge-can ${isUniversal ? 'badge-universal' : ''}">${group}</span>`;
    }).join(' ');

    // Render Can Receive From
    receiveListEl.innerHTML = data.canReceiveFrom.map(group => {
      return `<span class="badge-can">${group}</span>`;
    }).join(' ');

    // Fact / Clinical guidance
    factEl.innerHTML = `<strong>Clinical Note:</strong> <em>${data.fact}</em>`;
  }

  bloodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      bloodButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      const selectedType = btn.getAttribute('data-type');
      renderBloodInfo(selectedType);
    });
  });

  // Default display O+
  renderBloodInfo('O+');
}

// -------------------------------------------------------------
// 3. ELIGIBILITY QUIZ WIZARD
// -------------------------------------------------------------
function initEligibilityQuiz() {
  const questions = [
    {
      step: 'Step 1 of 4',
      text: 'Are you between 18 and 65 years of age?',
      idealAnswer: true
    },
    {
      step: 'Step 2 of 4',
      text: 'Do you weigh at least 45 kg (99 lbs)?',
      idealAnswer: true
    },
    {
      step: 'Step 3 of 4',
      text: 'Have you donated blood within the last 90 days?',
      idealAnswer: false // must be false to donate
    },
    {
      step: 'Step 4 of 4',
      text: 'Are you currently free from active fever, flu, or recent major surgery?',
      idealAnswer: true
    }
  ];

  let currentStep = 0;

  const quizBox = document.getElementById('quiz-box');
  const quizStep = document.getElementById('quiz-step');
  const quizQuestion = document.getElementById('quiz-question');
  const btnYes = document.getElementById('quiz-btn-yes');
  const btnNo = document.getElementById('quiz-btn-no');
  const quizResult = document.getElementById('quiz-result');
  const resultIcon = document.getElementById('result-icon');
  const resultTitle = document.getElementById('result-title');
  const resultDesc = document.getElementById('result-desc');
  const restartBtn = document.getElementById('quiz-restart-btn');

  function renderQuestion() {
    if (currentStep < questions.length) {
      quizBox.style.display = 'block';
      quizResult.style.display = 'none';
      quizStep.textContent = questions[currentStep].step;
      quizQuestion.textContent = questions[currentStep].text;
    }
  }

  function handleAnswer(userAnswer) {
    const q = questions[currentStep];
    const isPass = (userAnswer === q.idealAnswer);

    if (!isPass) {
      showResult(false);
      return;
    }

    currentStep++;
    if (currentStep < questions.length) {
      renderQuestion();
    } else {
      showResult(true);
    }
  }

  function showResult(eligible) {
    quizBox.style.display = 'none';
    quizResult.style.display = 'block';

    if (eligible) {
      quizResult.className = 'quiz-result-box';
      resultIcon.textContent = '🎉';
      resultTitle.textContent = 'Congratulations, You Are Eligible!';
      resultDesc.textContent = 'You satisfy standard medical criteria for whole blood donation. Please proceed to book your preferred time slot for 30th October!';
    } else {
      quizResult.className = 'quiz-result-box ineligible';
      resultIcon.textContent = 'ℹ️';
      resultTitle.textContent = 'Temporary Medical Deferral';
      resultDesc.textContent = 'Based on clinical guidelines, you may need to wait before donating. Feel free to consult with Red Cross doctors on-site at City Hall for an evaluation.';
    }
  }

  btnYes.addEventListener('click', () => handleAnswer(true));
  btnNo.addEventListener('click', () => handleAnswer(false));

  restartBtn.addEventListener('click', () => {
    currentStep = 0;
    renderQuestion();
  });

  renderQuestion();
}

// -------------------------------------------------------------
// 4. DONOR REGISTRATION, PLEDGES & PASS GENERATION
// -------------------------------------------------------------
const defaultPledges = [
  { name: 'Dr. Ramesh Kulkarni', wing: 'Wing A - 302', blood: 'O+', slot: '09:00 AM - 10:00 AM' },
  { name: 'Priya Narayanan', wing: 'Wing C - 1104', blood: 'B+', slot: '10:00 AM - 11:00 AM' },
  { name: 'Sunil (Secretary)', wing: 'Wing B - 201', blood: 'O-', slot: '09:00 AM - 10:00 AM' },
  { name: 'Vikram Joshi', wing: 'Wing D - 501', blood: 'A+', slot: '11:00 AM - 12:00 PM' },
  { name: 'Ananya Deshmukh', wing: 'Wing F - 703', blood: 'AB+', slot: '02:00 PM - 03:00 PM' }
];

function initRegistrationAndPledges() {
  const form = document.getElementById('donor-form');
  const pledgeWallList = document.getElementById('pledge-wall-list');
  const liveCountEl = document.getElementById('live-pledge-count');
  const liveLivesEl = document.getElementById('live-lives-count');
  const progressBar = document.getElementById('progress-bar');
  const progressPercent = document.getElementById('progress-percent');

  // Modal elements
  const modal = document.getElementById('pass-modal');
  const passName = document.getElementById('pass-name');
  const passId = document.getElementById('pass-id');
  const passFlat = document.getElementById('pass-flat');
  const passBlood = document.getElementById('pass-blood');
  const passSlot = document.getElementById('pass-slot');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnPrintPass = document.getElementById('btn-print-pass');

  // Load from localStorage or set defaults
  let storedDonors = [];
  try {
    const raw = localStorage.getItem('avm_blood_donors_2026');
    if (raw) {
      storedDonors = JSON.parse(raw);
    }
  } catch (e) {
    console.warn('LocalStorage error', e);
  }

  const initialBaseCount = 48; // starting simulated pledges
  let totalCount = initialBaseCount + storedDonors.length;

  function updateMetrics() {
    liveCountEl.textContent = totalCount;
    liveLivesEl.textContent = totalCount * 3;
    const target = 150;
    const pct = Math.min(100, Math.round((totalCount / target) * 100));
    progressBar.style.width = pct + '%';
    progressPercent.textContent = `${pct}% of Goal Reached (${totalCount}/150)`;
  }

  function renderPledges() {
    const combined = [...storedDonors.slice().reverse(), ...defaultPledges];
    pledgeWallList.innerHTML = combined.slice(0, 6).map(item => {
      const initials = item.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
      return `
        <div class="pledge-item">
          <div class="pledge-user">
            <div class="pledge-avatar">${initials}</div>
            <div class="pledge-details">
              <strong>${item.name}</strong>
              <span>${item.wing} • ${item.slot}</span>
            </div>
          </div>
          <span class="pledge-badge">${item.blood}</span>
        </div>
      `;
    }).join('');
  }

  updateMetrics();
  renderPledges();

  // Form Submit Handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('donor-name').value.trim();
    const phone = document.getElementById('donor-phone').value.trim();
    const wing = document.getElementById('donor-wing').value.trim();
    const blood = document.getElementById('donor-blood').value;
    const slot = document.getElementById('donor-slot').value;
    const email = document.getElementById('donor-email').value.trim();

    if (!name || !phone || !wing || !blood || !slot) {
      showToast('Please fill out all required fields.');
      return;
    }

    const passNumber = 48 + storedDonors.length + 1;
    const generatedPassId = 'AVM-2026-' + String(passNumber).padStart(3, '0');

    const newDonor = {
      id: generatedPassId,
      name,
      phone,
      wing,
      blood,
      slot,
      email,
      registeredAt: new Date().toISOString()
    };

    storedDonors.push(newDonor);
    try {
      localStorage.setItem('avm_blood_donors_2026', JSON.stringify(storedDonors));
    } catch (err) {
      console.error(err);
    }

    totalCount++;
    updateMetrics();
    renderPledges();

    // Populate Pass Modal
    passName.textContent = name;
    passId.textContent = generatedPassId;
    passFlat.textContent = wing;
    passBlood.textContent = blood;
    passSlot.textContent = slot;

    modal.classList.add('open');
    showToast(`Slot registered for ${name}! Pass generated.`);
    form.reset();
  });

  // Modal actions
  btnCloseModal.addEventListener('click', () => {
    modal.classList.remove('open');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
    }
  });

  btnPrintPass.addEventListener('click', () => {
    window.print();
  });
}

// -------------------------------------------------------------
// 5. FAQ ACCORDION
// -------------------------------------------------------------
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn, .faq-question');
    const answerEl = item.querySelector('.faq-answer-drawer, .faq-answer');
    if (!questionBtn || !answerEl) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question-btn, .faq-question');
          const otherAns = otherItem.querySelector('.faq-answer-drawer, .faq-answer');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherAns) otherAns.style.maxHeight = null;
        }
      });

      // Toggle current
      if (isActive) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
        answerEl.style.maxHeight = null;
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
        answerEl.style.maxHeight = answerEl.scrollHeight + 'px';
      }
    });
  });
}

// -------------------------------------------------------------
// 6. TOAST NOTIFICATION UTILITY
// -------------------------------------------------------------
function showToast(message) {
  const toast = document.getElementById('toast-notification');
  const msgEl = document.getElementById('toast-message');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
