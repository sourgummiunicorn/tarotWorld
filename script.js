/* The Quiet Arcana — all content and interactions run locally, with no API required. */
const cards = [
  { name: 'The Fool', glyph: '♧', upright: 'A new beginning, open-hearted curiosity, and the courage to take a first step.', reversed: 'Hesitation or impulsiveness; pause long enough to make your next step your own.' },
  { name: 'The Magician', glyph: '✧', upright: 'Resourcefulness, focused intention, and the tools to turn an idea into action.', reversed: 'Scattered energy or untapped ability; bring your attention back to what you can shape.' },
  { name: 'The High Priestess', glyph: '☾', upright: 'Intuition, inner knowing, and wisdom that becomes clearer in quiet.', reversed: 'A muted inner voice or too much noise; make room to hear what you already sense.' },
  { name: 'The Empress', glyph: '❀', upright: 'Nurturing, creativity, and the patient conditions in which something can flourish.', reversed: 'Care may be flowing outward too freely; tend to your own needs as well.' },
  { name: 'The Emperor', glyph: '♜', upright: 'Steady structure, healthy boundaries, and leadership grounded in responsibility.', reversed: 'A need to loosen rigid rules or reconsider where control is being held too tightly.' },
  { name: 'The Hierophant', glyph: '⚝', upright: 'Shared wisdom, meaningful traditions, and learning from a trusted source.', reversed: 'A chance to question inherited rules and find a path that feels more authentic.' },
  { name: 'The Lovers', glyph: '♡', upright: 'Connection, alignment, and choices guided by honest values.', reversed: 'A disconnect between desire and values; invite clarity and honest conversation.' },
  { name: 'The Chariot', glyph: '✦', upright: 'Determination, purposeful momentum, and holding competing forces in balance.', reversed: 'Progress may feel pulled in different directions; choose a course before accelerating.' },
  { name: 'Strength', glyph: '∞', upright: 'Gentle courage, patience, and the power of meeting difficulty with compassion.', reversed: 'Self-doubt or depleted reserves; kindness toward yourself can be its own courage.' },
  { name: 'The Hermit', glyph: '☼', upright: 'Reflection, a useful retreat, and the insight found by looking inward.', reversed: 'Solitude may have lasted long enough; consider letting a trusted person in.' },
  { name: 'Wheel of Fortune', glyph: '◉', upright: 'A turning point, changing circumstances, and the rhythms no one can fully control.', reversed: 'A frustrating pause or repeating pattern; notice what is within your influence.' },
  { name: 'Justice', glyph: '⚖', upright: 'Fairness, clear-eyed choices, and taking responsibility for what follows.', reversed: 'An imbalance deserves attention; look carefully at the facts and your own part.' },
  { name: 'The Hanged One', glyph: '⟡', upright: 'A deliberate pause and the fresh perspective that comes from seeing things differently.', reversed: 'Stagnation or resistance; ask whether a small change in viewpoint could release you.' },
  { name: 'Death', glyph: '✿', upright: 'An ending that makes room for transformation and a more honest beginning.', reversed: 'A transition may be resisted or unfinished; release can happen one small step at a time.' },
  { name: 'Temperance', glyph: '⚗', upright: 'Patient integration, moderation, and the art of finding a workable middle ground.', reversed: 'Something feels out of balance; adjust gently rather than demanding instant resolution.' },
  { name: 'The Devil', glyph: '⛓', upright: 'Recognizing a binding habit or attachment is the first step toward reclaiming choice.', reversed: 'A pattern may be loosening; keep choosing the freedom you are beginning to see.' },
  { name: 'The Tower', glyph: 'ϟ', upright: 'A sudden truth or shake-up can reveal what was never as steady as it seemed.', reversed: 'Change may be building quietly; face what you can now, before pressure decides for you.' },
  { name: 'The Star', glyph: '☆', upright: 'Renewed hope, gentle restoration, and trust in the possibility of healing.', reversed: 'Hope may feel distant; take one small nourishing action without forcing certainty.' },
  { name: 'The Moon', glyph: '☽', upright: 'Dreams, uncertainty, and feelings that ask to be explored rather than rushed past.', reversed: 'Confusion may be lifting; separate what you know from what you fear.' },
  { name: 'The Sun', glyph: '☀', upright: 'Warmth, vitality, and the simple clarity of letting yourself be seen.', reversed: 'Joy may be present but hard to reach; soften expectations and notice small brightness.' },
  { name: 'Judgement', glyph: '♧', upright: 'A call to take stock, forgive what can be released, and answer a deeper purpose.', reversed: 'Harsh self-judgment can cloud a new chapter; let reflection be honest, not punishing.' },
  { name: 'The World', glyph: '◎', upright: 'Completion, belonging, and the satisfaction of bringing a meaningful cycle together.', reversed: 'A chapter may be close but not quite complete; identify the final piece that needs care.' }
];
const positions = ['Past', 'Present', 'Future'];
const topicNames = { general: 'your wider path', love: 'love and connection', career: 'work and purpose', growth: 'your personal growth' };
const topicPrompts = {
  general: 'Your wider path may be asking for a little more trust in your own pace.',
  love: 'In matters of connection, consider how honesty and care can make room for a bond that feels mutual.',
  career: 'Around work and purpose, notice where your effort can meet a direction that feels genuinely yours.',
  growth: 'For your personal growth, the invitation may be to meet change with curiosity rather than a fixed idea of who you must become.'
};
const state = { deck: [], selected: [], topic: 'general' };
const $ = (id) => document.getElementById(id);
const topic = $('topic');
const shuffleButton = $('shuffle-button');
const restartButton = $('restart-button');
const status = $('status');
const emptyState = $('empty-state');
const selectionArea = $('selection-area');
const deckElement = $('deck');
const spread = $('spread');
const fortune = $('fortune');

function shuffledDeck() {
  const deck = cards.map((card, index) => ({ ...card, id: index, reversed: Math.random() < 0.32 }));
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function startReading() {
  state.deck = shuffledDeck();
  state.selected = [];
  state.topic = topic.value;
  emptyState.hidden = true;
  spread.hidden = true;
  spread.replaceChildren();
  fortune.hidden = true;
  $('fortune-text').textContent = '';
  selectionArea.hidden = false;
  restartButton.hidden = true;
  renderDeck();
  updateSelectionStatus();
}

function renderDeck() {
  deckElement.replaceChildren();
  state.deck.forEach((card, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'deck-card';
    button.setAttribute('aria-label', `Choose face-down card ${index + 1}`);
    button.addEventListener('click', () => selectCard(card, button));
    deckElement.append(button);
  });
}

function selectCard(card, button) {
  if (state.selected.length >= 3 || state.selected.some((chosen) => chosen.id === card.id)) return;
  state.selected.push(card);
  button.classList.add('chosen');
  button.disabled = true;
  button.setAttribute('aria-label', 'Card selected');
  updateSelectionStatus();
  if (state.selected.length === 3) showSpread();
}

function updateSelectionStatus() {
  const left = 3 - state.selected.length;
  $('remaining-count').textContent = left === 1 ? 'one more' : left === 2 ? 'two' : 'three';
  status.textContent = left ? `The cards will become Past, Present, and Future. ${left} ${left === 1 ? 'card' : 'cards'} left to choose.` : 'Your spread is ready. Turn each card when you feel ready.';
}

function showSpread() {
  selectionArea.hidden = true;
  spread.hidden = false;
  spread.replaceChildren();
  state.selected.forEach((card, index) => spread.append(createReadingCard(card, index)));
}

function createReadingCard(card, index) {
  const article = document.createElement('article');
  article.className = 'reading-card';
  const label = document.createElement('p');
  label.className = 'position-label';
  label.textContent = positions[index].toUpperCase();
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'flip-card';
  button.setAttribute('aria-label', `Reveal ${positions[index]} card`);
  const inner = document.createElement('span');
  inner.className = 'flip-inner';
  const back = document.createElement('span');
  back.className = 'card-face card-back';
  back.setAttribute('aria-hidden', 'true');
  const backSymbol = document.createElement('span');
  backSymbol.className = 'back-symbol'; backSymbol.textContent = '✳';
  const backCaption = document.createElement('span');
  backCaption.className = 'back-caption'; backCaption.textContent = 'TURN WHEN READY';
  back.append(backSymbol, backCaption);
  const front = document.createElement('span');
  front.className = `card-face card-front${card.reversed ? ' reversed' : ''}`;
  front.setAttribute('aria-hidden', 'true');
  const number = document.createElement('span'); number.className = 'card-number'; number.textContent = roman(card.id);
  const art = document.createElement('span'); art.className = 'card-art';
  const glyph = document.createElement('span'); glyph.className = 'card-glyph'; glyph.textContent = card.glyph;
  art.append(glyph);
  const title = document.createElement('span'); title.className = 'card-title'; title.textContent = card.name;
  const orientation = document.createElement('span'); orientation.className = 'orientation'; orientation.textContent = card.reversed ? 'Reversed' : 'Upright';
  front.append(number, art, title, orientation);
  inner.append(back, front); button.append(inner);
  const hint = document.createElement('p'); hint.className = 'reveal-hint'; hint.textContent = 'Tap to reveal';
  const interpretation = document.createElement('div'); interpretation.className = 'interpretation'; interpretation.hidden = true;
  const heading = document.createElement('h3'); heading.textContent = card.name;
  const meaning = document.createElement('p'); meaning.className = 'meaning-line'; meaning.textContent = card.reversed ? 'Reversed · a gentle invitation to look inward' : 'Upright · an energy to welcome';
  const description = document.createElement('p'); description.textContent = card.reversed ? card.reversed : card.upright;
  interpretation.append(heading, meaning, description);
  button.addEventListener('click', () => {
    if (button.classList.contains('is-revealed')) return;
    button.classList.add('is-revealed');
    button.setAttribute('aria-label', `${positions[index]}: ${card.name}, ${card.reversed ? 'reversed' : 'upright'}`);
    front.setAttribute('aria-hidden', 'false');
    interpretation.hidden = false;
    article.classList.add('revealed');
    status.textContent = allRevealed() ? 'All three cards are revealed. Your reading is below.' : `${positions[index]} revealed. Turn the remaining cards to discover your full reading.`;
    if (allRevealed()) finishReading();
  });
  article.append(label, button, hint, interpretation);
  return article;
}

function allRevealed() {
  return spread.querySelectorAll('.flip-card.is-revealed').length === 3;
}

function finishReading() {
  $('fortune-text').textContent = makeFortune();
  fortune.hidden = false;
  restartButton.hidden = false;
  status.textContent = 'Your reading is complete. Take a moment with what stands out.';
}

function makeFortune() {
  const [past, present, future] = state.selected;
  const meaning = (card) => card.reversed ? card.reversed : card.upright;
  const first = `In the Past, ${past.name}${past.reversed ? ' reversed' : ''} points to ${meaning(past).replace(/[.!?]$/, '').toLowerCase()}. That experience may still be shaping the way you approach ${topicNames[state.topic]}.`;
  const second = `Here in the Present, ${present.name}${present.reversed ? ' reversed' : ''} brings attention to ${meaning(present).replace(/[.!?]$/, '').toLowerCase()}. ${topicPrompts[state.topic]}`;
  const third = `Looking toward the Future, ${future.name}${future.reversed ? ' reversed' : ''} offers the possibility of ${meaning(future).replace(/[.!?]$/, '').toLowerCase()}. Rather than a fixed outcome, consider it an invitation: what small, honest choice could carry the wisdom of your past into this next step?`;
  return `${first} ${second} ${third}`;
}

function roman(number) {
  const numerals = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI'];
  return numerals[number] || '0';
}

function resetReading() {
  state.deck = [];
  state.selected = [];
  emptyState.hidden = false;
  selectionArea.hidden = true;
  spread.hidden = true;
  spread.replaceChildren();
  fortune.hidden = true;
  restartButton.hidden = true;
  status.textContent = 'Choose a focus, then shuffle to begin.';
}

shuffleButton.addEventListener('click', startReading);
restartButton.addEventListener('click', resetReading);
topic.addEventListener('change', () => {
  state.topic = topic.value;
  if (state.selected.length) status.textContent = 'Your focus has changed. Shuffle the deck to begin a fresh reading with this topic.';
});
