import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { project, books, team } from '../src/data.js';

test('describes the five picture books and the official project', () => {
  assert.equal(books.length, 5);
  assert.equal(project.grantName, '布農族飲食文化全族語繪本及數位錄音製作語料保存暨推廣計畫');
  for (const book of books) {
    assert.ok(book.title);
    assert.ok(book.cover);
    assert.ok(book.onlineReaderUrl);
  }
  assert.deepEqual(books.map((book) => book.title), ['Siequt', "Paqzu'", 'Qazu’qazu’', 'Mumuan', 'Ciequtciequt']);
  assert.match(project.intro, /願孩子翻開繪本時，能帶著好奇心出發/);
  assert.match(project.intro, /Ciequtciequt.*Mumuan.*Qazu’qazu’.*Paqzu’.*Siequt/);
  assert.match(project.background, /食農教育法/);
  assert.match(project.purpose, /族語文化復振/);
  assert.equal(project.goals.length, 6);
});

test('connects the available audio picture books', () => {
  assert.deepEqual(Object.fromEntries(books.map((book) => [book.id, book.youtubeUrl])), {
    danq: 'https://youtu.be/wSKu0IgeF9E',
    kaq: 'https://youtu.be/GOAoXfJ46XE',
    taku: 'https://youtu.be/F9V8YGEZsOk',
    junq: 'https://youtu.be/ZYyFQL98Lsw',
    luanq: 'https://youtu.be/sZSq0nbujzc',
  });
});

test('homepage opens online reading without embedding PDFs', () => {
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.doesNotMatch(html, /id="reader-frame"/);
  assert.doesNotMatch(html, /download=/i);
  assert.match(html, /id="visit-count"/);
  assert.match(html, /文化部/);
});

test('publishes the ministry support wording without hashtag keywords', () => {
  assert.equal(project.grantUnit, '文化部');
  assert.match(project.grantText, /文化部國家語言整體發展方案支持/);
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.doesNotMatch(html, /id="hashtags"/);
});

test('keeps the YouTube channel link available', () => {
  assert.equal(project.youtubeChannel, 'http://www.youtube.com/@chiasan3');
  assert.equal(fs.existsSync(path.resolve('assets/culture/youtube-channel.jpg')), true);
});

test('ships a cover asset for every book', () => {
  for (const book of books) {
    assert.equal(fs.existsSync(path.resolve(book.cover)), true, `missing cover: ${book.cover}`);
  }
});

test('connects every Bunun online reading edition', () => {
  assert.deepEqual(Object.fromEntries(books.map((book) => [book.id, book.onlineReaderUrl])), {
    junq: 'https://read.bookcreator.com/jNbQeRTvArW55BZdont7dmqpv3k2/IW4ABAFzSWugqQowSw_-TA',
    luanq: 'https://read.bookcreator.com/jNbQeRTvArW55BZdont7dmqpv3k2/-JMQNNuZSHqtpXsXIcksgg',
    danq: 'https://read.bookcreator.com/jNbQeRTvArW55BZdont7dmqpv3k2/jcUkLgYOQVeuh1xYrvGnMw',
    taku: 'https://read.bookcreator.com/jNbQeRTvArW55BZdont7dmqpv3k2/ZyhRwZeLTmejBdw7CWAL_A',
    kaq: 'https://read.bookcreator.com/jNbQeRTvArW55BZdont7dmqpv3k2/HhN_iqp9QA2CwCxBLcKXZg',
  });
});

test('has a non-zero visitor counter fallback', () => {
  const app = fs.readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
  assert.match(app, /try\s*\{/);
  assert.match(app, /return 1/);
});

test('uses a shared server-side visitor counter', () => {
  const app = fs.readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
  const api = fs.readFileSync(new URL('../api/visits.js', import.meta.url), 'utf8');
  assert.match(app, /fetch\('\/api\/visits'\)/);
  assert.match(api, /COUNTERAPI_TOKEN/);
  assert.match(api, /counterapi\.dev\/v2\/niun-istasipals-team-6223\/first-counter-6223\/up/);
  assert.match(app, /result\.data\?\.up_count/);
});

test('keeps the hero content inside the first viewport', () => {
  const css = fs.readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
  assert.match(css, /min-height:calc\(100vh - 78px\)/);
  assert.match(css, /align-items:center/);
  assert.match(css, /font-size:clamp\(2rem,4vw,4\.5rem\)/);
});

test('keeps the desktop hero title on one line', () => {
  const css = fs.readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
  assert.match(css, /h1 \{[^}]*white-space:nowrap/);
  assert.match(css, /h1 \{ max-width:12ch; white-space:normal/);
});

test('matches the team credits from the copyright page', () => {
  assert.deepEqual(team, [
    ['余佳珊', '總編輯、文案編輯、美術排版、影音剪輯、網頁設計、出版、發行'],
    ['蔡毓芳', '插畫繪製'],
    ['王秀卉、王秀蓮、田雅婷、馬麗琴、黃美蘭', '族語審校、族語配音'],
    ['王菊妹、王秀卉、王秀蓮、田雅婷、全正文、松梅花、馬麗琴、黃美蘭、Sai. Isqaqavut', '文化諮詢'],
    ['金浩誠', '專家諮詢'],
    ['藍格印刷國際企業有限公司', '印刷'],
  ]);
});

test('uses the updated copyright wording', () => {
  assert.match(project.copyright, /《蝸牛－布農族飲食故事繪本》內容由余佳珊製作/);
});

test('uses the five-cover layout for the audio page', () => {
  const css = fs.readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
  assert.match(css, /\.audio-grid \{ display:grid; grid-template-columns:repeat\(5/);
  const app = fs.readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
  assert.match(app, /audio-card__body/);
});

test('keeps listening actions on the dedicated audio page', () => {
  const app = fs.readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.doesNotMatch(app, /data-audio=/);
  assert.match(html, /id="audio" data-screen="audio"/);
});

test('provides a usable mobile navigation toggle', () => {
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const css = fs.readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
  const app = fs.readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
  assert.match(html, /class="menu-toggle"/);
  assert.match(css, /nav\.is-open \{ display:flex; \}/);
  assert.match(app, /aria-expanded/);
});

test('hides the home screen outside the home route', () => {
  const css = fs.readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
  assert.match(css, /\.screen:not\(\.is-active\) \{ display:none; \}/);
});

test('places grant information after the full preface', () => {
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /class="origin-content"/);
  assert.ok(html.indexOf('id="intro-copy"') < html.indexOf('class="grant"'));
});
