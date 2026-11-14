export function getRoute(hash = '') {
  const value = hash.replace(/^#/, '') || 'home';
  if (value.startsWith('book/')) return { name: 'book', bookId: value.slice(5) };
  if (['origin', 'books', 'audio', 'team'].includes(value)) return { name: value };
  return { name: 'home' };
}
