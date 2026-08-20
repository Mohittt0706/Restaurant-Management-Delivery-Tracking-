const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const GSI_SCRIPT_URL = 'https://accounts.google.com/gsi/client';

function loadGsiScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }

    const existing = document.querySelector(`script[src="${GSI_SCRIPT_URL}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Google sign-in failed to load.')));
      return;
    }

    const script = document.createElement('script');
    script.src = GSI_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Google sign-in failed to load.'));
    document.head.appendChild(script);
  });
}

export async function getGoogleCredential() {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error('Google sign-in is not configured.');
  }

  await loadGsiScript();

  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (fn, value) => {
      if (!settled) {
        settled = true;
        fn(value);
      }
    };

    const timeout = setTimeout(() => {
      finish(reject, new Error('Google sign-in timed out. Please try again.'));
    }, 60000);

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      auto_select: false,
      callback: (response) => {
        clearTimeout(timeout);
        if (response?.credential) {
          finish(resolve, response.credential);
        } else {
          finish(reject, new Error('Google sign-in was cancelled. Please try again.'));
        }
      },
    });

    window.google.accounts.id.prompt(() => {
      clearTimeout(timeout);
      setTimeout(() => {
        finish(reject, new Error('Google sign-in was cancelled. Please try again.'));
      }, 1000);
    });
  });
}