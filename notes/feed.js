const postList = document.querySelector('#post-list');
const postCount = document.querySelector('#post-count');
const filterButtons = [...document.querySelectorAll('[data-filter]')];
const posts = window.publicationPosts || [];
let selectedFilter = 'all';

const escapeHtml = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const renderMedia = media => {
  if (!media) return '';
  if (media.type === 'image') {
    return `<figure class="post-media"><img src="${escapeHtml(media.src)}" alt="${escapeHtml(media.alt || '')}" loading="lazy" /></figure>`;
  }
  if (media.type === 'video') {
    return `<figure class="post-media"><video controls preload="metadata"><source src="${escapeHtml(media.src)}" type="${escapeHtml(media.mime || 'video/mp4')}" /></video></figure>`;
  }
  if (media.type === 'embed') {
    return `<div class="post-media post-embed"><iframe src="${escapeHtml(media.src)}" title="${escapeHtml(media.title || 'Média intégré')}" loading="lazy" allowfullscreen></iframe></div>`;
  }
  return '';
};

const renderPosts = () => {
  const visiblePosts = posts.filter(post => selectedFilter === 'all' || post.type === selectedFilter);
  postCount.textContent = visiblePosts.length;
  if (!visiblePosts.length) {
    postList.innerHTML = '<p class="feed-empty">Aucune publication dans ce thème pour l’instant.</p>';
    return;
  }
  postList.innerHTML = visiblePosts.map(post => `
    <article class="post" data-post-id="${escapeHtml(post.id)}" data-type="${escapeHtml(post.type)}">
      <p class="post-meta">${escapeHtml(post.label)} · ${escapeHtml(post.readingTime)}</p>
      <h2><a href="${escapeHtml(post.href)}">${escapeHtml(post.title)}</a></h2>
      <p class="post-summary">${escapeHtml(post.summary)}</p>
      ${renderMedia(post.media)}
      ${post.project ? `<p class="post-project">Projet : <a href="${escapeHtml(post.project.href)}" target="_blank" rel="noopener">${escapeHtml(post.project.name)}</a></p>` : ''}
    </article>
  `).join('');
};

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    selectedFilter = button.dataset.filter;
    filterButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    renderPosts();
  });
});

renderPosts();
