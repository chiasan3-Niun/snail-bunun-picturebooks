import assert from 'node:assert/strict';
import test from 'node:test';
import { getRoute } from '../src/router.js';

test('maps navigation hashes to dedicated screens', () => {
  assert.equal(getRoute('#origin').name, 'origin');
  assert.equal(getRoute('#books').name, 'books');
  assert.equal(getRoute('#team').name, 'team');
  assert.equal(getRoute('#audio').name, 'audio');
  assert.equal(getRoute('#book/danq').bookId, 'danq');
  assert.equal(getRoute('').name, 'home');
});
