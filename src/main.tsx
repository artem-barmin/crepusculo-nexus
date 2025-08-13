import { render } from 'preact';
import App from './App.tsx';
import './index.css';

console.log('Main.tsx is loading...');
console.log('Root element:', document.getElementById('root'));

try {
  render(<App />, document.getElementById('root')!);
  console.log('App rendered successfully');
} catch (error) {
  console.error('Error rendering app:', error);
}
