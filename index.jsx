import { useState, useEffect } from "react";

const levels = [
  {
    code: "const a = 5;\nlet b = a + 2;\nconsole.log(b);",
    highlights: [6, 17], // позиции правильных нажатий
    traps: [25], // позиции ловушек
  },
  // Можно добавить больше уровней
];

export default function CodeTypingGame() {
  const [step, setStep] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mistake, setMistake] = useState(false);
  const [done, setDone] = useState(false);
  const [restartKey, setRestartKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dots, setDots] = useState(1);
  const [showCharacter, setShowCharacter] = useState(false);

  const currentLevel = levels[step];
  const code = currentLevel.code;

  function handleKeyPress(index) {
    if (currentLevel.traps.includes(index)) {
      setMistake(true);
    } else if (currentLevel.highlights.includes(index)) {
      setCurrentIndex((prev) => prev + 1);
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev % 3) + 1);
    }, 500);
    setTimeout(() => {
      setLoading(false);
      setShowCharacter(true);
      clearInterval(interval);
    }, 3000);
    return () => clearInterval(interval);
  }, [restartKey]);

  useEffect(() => {
    if (currentIndex >= currentLevel.highlights.length) {
      setDone(true);
    }
  }, [currentIndex]);

  function resetGame() {
    setCurrentIndex(0);
    setMistake(false);
    setDone(false);
    setRestartKey((prev) => prev + 1);
    setLoading(true);
    setShowCharacter(false);
  }

  function nextLevel() {
    setStep((prev) => prev + 1);
    resetGame();
  }

  return (
    <div className="h-screen bg-black text-green-400 p-4 flex flex-col justify-between font-mono">
      {/* Троеточие загрузки */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-xl animate-pulse">
          <span>{".".repeat(dots)}</span>
        </div>
      ) : (
        <>
          {/* Код */}
          <div>
            <pre className="whitespace-pre-wrap text-xl">
              {[...code].map((char, i) => (
                <span
                  key={`${restartKey}-${i}`}
                  className={
                    mistake && currentLevel.traps.includes(i)
                      ? "text-red-500 animate-pulse"
                      : currentLevel.highlights.includes(i)
                      ? "bg-green-600 cursor-pointer hover:bg-green-500"
                      : ""
                  }
                  onClick={() => handleKeyPress(i)}
                >
                  {char}
                </span>
              ))}
            </pre>
          </div>

          {/* Завершение и ошибки */}
          {mistake && (
            <div className="text-center mt-4">
              <p className="text-red-500 text-xl mb-2">Игра окончена</p>
              <button
                onClick={resetGame}
                className="bg-white text-black p-2 rounded hover:bg-gray-200"
              >
                Перезапустить уровень
              </button>
            </div>
          )}

          {done && !mistake && (
            <div className="text-center mt-4">
              {step < levels.length - 1 ? (
                <button
                  onClick={nextLevel}
                  className="bg-white text-black p-2 rounded hover:bg-gray-200"
                >
                  Следующий код
                </button>
              ) : (
                <>
                  <p className="text-yellow-400 text-xl mb-2">
                    Молодец, новичок, рабочий день окончен!
                  </p>
                  <button
                    onClick={() => {
                      setStep(0);
                      resetGame();
                    }}
                    className="bg-white text-black p-2 rounded hover:bg-gray-200"
                  >
                    Следующий рабочий день
                  </button>
                </>
              )}
            </div>
          )}

          {/* Персонаж */}
          {showCharacter && (
            <div className="text-white text-center mt-6 transition-opacity duration-1000">
              <pre className="text-xs">
                {`           .-"""-.
          / .===. \
          \/ 6 6 \/
          ( \___/ )
         ___ooo___}
        |         |
        | PC TIME |
        |_________|`}
              </pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}
