// Retour haptique discret.
// - Android / Chrome : API Vibration (navigator.vibrate).
// - iPhone : Safari ne propose PAS l'API Vibration. Depuis iOS 18, basculer un
//   interrupteur natif (<input type="checkbox" switch>) produit un petit « tic »
//   haptique, y compris dans l'appli installée sur l'écran d'accueil. C'est une
//   astuce non officielle : sans effet avant iOS 18, si « Retours système » est
//   désactivé dans Réglages > Sons et vibrations, ou si Apple la retire.
// Doit être appelé pendant le geste de l'utilisateur (dans le gestionnaire du tap).
const estIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

export function vibrer() {
  try {
    if (typeof navigator.vibrate === 'function' && !estIOS()) return navigator.vibrate(12);
    if (estIOS()) {
      const label = document.createElement('label');
      label.setAttribute('aria-hidden', 'true');
      label.style.display = 'none';
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.setAttribute('switch', '');
      label.appendChild(input);
      document.head.appendChild(label);
      label.click();
      document.head.removeChild(label);
      return true;
    }
  } catch (e) { /* jamais bloquant */ }
  return false;
}
