const [publicCode] = process.argv.slice(2);
const host = process.env.HOTPESA_LOCAL_HOST ?? '127.0.0.1';
const port = process.env.HOTPESA_PWA_PORT ?? '4173';

if (!/^[a-z0-9_-]{16,128}$/i.test(publicCode ?? '')) throw new Error('Provide one opaque active journey public code.');
if (!/^[a-z0-9.-]+$/i.test(host) || !/^\d{1,5}$/.test(port)) throw new Error('HOTPESA_LOCAL_HOST and HOTPESA_PWA_PORT must be valid local development values.');

console.log(`http://${host}:${port}/journey/${encodeURIComponent(publicCode)}`);
