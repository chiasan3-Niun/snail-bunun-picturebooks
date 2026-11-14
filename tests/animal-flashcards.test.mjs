import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { animalFlashcards } from '../src/data.js';
import { answerQuiz, audioSequence, buildQuizQuestions } from '../src/animal-learning.js';

test('contains ten animal flashcards with image and audio assets', () => {
  assert.equal(animalFlashcards.length, 10);
  assert.equal(new Set(animalFlashcards.map((card) => card.id)).size, 10);
  for (const card of animalFlashcards) {
    assert.ok(card.word);
    assert.ok(card.sentence);
    assert.ok(card.translation);
    assert.equal(fs.existsSync(path.resolve(card.image)), true, `missing image: ${card.image}`);
    assert.equal(fs.existsSync(path.resolve(card.wordAudio)), true, `missing word audio: ${card.wordAudio}`);
    assert.equal(fs.existsSync(path.resolve(card.sentenceAudio)), true, `missing sentence audio: ${card.sentenceAudio}`);
  }
});

test('has three-choice-ready animal data', () => {
  assert.ok(animalFlashcards.length >= 3);
  assert.equal(new Set(animalFlashcards.map((card) => card.image)).size, 10);
});

test('includes flashcard and quiz controls in the page', () => {
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  for (const id of ['animal-learning', 'flashcard-image', 'play-word', 'play-sentence', 'autoplay-toggle', 'quiz-choices']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
});

test('keeps responsive animal learning styles', () => {
  const css = fs.readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
  assert.match(css, /animal-learning/);
  assert.match(css, /@media \(max-width:700px\)/);
});

test('audio sequence contains only the Bunun word and sentence', () => {
  assert.deepEqual(audioSequence(animalFlashcards[0]), [animalFlashcards[0].wordAudio, animalFlashcards[0].sentenceAudio]);
});

test('quiz has ten questions with three distinct picture choices', () => {
  const questions = buildQuizQuestions(animalFlashcards);
  assert.equal(questions.length, 10);
  for (const question of questions) assert.equal(new Set(question.choices.map((choice) => choice.id)).size, 3);
});

test('quiz answer advances and scores the selected picture', () => {
  const quiz = { questions: buildQuizQuestions(animalFlashcards), questionIndex: 0, score: 0, complete: false };
  const answered = answerQuiz(quiz, animalFlashcards[0].id);
  assert.equal(answered.score, 1);
  assert.equal(answered.questionIndex, 1);
  assert.equal(answered.complete, false);
});
