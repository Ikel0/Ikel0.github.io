const postList = document.querySelector('#post-list');
const postCount = document.querySelector('#post-count');
const filterButtons = [...document.querySelectorAll('[data-filter]')];
const posts = window.publicationPosts || [];
let selectedFilter = 'all';

const formatDate = value => new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric', month: 'long', year: 'numeric'
}).format(new Date(`${value}T12:00:00`));

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
  postList.innerHTML = visiblePosts.map(post => `
    <article class="post" data-post-id="${escapeHtml(post.id)}" data-type="${escapeHtml(post.type)}">
      <header class="post-header">
        <div class="post-author"><span aria-hidden="true">IO</span><div><strong>Ikel Ouedraogo</strong><p>Data &amp; AI Engineer · France</p></div></div>
        <p class="post-meta">${escapeHtml(post.label)}<br /><time datetime="${escapeHtml(post.date)}">${formatDate(post.date)}</time></p>
      </header>
      <div class="post-copy">
        <h2><a href="${escapeHtml(post.href)}"${post.external ? ' target="_blank" rel="noopener"' : ''}>${escapeHtml(post.title)}</a></h2>
        <p>${escapeHtml(post.summary)}</p>
      </div>
      ${renderMedia(post.media)}
      <footer class="post-footer">
        <div class="post-tags">${post.tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}</div>
        <div class="post-actions"><span>${escapeHtml(post.readingTime)}</span><a href="${escapeHtml(post.href)}"${post.external ? ' target="_blank" rel="noopener"' : ''}>${post.external ? 'Ouvrir la démo' : 'Lire'}</a></div>
      </footer>
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
