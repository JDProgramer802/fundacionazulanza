import { Monitor, Moon, MoveHorizontal, Sun } from 'lucide-react';
import { useContext, useState } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const [positionRight, setPositionRight] = useState(true);

  const nextTheme = () => (theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light');
  const currentIcon =
    theme === 'light' ? <Sun size={18} /> : theme === 'dark' ? <Moon size={18} /> : <Monitor size={18} />;

  return (
    <div
      className={`fixed bottom-6 ${positionRight ? 'right-6' : 'left-6'} z-50 flex items-center gap-2`}
    >
      <button
        onClick={() => setTheme(nextTheme())}
        title={`Tema: ${theme}`}
        className="p-3 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        {currentIcon}
      </button>
      <button
        onClick={() => setPositionRight(!positionRight)}
        title={positionRight ? 'Mover a la izquierda' : 'Mover a la derecha'}
        className="p-3 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        <MoveHorizontal size={18} />
      </button>
    </div>
  );
};

export default ThemeToggle;
