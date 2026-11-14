export function audioSequence(card) {
  return [card.wordAudio, card.sentenceAudio];
}

export function buildQuizQuestions(cards) {
  return cards.map((card, index) => ({
    id: `question-${index + 1}`,
    targetId: card.id,
    promptAudio: index % 2 === 0 ? card.wordAudio : card.sentenceAudio,
    choices: [card, cards[(index + 1) % cards.length], cards[(index + 2) % cards.length]],
  }));
}

export function answerQuiz(quiz, choiceId) {
  if (quiz.complete) return quiz;
  const question = quiz.questions[quiz.questionIndex];
  const correct = choiceId === question.targetId;
  const nextIndex = quiz.questionIndex + 1;
  return { ...quiz, score: quiz.score + (correct ? 1 : 0), questionIndex: nextIndex, complete: nextIndex >= quiz.questions.length, feedback: correct ? '答對了！' : '再聽一次，答案是正確圖片。' };
}
