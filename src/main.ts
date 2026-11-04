import './estilos/base.css';
import { iniciarRouter } from './app/router';

const raiz = document.querySelector<HTMLElement>('#app');
if (raiz) iniciarRouter(raiz);
