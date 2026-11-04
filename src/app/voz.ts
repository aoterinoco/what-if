// hablar(): lee en voz alta con speechSynthesis. Sin archivos de audio en el MVP.
export function hablar(texto: string): void {
  if (!('speechSynthesis' in window) || texto.trim() === '') return;
  window.speechSynthesis.cancel();
  const frase = new SpeechSynthesisUtterance(texto);
  frase.lang = 'es-ES';
  frase.rate = 0.9;
  window.speechSynthesis.speak(frase);
}
