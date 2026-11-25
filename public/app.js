import { videos } from './videos.js';
import { photos, places } from './places.js';
import { ideas, ideaThumbnail } from './ideas.js';

const find = (selector) => document.querySelector(selector);
const element = (tag, text, className) => {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
};

const themeToggle = find('#theme-toggle');
const systemDark = matchMedia('(prefers-color-scheme: dark)');
let themePreference;
try { themePreference = localStorage.getItem('hukus-theme'); } catch {}

function setTheme(dark) {
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.querySelector('meta[name="theme-color"]').content = dark ? '#171f19' : '#fcf7eb';
  themeToggle.setAttribute('aria-pressed', String(dark));
  themeToggle.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} mode`);
  themeToggle.querySelector('use').setAttribute('href', dark ? '#icon-sun' : '#icon-moon');
}

setTheme(themePreference ? themePreference === 'dark' : systemDark.matches);
systemDark.addEventListener('change', ({ matches }) => { if (!themePreference) setTheme(matches); });
themeToggle.addEventListener('click', () => {
  const dark = document.documentElement.dataset.theme !== 'dark';
  themePreference = dark ? 'dark' : 'light';
  setTheme(dark);
  try { localStorage.setItem('hukus-theme', themePreference); } catch {}
});

const videoGrid = find('#video-grid');
const videoSearch = find('#video-search');
const moreButton = find('#more-videos');
const playerDialog = find('#player-dialog');
const playerFrame = find('#player-frame');
const compact = matchMedia('(max-width: 760px)');
const canHover = matchMedia('(hover: hover) and (pointer: fine)');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const filterButtons = [...document.querySelectorAll('[data-filter]')];
const featuredTitles = {
  o76NltZjNfg: 'The amazing human body',
  'K-R17UkmuGU': 'Why girls’ education matters',
  FyPGkJ5HvBE: 'Safari counting adventure',
  tsUv8_GyW4E: 'Know your blood pressure',
  uc6RRmxJHwk: 'First aid at home',
  'm-cS82uu02I': 'Cold vs. flu',
};

let selectedFilter = 'all';
let extraPages = 0;
let previewTimer;
let previewFrame;
let previewMedia;

function videoTitle(video) {
  return featuredTitles[video.id] || video.title.replace(/^HUKUS BUKUS\s*/i, '').replace(/^Tales for Kids\s*\|?\s*/i, '').trim() || video.title;
}

function iframeFor(video, preview = false) {
  const iframe = element('iframe');
  iframe.src = `https://www.youtube-nocookie.com/embed/${video.id}?${preview ? 'autoplay=1&mute=1&controls=0&playsinline=1&loop=1&playlist=' + video.id : 'autoplay=1&playsinline=1&rel=0'}`;
  iframe.title = preview ? `Muted preview: ${videoTitle(video)}` : videoTitle(video);
  iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
  iframe.allowFullscreen = !preview;
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  if (preview) {
    iframe.tabIndex = -1;
    iframe.setAttribute('aria-hidden', 'true');
  }
  return iframe;
}

function endPreview() {
  clearTimeout(previewTimer);
  previewFrame?.remove();
  previewMedia?.classList.remove('is-playing');
  previewFrame = null;
  previewMedia = null;
}

function playVideo(video) {
  endPreview();
  find('#player-title').textContent = videoTitle(video);
  find('#youtube-fallback').href = `https://www.youtube.com/watch?v=${video.id}`;
  playerFrame.replaceChildren(iframeFor(video));
  playerDialog.showModal();
}

function videoCard(video) {
  const card = element('article', null, 'video-card');
  const media = element('div', null, 'video-media');
  const thumbnail = element('img');
  thumbnail.src = `https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`;
  thumbnail.alt = '';
  thumbnail.width = 320;
  thumbnail.height = 180;
  thumbnail.loading = 'lazy';
  thumbnail.addEventListener('error', () => { thumbnail.src = '/img/hukus-bukus.jpg'; }, { once: true });

  const button = element('button', null, 'video-open');
  button.type = 'button';
  button.setAttribute('aria-label', `Play ${videoTitle(video)}`);
  button.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#icon-youtube"/></svg>';
  button.addEventListener('click', () => playVideo(video));
  media.append(thumbnail, button);

  card.addEventListener('pointerenter', (event) => {
    if (event.pointerType !== 'mouse' || !canHover.matches || reducedMotion.matches || playerDialog.open) return;
    endPreview();
    previewMedia = media;
    previewTimer = setTimeout(() => {
      previewFrame = iframeFor(video, true);
      previewFrame.addEventListener('load', () => {
        if (previewMedia === media) media.classList.add('is-playing');
      }, { once: true });
      media.insertBefore(previewFrame, button);
    }, 450);
  });
  card.addEventListener('pointerleave', () => { if (previewMedia === media) endPreview(); });

  const info = element('div', null, 'video-info');
  info.append(element('small', video.category), element('h3', videoTitle(video)));
  card.append(media, info);
  return card;
}

function renderVideos(append = false) {
  endPreview();
  const query = videoSearch.value.trim().toLowerCase();
  const filtered = videos.filter((video) => (selectedFilter === 'all' || video.category === selectedFilter)
    && `${video.title} ${videoTitle(video)} ${video.category}`.toLowerCase().includes(query));
  const perPage = compact.matches ? 4 : 6;
  const count = Math.min(filtered.length, perPage * (extraPages + 1));
  const start = append ? videoGrid.childElementCount : 0;
  const cards = filtered.slice(start, count).map(videoCard);
  if (append) videoGrid.append(...cards);
  else videoGrid.replaceChildren(...cards);
  if (!count) videoGrid.append(element('p', 'No videos match. Try a different search or category.', 'empty-grid'));
  moreButton.hidden = count === filtered.length;
  find('#video-status').textContent = `Showing ${count} of ${filtered.length} videos.`;
  if (append && moreButton.hidden) cards[0]?.querySelector('button').focus();
}

filterButtons.forEach((button) => button.addEventListener('click', () => {
  selectedFilter = button.dataset.filter;
  extraPages = 0;
  filterButtons.forEach((filter) => filter.setAttribute('aria-pressed', String(filter === button)));
  renderVideos();
}));
videoSearch.addEventListener('input', () => { extraPages = 0; renderVideos(); });
moreButton.addEventListener('click', () => { extraPages += 1; renderVideos(true); });
compact.addEventListener('change', () => renderVideos());
reducedMotion.addEventListener('change', endPreview);
document.addEventListener('visibilitychange', () => { if (document.hidden) endPreview(); });
playerDialog.addEventListener('close', () => playerFrame.replaceChildren());
renderVideos();

function photoFor(key) {
  const image = element('img');
  image.alt = photos[key][0];
  image.src = `/img/${key}.webp`;
  image.loading = 'lazy';
  image.decoding = 'async';
  return image;
}

function externalLink(label, url) {
  const link = element('a', label);
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  return link;
}

const placeDialog = find('#place-dialog');
function showPlace(place) {
  find('#place-area').textContent = place.area.toUpperCase();
  find('#place-title').textContent = place.name;
  find('#place-description').textContent = place.description;
  const stops = place.stops.map((stop) => {
    const card = element('article', null, 'stop');
    const image = photoFor(stop.photo);
    image.loading = 'eager';
    if (stop.contain) image.classList.add('contain-photo');
    const copy = element('div');
    copy.append(element('h3', stop.name), element('p', stop.description), externalLink('Open in Maps ↗', `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.map)}`));
    card.append(image, copy);
    return card;
  });
  find('#place-stops').replaceChildren(...stops);
  placeDialog.showModal();
  placeDialog.scrollTop = 0;
}

const placesGrid = find('#places-grid');
places.forEach((place, index) => {
  const card = element('article', null, 'place-card');
  const figure = element('figure');
  const count = element('span', String(index + 1).padStart(2, '0'), 'place-count');
  count.setAttribute('aria-hidden', 'true');
  figure.append(photoFor(place.photo), count);
  const info = element('div', null, 'place-info');
  const button = element('button', 'Touring places');
  button.type = 'button';
  button.setAttribute('aria-label', `Touring places: ${place.name}`);
  button.setAttribute('aria-haspopup', 'dialog');
  button.insertAdjacentHTML('beforeend', '<svg class="icon" aria-hidden="true"><use href="#icon-arrow"/></svg>');
  button.addEventListener('click', () => showPlace(place));
  info.append(element('small', place.area), element('h3', place.name), element('p', place.near), button);
  card.append(figure, info);
  placesGrid.append(card);
});

const photoCredits = find('#photo-credits');
Object.values(photos).forEach(([name, author, source, license, licenseUrl]) => {
  const credit = element('li');
  credit.append(externalLink(name, source), ` — ${author}`);
  if (license) credit.append(' (', externalLink(license, licenseUrl), '; resized for the web)');
  photoCredits.append(credit);
});

for (const dialog of [playerDialog, placeDialog]) {
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
}

let ideaIndex = 0;
function updateIdea() {
  const idea = ideas[ideaIndex];
  find('#idea-count').textContent = `CREATIVE MISSION / ${String(ideaIndex + 1).padStart(2, '0')} OF ${String(ideas.length).padStart(2, '0')}`;
  find('#idea-text').textContent = `${idea.title} ${idea.prompt}`;
  find('#idea-urdu').textContent = idea.urdu;
  find('#idea-art').innerHTML = ideaThumbnail(idea);
}

find('#new-idea').addEventListener('click', () => { ideaIndex = (ideaIndex + 1) % ideas.length; updateIdea(); });
updateIdea();

const reviewFeed = find('#review-feed');
const dateFormat = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeZone: 'Asia/Kolkata' });
async function loadReviews() {
  try {
    const response = await fetch('/api/reviews', { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error();
    const { reviews } = await response.json();
    const entries = reviews.map((review) => {
      const article = element('article', null, 'review-entry');
      const title = element('header');
      const time = element('time', dateFormat.format(new Date(review.createdAt)));
      time.dateTime = review.createdAt;
      title.append(element('strong', review.name), time);
      const message = element('p', review.message);
      message.dir = 'auto';
      article.append(title, message);
      return article;
    });
    reviewFeed.replaceChildren(...(entries.length ? entries : [element('p', 'No comments yet. Leave the first one!')]));
  } catch {
    const note = element('p', 'Comments couldn’t load. ');
    const retry = element('button', 'Try again', 'retry-button');
    retry.type = 'button';
    retry.addEventListener('click', () => { retry.disabled = true; loadReviews(); });
    note.append(retry);
    reviewFeed.replaceChildren(note);
  }
}

function connectForm(form, endpoint, successMessage) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = form.querySelector('button');
    const status = form.querySelector('.form-status');
    const submission = Object.fromEntries(new FormData(form));
    button.disabled = true;
    delete status.dataset.error;
    status.textContent = 'Sending…';
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(submission) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      form.reset();
      status.textContent = successMessage;
    } catch (error) {
      status.dataset.error = 'true';
      status.textContent = error.message && !/JSON|fetch|Unexpected/i.test(error.message) ? error.message : 'Your message couldn’t be sent. Please try again.';
    } finally {
      button.disabled = false;
    }
  });
}

connectForm(find('#review-form'), '/api/reviews', 'Thank you! Your comment was sent and will appear after review.');
connectForm(find('#feedback-form'), '/api/feedback', 'Thank you! Your message was sent privately to the Hukus Bukus team.');
loadReviews();
find('#year').textContent = new Date().getFullYear();
