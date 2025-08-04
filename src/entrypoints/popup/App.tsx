import { useState } from 'react';
import reactLogo from '@/assets/react.svg';
import wxtLogo from '/wxt.svg';
import './App.css';
import Hello from './sections/Hello';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className=''>
        <Hello />
      </div>
    </>
  );
}

export default App;
