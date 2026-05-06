const crypto = require('crypto');

const GENIUSPAY_BASE_URL = process.env.GENIUSPAY_BASE_URL || 'https://pay.genius.ci/api/v1/merchant';

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} non configuré`);
  return value;
}

function isGeniusPayConfigured() {
  return Boolean(process.env.GENIUSPAY_API_KEY && process.env.GENIUSPAY_API_SECRET);
}

async function geniusPayRequest(path, options = {}) {
  const apiKey = getRequiredEnv('GENIUSPAY_API_KEY');
  const apiSecret = getRequiredEnv('GENIUSPAY_API_SECRET');

  const headers = new Headers(options.headers || undefined);
  headers.set('Accept', 'application/json');
  headers.set('X-API-Key', apiKey);
  headers.set('X-API-Secret', apiSecret);

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${GENIUSPAY_BASE_URL}${path}`, {
    ...options,
    headers,
    signal: options.signal || AbortSignal.timeout(15000),
  });

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message =
      data && typeof data === 'object' && data.error && typeof data.error.message === 'string'
        ? data.error.message
        : data && typeof data === 'object' && typeof data.message === 'string'
          ? data.message
          : `GeniusPay a répondu ${response.status}`;
    throw new Error(message);
  }

  return data;
}

async function createHostedPayment(payload) {
  return geniusPayRequest('/payments', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

async function getPayment(reference) {
  return geniusPayRequest(`/payments/${encodeURIComponent(reference)}`, {
    method: 'GET',
  });
}

function mapGeniusPayStatus(status) {
  switch ((status || '').toLowerCase()) {
    case 'completed':
      return 'paid';
    case 'processing':
      return 'processing';
    case 'failed':
      return 'failed';
    case 'cancelled':
      return 'cancelled';
    case 'expired':
      return 'expired';
    case 'refunded':
      return 'refunded';
    case 'pending':
    default:
      return 'pending';
  }
}

function verifyWebhookSignature({ rawBody, timestamp, signature, secret }) {
  if (!rawBody || !timestamp || !signature || !secret) return false;

  const payload = `${timestamp}.${rawBody}`;
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');

  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

module.exports = {
  createHostedPayment,
  getPayment,
  isGeniusPayConfigured,
  mapGeniusPayStatus,
  verifyWebhookSignature,
};
