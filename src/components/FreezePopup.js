import { useState, useEffect } from "react";

const FreezePopup = ({ children, timeRemaining, duration, handleRefresh }) => {
  const [count, setCount] = useState(5);
  const [showFreezePopup, setShowFreezePopup] = useState(false);
  console.log("timeRemaining",timeRemaining)
  useEffect(() => {
    if (!timeRemaining) return;

    const { minutes, seconds } = timeRemaining;
    const totalSeconds = minutes * 60 + seconds;

    // Show popup when 5 seconds or less remaining, INCLUDING 0
    if (totalSeconds <= 5 && totalSeconds >= 0 && duration == 30) {
      setShowFreezePopup(true);
      setCount(totalSeconds);
    } else if (totalSeconds <= 10 && totalSeconds >= 0 && duration > 30) {
      setShowFreezePopup(true);
      setCount(totalSeconds);
    } else {
      setShowFreezePopup(false);

    }

  }, [timeRemaining]);

  // Optional: Add a timeout to hide the popup after showing "00" for a brief moment
  useEffect(() => {
    const { minutes, seconds } = timeRemaining;
    const totalSeconds = minutes * 60 + seconds;
    if (totalSeconds ==1) {
        handleRefresh()
    }
    if (count === 0 && showFreezePopup) {
      const timer = setTimeout(() => {
        setShowFreezePopup(false);
      }, 1000); // Show "00" for 1 second before hiding

      return () => clearTimeout(timer);
    }
  }, [count, showFreezePopup]);

  // Format count to always show two digits
  const formatCount = (num) => {
    return num.toString().padStart(2, '0');
  };

  // Split the formatted count into individual digits
  const getDigits = (num) => {
    const formatted = formatCount(num);
    return [formatted[0], formatted[1]];
  };

  const [firstDigit, secondDigit] = getDigits(count);

  return (
    <div className="relative mb-2">
      {/* Your target content */}
      {children}

      {/* Freeze popup only when last 5 seconds - using your preferred design */}
      {showFreezePopup && (
        <div className="absolute top-[17%] left-0 right-0 flex items-center justify-center rounded-lg z-10   bg-black bg-opacity-50 p-[10px]">
          <div className="flex gap-4">
            <div className="w-[120px] h-[160px] bg-[#4d4d4c] text-[#d9ac4f] text-[120px] font-bold flex items-center justify-center rounded-lg">
              {firstDigit}
            </div>
            <div className="w-[120px] h-[160px] bg-[#4d4d4c] text-[#d9ac4f] text-[120px] font-bold flex items-center justify-center rounded-lg">
              {secondDigit}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default FreezePopup;