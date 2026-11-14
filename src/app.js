import { project, books, team, animalFlashcards } from './data.js';
import { answerQuiz, audioSequence, buildQuizQuestions } from './animal-learning.js';
import { getRoute } from './router.js';

const $ = (selector) => document.querySelector(selector);
function getVisitCount() {
  try {
    const visits = Number(window.localStorage.getItem('snail-visits') || 0) + 1;
    window.localStorage.setItem('snail-visits', String(visits));
    return visits;
  } catch {
    return 1;
  }
}

async function updateVisitCount() {
  try {
    const response = await fetch('/api/visits');
    if (!response.ok) throw new Error('visit counter unavailable');
    const result = await response.json();
    const count = typeof result.data === 'number' ? result.data : result.data?.up_count ?? result.value ?? result.count;
    if (typeof count !== 'number') throw new Error('invalid visit counter response');
    $('#visit-count').textContent = count.toLocaleString('zh-TW');
  } catch {
    $('#visit-count').textContent = getVisitCount().toLocaleString('zh-TW');
  }
}

const state = { visits: 0, selectedBook: null, animalIndex: 0, autoplay: false, audio: null, quiz: null };
const menuToggle = $('.menu-toggle');
const mainNav = $('#main-nav');

menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

mainNav.addEventListener('click', () => {
  mainNav.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
});

function renderBooks() {
  $('#book-grid').innerHTML = books.map((book) => `
    <article class="book-card">
      <a class="cover-button" href="${book.onlineReaderUrl}" target="_blank" rel="noreferrer" aria-label="線上閱讀《蝸牛 ${book.title}》">
        <img src="${book.cover}" alt="《蝸牛 ${book.title}》封面">
      </a>
      <div class="book-card__body">
        <p class="eyebrow">${book.language}</p>
        <h3>蝸牛 ${book.title}</h3>
        <div class="book-actions">
          <a class="text-button" href="${book.onlineReaderUrl}" target="_blank" rel="noreferrer">線上閱讀繪本</a>
        </div>
      </div>
    </article>
  `).join('');
}

function renderAudio() {
  $('#audio-grid').innerHTML = books.map((book) => `
    <article class="audio-card">
      <img src="${book.cover}" alt="《蝸牛 ${book.title}》封面">
      <div class="audio-card__body"><p class="eyebrow">${book.language}</p><h3>蝸牛 ${book.title}</h3>${book.youtubeUrl ? `<a class="audio-link" href="${book.youtubeUrl}" target="_blank" rel="noreferrer">觀看有聲繪本</a>` : '<span class="audio-link is-disabled">有聲影片準備中</span>'}</div>
    </article>
  `).join('');
}

function renderTeam() {
  $('#team-list').innerHTML = team.map(([people, roles]) => `<p><strong>${people}</strong>｜${roles}</p>`).join('');
}

function stopAudio() {
  if (state.audio) state.audio.pause();
  state.audio = null;
}

function playAudio(source, onEnded) {
  stopAudio();
  state.audio = new Audio(source);
  state.audio.onended = onEnded;
  state.audio.play().catch(() => {});
}

function playAnimalSequence() {
  const [wordAudio, sentenceAudio] = audioSequence(animalFlashcards[state.animalIndex]);
  playAudio(wordAudio, () => {
    if (state.autoplay) playAudio(sentenceAudio);
  });
}

function renderAnimalCard() {
  const card = animalFlashcards[state.animalIndex];
  $('#flashcard-image').src = card.image;
  $('#flashcard-image').alt = card.translation;
  $('#flashcard-word').textContent = card.word;
  $('#flashcard-sentence').textContent = card.sentence;
  $('#flashcard-translation').textContent = card.translation;
  $('#flashcard-translation').hidden = true;
  $('#flashcard-progress').textContent = `${state.animalIndex + 1} / ${animalFlashcards.length}`;
  if (state.autoplay) playAnimalSequence();
}

function renderQuizQuestion() {
  const quiz = state.quiz;
  const question = quiz.questions[quiz.questionIndex];
  if (!question) {
    $('#quiz-progress').textContent = '完成';
    $('#quiz-feedback').textContent = `你答對 ${quiz.score} / ${quiz.questions.length} 題。`;
    $('#quiz-score').textContent = '恭喜完成 10 題聽音選圖！';
    $('#quiz-choices').innerHTML = '';
    return;
  }
  $('#quiz-progress').textContent = `第 ${quiz.questionIndex + 1} / ${quiz.questions.length} 題`;
  $('#quiz-feedback').textContent = '';
  $('#quiz-score').textContent = '';
  $('#quiz-choices').innerHTML = question.choices.map((card) => `<button class="quiz-choice" type="button" data-choice-id="${card.id}"><img src="${card.image}" alt="${card.translation}"><span>選這張圖片</span></button>`).join('');
  $('#quiz-choices').querySelectorAll('[data-choice-id]').forEach((button) => {
    button.addEventListener('click', () => {
      state.quiz = answerQuiz(state.quiz, button.dataset.choiceId);
      renderQuizQuestion();
    });
  });
  playAudio(question.promptAudio);
}

function startQuiz() {
  stopAudio();
  state.quiz = { questions: buildQuizQuestions(animalFlashcards), questionIndex: 0, score: 0, complete: false };
  $('#flashcard-area').hidden = true;
  $('#quiz-panel').hidden = false;
  renderQuizQuestion();
}

$('#autoplay-toggle').addEventListener('change', (event) => {
  state.autoplay = event.target.checked;
  if (state.autoplay) playAnimalSequence();
  else stopAudio();
});
$('#play-word').addEventListener('click', () => playAudio(animalFlashcards[state.animalIndex].wordAudio));
$('#play-sentence').addEventListener('click', () => playAudio(animalFlashcards[state.animalIndex].sentenceAudio));
$('#flip-card').addEventListener('click', () => { $('#flashcard-translation').hidden = !$('#flashcard-translation').hidden; });
$('#previous-card').addEventListener('click', () => { state.animalIndex = (state.animalIndex - 1 + animalFlashcards.length) % animalFlashcards.length; renderAnimalCard(); });
$('#next-card').addEventListener('click', () => { state.animalIndex = (state.animalIndex + 1) % animalFlashcards.length; renderAnimalCard(); });
$('#start-quiz').addEventListener('click', startQuiz);
$('#quiz-play').addEventListener('click', () => { const question = state.quiz?.questions[state.quiz.questionIndex]; if (question) playAudio(question.promptAudio); });
$('#restart-quiz').addEventListener('click', startQuiz);

function showRoute() {
  const route = getRoute(window.location.hash);
  document.querySelectorAll('[data-screen]').forEach((screen) => {
    screen.classList.toggle('is-active', screen.dataset.screen === route.name);
  });
  window.scrollTo({ top: 0, behavior: 'instant' });
}

window.addEventListener('hashchange', showRoute);

$('#project-name').textContent = project.siteName;
$('#grant-name').textContent = project.grantName;
$('#grant-unit').textContent = `補助單位：${project.grantUnit}`;
$('#grant-text').textContent = project.grantText;
$('#intro-copy').innerHTML = project.intro.split('\n\n').map((p) => `<p>${p}</p>`).join('');
$('#background-copy').innerHTML = project.background.split('\n\n').map((p) => `<p>${p}</p>`).join('');
$('#purpose-copy').innerHTML = project.purpose.split('\n\n').map((p) => `<p>${p}</p>`).join('');
$('#goals-copy').innerHTML = project.goals.map(([title, text], index) => `<article><strong>${index + 1}. ${title}</strong><p>${text}</p></article>`).join('');
$('#design-copy').innerHTML = project.design.split('\n\n').map((p) => `<p>${p}</p>`).join('');
$('#copyright-copy').textContent = project.copyright;
$('#visit-count').textContent = '載入中';
renderBooks();
renderAudio();
renderTeam();
renderAnimalCard();
showRoute();
updateVisitCount();
