const crypto = require('crypto');

const COOKIE_NAME = 'loua_calc_session';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 dagen

function timingSafeStringEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  var result = 0;
  for (var i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

function getSecret() {
  return (process.env.CALC_USER || '') + ':' + (process.env.CALC_PASS || '');
}

function signPayload(payload) {
  return crypto.createHmac('sha256', getSecret()).update(payload).digest('hex');
}

function createSessionCookie() {
  var payload = 'ok.' + Date.now();
  var value = encodeURIComponent(payload + '.' + signPayload(payload));
  return COOKIE_NAME + '=' + value + '; HttpOnly; Secure; SameSite=Lax; Path=/intern/calculator; Max-Age=' + MAX_AGE_SECONDS;
}

function clearSessionCookie() {
  return COOKIE_NAME + '=; HttpOnly; Secure; SameSite=Lax; Path=/intern/calculator; Max-Age=0';
}

function parseCookies(header) {
  var out = {};
  (header || '').split(';').forEach(function (part) {
    var idx = part.indexOf('=');
    if (idx === -1) return;
    var k = part.slice(0, idx).trim();
    var v = part.slice(idx + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  });
  return out;
}

function hasValidSession(req) {
  var cookies = parseCookies(req.headers['cookie']);
  var raw = cookies[COOKIE_NAME];
  if (!raw) return false;
  var lastDot = raw.lastIndexOf('.');
  if (lastDot === -1) return false;
  var payload = raw.slice(0, lastDot);
  var sig = raw.slice(lastDot + 1);
  if (!timingSafeStringEqual(sig, signPayload(payload))) return false;
  var m = /^ok\.(\d+)$/.exec(payload);
  if (!m) return false;
  var issuedAt = parseInt(m[1], 10);
  if (!issuedAt || Date.now() - issuedAt > MAX_AGE_SECONDS * 1000) return false;
  return true;
}

function getFormFields(req) {
  var body = req.body;
  if (body && typeof body === 'object') return body;
  if (typeof body === 'string' && body.length) {
    var params = new URLSearchParams(body);
    return { username: params.get('username'), password: params.get('password') };
  }
  return {};
}

module.exports = {
  COOKIE_NAME,
  MAX_AGE_SECONDS,
  timingSafeStringEqual,
  getSecret,
  signPayload,
  createSessionCookie,
  clearSessionCookie,
  parseCookies,
  hasValidSession,
  getFormFields,
};
