import { useEffect, useState } from "react";

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 4500); // Start fade-out after 4.5s
    const removeScreen = setTimeout(onFinish, 3000); // Hide after 5s

    return () => {
      clearTimeout(timer);
      clearTimeout(removeScreen);
    };
  }, [onFinish]);

  return (
    <div className={`splash-screen ${fadeOut ? "hidden" : ""}`}>
      <h1 className="text-4xl font-bold text-white">Lancer</h1>
      <div className="loader mt-4"></div> {/* Loading Spinner */}
    </div>
  );
};

export default SplashScreen;

