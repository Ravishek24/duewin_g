import React, { useState, useEffect, useRef, useCallback } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import Confetti from "react-confetti";
import Timecolor from "../../../Assets/timecolor.png";
import Timeblack from "../../../Assets/timeblack.png";
import speaker from "./../../../Assets/speaker.png";
import BackButton from "./../../../components/BackButton";
import empty from "../../../Assets/empty.png";
import wallet from "../../../Assets/wallets.png";
import fire from "../../../Assets/fire.png";
import howtoplay from "../../../Assets/finalicons/howtoplayicon.png";
import agree from "../../../Assets/finalicons/agree.png";
import agreeborder from "../../../Assets/finalicons/agreeborder.png";
import LotteryWingoheader from "../../../components/LotteryWingoheader";
import invitation from "../../../Assets/invitation.png";
import refresh from "../../../Assets/refresh.png";
import num1 from "../../../Assets/num1.png";
import num2 from "../../../Assets/num2.png";
import num3 from "../../../Assets/num3.png";
import num4 from "../../../Assets/num4.png";
import num5 from "../../../Assets/num5.png";
import num6 from "../../../Assets/num6.png";
import walletbggame from "../../../Assets/walletbggame.png";
import mark from "../../../Assets/finalicons/infoicon.png";
import close from "../../../Assets/finalicons/close.png";
import { getWalletBalance } from "../../../api/apiServices";
import useSocket from "../../../hooks/useSocket";
import FreezePopup from "../../../components/FreezePopup";
import redball from '../../../Assets/WingoNew/redBall.png';
import greenball from '../../../Assets/WingoNew/greenBall.png';
import dice1 from '../../../Assets/WingoNew/n1-584b8878.png';
import dice2 from '../../../Assets/WingoNew/n2-447499dc.png';
import dice3 from '../../../Assets/WingoNew/n3-1432a6bd.png';
import dice4 from '../../../Assets/WingoNew/n4-9d453819.png';
import dice5 from '../../../Assets/WingoNew/n5-09b70e91.png';
import dice6 from '../../../Assets/WingoNew/n6-b68c6bb6.png';

const diceImages = {
  1: dice1,
  2: dice2,
  3: dice3,
  4: dice4,
  5: dice5,
  6: dice6,
};

const buttonData = [
  {
    id: 0,
    title: (
      <>
        K3
        1Min
      </>
    ),
    icon: <img src={Timeblack} alt="clock icon" className="w-14 h-14" />,
    activeIcon: (
      <img src={Timecolor} alt="active clock icon" className="w-14 h-14" />
    ),
    duration: 60,
  },
  {
    id: 1,
    title: "K3 3Min",
    icon: <img src={Timeblack} alt="clock icon" className="w-14 h-14" />,
    activeIcon: (
      <img src={Timecolor} alt="active clock icon" className="w-14 h-14" />
    ),
    duration: 180,
  },
  {
    id: 2,
    title: "K3  5Min",
    icon: <img src={Timeblack} alt="clock icon" className="w-14 h-14" />,
    activeIcon: (
      <img src={Timecolor} alt="active clock icon" className="w-14 h-14" />
    ),
    duration: 300,
  },
  {
    id: 3,
    title: "K3  10Min",
    icon: <img src={Timeblack} alt="clock icon" className="w-14 h-14" />,
    activeIcon: (
      <img src={Timecolor} alt="active clock icon" className="w-14 h-14" />
    ),
    duration: 600,
  },
];

const imageUrls = [
  { number: 3, url: redball, textColor: '#ff0000', description: "207.36X" },
  { number: 4, url: greenball, textColor: '#00b971', description: "69.12X" },
  { number: 5, url: redball, textColor: '#ff0000', description: "34.56X" },
  { number: 6, url: greenball, textColor: '#00b971', description: "20.74X" },
  { number: 7, url: redball, textColor: '#ff0000', description: "13.83X" },
  { number: 8, url: greenball, textColor: '#00b971', description: "9.88X" },
  { number: 9, url: redball, textColor: '#ff0000', description: "8.3X" },
  { number: 10, url: greenball, textColor: '#00b971', description: "7.68X" },
  { number: 11, url: redball, textColor: '#ff0000', description: "7.68X" },
  { number: 12, url: greenball, textColor: '#00b971', description: "8.3X" },
  { number: 13, url: redball, textColor: '#ff0000', description: "9.88X" },
  { number: 14, url: greenball, textColor: '#00b971', description: "13.83X" },
  { number: 15, url: redball, textColor: '#ff0000', description: "20.74X" },
  { number: 16, url: greenball, textColor: '#00b971', description: "34.56X" },
  { number: 17, url: redball, textColor: '#ff0000', description: "69.12X" },
  { number: 18, url: greenball, textColor: '#00b971', description: "207.36X" },
];

const BettingModal = ({
  activeImgTab,
  selectedOptions,
  setSelectedOptions,
  selectedTwoSameNumbers,
  setSelectedTwoSameNumbers,
  selectedPair,
  setSelectedPair,
  selectedThreeSameNumbers,
  setSelectedThreeSameNumbers,
  betAmount,
  setBetAmount,
  quantity,
  setQuantity,
  selectedMultiplier,
  setSelectedMultiplier,
  checked,
  setChecked,
  currentPeriod,
  placeBet,
  setShowSuccessPopup,
  setShowTwoSamePopup,
  setShowThreeSamePopup,
  calculateTotalBetAmount,
  getCombinationCount,
  gameType,
  activeButton,
  buttonData,
  setError,
}) => {
  const multiplierOptions = ["X1", "X5", "X10", "X20", "X50", "X100"];

  const getDisplayAmount = () => {
    const baseAmount = calculateTotalBetAmount();
    const multiplierValue = parseInt(selectedMultiplier.replace("X", "")) || 1;
    return (baseAmount * quantity * betAmount * multiplierValue).toFixed(2);
  };

  const handleQuantityChange = (delta) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const handleMultiplierClick = (value) => setSelectedMultiplier(value);

  const handleClosePopup = () => {
    setSelectedOptions([]);
    setShowTwoSamePopup(false);
    setShowThreeSamePopup(false);
    setSelectedTwoSameNumbers([]);
    setSelectedPair({ red: null, green: null });
    setSelectedThreeSameNumbers([]);
    setBetAmount(1);
    setQuantity(1);
    setSelectedMultiplier("X1");
  };

  const handlePlaceBet = () => {
    if (!checked) {
      alert("Please agree to the pre-sale rules");
      return;
    }
    const multiplierValue = parseInt(selectedMultiplier.replace("X", "")) || 1;
    const baseAmount = calculateTotalBetAmount();
    const totalAmount = baseAmount * quantity * betAmount * multiplierValue;
    const betType =
      activeImgTab === "total"
        ? "sum"
        : activeImgTab === "2same"
          ? "pair"
          : activeImgTab === "3same"
            ? "triple"
            : "different";

    let selection = selectedOptions;
    if (activeImgTab === "2same") {
      selection = [...selectedTwoSameNumbers];
      if (selectedPair.red && selectedPair.green && isValidPair(selectedPair.red, selectedPair.green)) {
        selection.push([selectedPair.red, selectedPair.green]);
      }
    } else if (activeImgTab === "3same") {
      selection = [...selectedThreeSameNumbers];
      if (selectedOptions.includes("Any 3")) {
        selection.push("Any 3");
      }
    }

    const betData = {
      amount: totalAmount,
      selection: selection,
      type: betType,
      periodId: currentPeriod.periodId,
      gameType: gameType,
      duration: buttonData[activeButton].duration,
    };

    const betPlaced = placeBet(betData);

    if (betPlaced) {
      setShowSuccessPopup(true);
      handleClosePopup();
    } else {
      setError("Failed to place bet. Please try again.");
    }
  };

  const isValidPair = (redValue, greenValue) => {
    const redDigit = Math.floor(redValue / 11);
    return redDigit !== greenValue;
  };

  return (
    shouldShowBettingModal() && (
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[400px] bg-[#222222] text-white rounded-t-lg p-4 shadow-xl z-50">
        {selectedOptions.some((option) => option >= 1 && option <= 6) && (
          <div className="mb-2">
            <p className="text-sm mb-1">
              3 different numbers: {getCombinationCount(selectedOptions.filter((opt) => opt >= 1 && opt <= 6).length, 3)} bets
            </p>
            <div className="flex space-x-2">
              {selectedOptions
                .filter((option) => option >= 1 && option <= 6)
                .map((option) => (
                  <span
                    key={option}
                    className="bg-purple-600 px-3 py-1 rounded text-sm font-medium"
                  >
                    {option}
                  </span>
                ))}
            </div>
          </div>
        )}

        {selectedOptions.includes("3 Continuous") && (
          <div className="mb-2">
            <p className="text-sm mb-1">3 continuous numbers: 1 bet</p>
            <span className="bg-red-600 px-3 py-1 rounded text-sm font-medium">
              3 continuous numbers : odds (8.64)
            </span>
          </div>
        )}

        {selectedOptions.some((option) => option >= 11 && option <= 16) &&
          !selectedTwoSameNumbers.length &&
          !selectedPair.red &&
          !selectedPair.green && (
            <div className="mb-2">
              <p className="text-sm mb-1">
                2 different numbers: {getCombinationCount(selectedOptions.filter((opt) => opt >= 11 && opt <= 16).length, 2)} bets
              </p>
              <div className="flex space-x-2">
                {selectedOptions
                  .filter((option) => option >= 11 && option <= 16)
                  .map((option) => (
                    <span
                      key={option}
                      className="bg-purple-600 px-3 py-1 rounded text-sm font-medium"
                    >
                      {option - 10}
                    </span>
                  ))}
              </div>
            </div>
          )}

        {(selectedTwoSameNumbers.length > 0 ||
          (selectedPair.red && selectedPair.green)) && (
            <div className="mb-2">
              <p className="text-sm mb-1">2 same numbers:</p>
              <div className="flex space-x-2">
                {selectedTwoSameNumbers.map((num) => (
                  <span
                    key={num}
                    className="bg-purple-600 px-3 py-1 rounded text-sm font-medium"
                  >
                    {num}
                  </span>
                ))}
                {selectedPair.red && selectedPair.green && (
                  <span className="bg-red-600 px-3 py-1 rounded text-sm font-medium">
                    {`${selectedPair.red}, ${selectedPair.green}`}
                  </span>
                )}
              </div>
            </div>
          )}

        {(selectedThreeSameNumbers.length > 0 ||
          selectedOptions.includes("Any 3")) && (
            <div className="mb-2">
              <p className="text-sm mb-1">3 same numbers:</p>
              <div className="flex space-x-2">
                {selectedThreeSameNumbers.map((num) => (
                  <span
                    key={num}
                    className="bg-purple-600 px-3 py-1 rounded text-sm font-medium"
                  >
                    {num}
                  </span>
                ))}
                {selectedOptions.includes("Any 3") && (
                  <span className="bg-red-600 px-3 py-1 rounded text-sm font-medium">
                    Any 3 : odds (34.56)
                  </span>
                )}
              </div>
            </div>
          )}

        <div className="flex justify-between items-center mb-4">
          <p className="text-sm">Balance</p>
          <div className="flex gap-2">
            {[1, 10, 100, 1000].map((value) => (
              <button
                key={value}
                className={`px-3 py-1 rounded text-sm font-medium ${betAmount === value
                  ? "bg-[#d6a439] text-black"
                  : "bg-[#555555] text-gray-300"
                  }`}
                onClick={() => setBetAmount(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <p className="text-sm">Quantity</p>
          <div className="flex items-center gap-2">
            <button
              className="bg-[#d6a439] text-black font-bold px-3 py-1 rounded"
              onClick={() => handleQuantityChange(-1)}
            >
              -
            </button>
            <input
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-16 bg-neutral-800 text-center py-1 rounded text-sm text-white"
            />
            <button
              className="bg-[#d6a439] text-black font-bold px-3 py-1 rounded"
              onClick={() => handleQuantityChange(1)}
            >
              +
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          {multiplierOptions.map((label) => (
            <button
              key={label}
              onClick={() => handleMultiplierClick(label)}
              className={`px-3 py-1 rounded text-sm font-medium ${selectedMultiplier === label
                ? "bg-[#d6a439] text-black"
                : "bg-[#555] text-gray-300"
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div
          className="flex items-center gap-2 mb-4 cursor-pointer"
          onClick={() => setChecked(!checked)}
        >
          <img
            src={checked ? agree : agreeborder}
            alt="Agreement Checkbox"
            className="w-6 h-6"
          />
          <span className="text-sm text-white">I agree</span>
          {/* <button
            className="text-red-500 text-sm hover:underline"
            onClick={() => setShowPreSalePopup(true)}
          >
            Pre-sale rules
          </button> */}
        </div>

        <div className="flex w-full">
          <button
            className="flex-1 bg-[#444] text-white py-2 rounded-l text-sm"
            onClick={handleClosePopup}
          >
            Cancel
          </button>
          <button
            className="flex-1 bg-[#d6a439] text-[#8f5206] font-semibold py-2 rounded-r text-sm"
            onClick={handlePlaceBet}
          >
            Total amount ₹{getDisplayAmount()}
          </button>
        </div>
      </div>
    )
  );

  function shouldShowBettingModal() {
    if (activeImgTab === "2same") {
      return selectedTwoSameNumbers.length > 0 ||
        (selectedPair.red && selectedPair.green && isValidPair(selectedPair.red, selectedPair.green));
    } else if (activeImgTab === "3same") {
      return selectedThreeSameNumbers.length > 0 || selectedOptions.includes("Any 3");
    } else if (activeImgTab === "different") {
      const threeDifferentCount = selectedOptions.filter(
        (opt) => opt >= 1 && opt <= 6
      ).length;
      const twoDifferentCount = selectedOptions.filter(
        (opt) => opt >= 11 && opt <= 16
      ).length;
      const hasContinuous = selectedOptions.includes("3 Continuous");

      return threeDifferentCount >= 3 || twoDifferentCount >= 2 || hasContinuous;
    }
    return selectedOptions.length > 0;
  }
};

function LotteryK3() {
  const isMounted = useRef(true);
  const location = useLocation()
  const gameType = "k3";
  const API_BASE_URL = "https://api.strikecolor1.com";

  const [activeTab, setActiveTab] = useState("gameHistory");
  const [activeImgTab, setActiveImgTab] = useState("total");
  const [historyData, setHistoryData] = useState([]);
  const [gameHistoryData, setGameHistoryData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [activeButton, setActiveButton] = useState(location?.state ? location?.state :buttonData[0].id);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showPreSalePopup, setShowPreSalePopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [checked, setChecked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [betAmount, setBetAmount] = useState(1);
  const [showDifferentPopup, setShowDifferentPopup] = useState(false);
  const [selectedMultiplier, setSelectedMultiplier] = useState("X1");
  const [showTwoSamePopup, setShowTwoSamePopup] = useState(false);
  const [showThreeSamePopup, setShowThreeSamePopup] = useState(false);
  const [selectedTwoSameNumbers, setSelectedTwoSameNumbers] = useState([]);
  const [selectedPair, setSelectedPair] = useState({ red: null, green: null });
  const [selectedThreeSameNumbers, setSelectedThreeSameNumbers] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0.0);
  const [isRefreshingBalance, setIsRefreshingBalance] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState({
    minutes: 0,
    seconds: 0,
  });
  const [currentPeriod, setCurrentPeriod] = useState({
    periodId: "Loading...",
  });
  const [isPeriodTransitioning, setIsPeriodTransitioning] = useState(false);
    const [fetchDataFlag,setFetchDataFlag] = useState(false)

  const {
    isConnected,
    connectionError,
    currentPeriod: socketPeriod,
    timeRemaining: socketTime,
    currentResult,
    gameHistory: socketHistory,
    placeBet,
  } = useSocket(gameType, buttonData[activeButton].duration);

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const response = await getWalletBalance();
        if (response?.success && response?.mainWallet) {
          const balance = Number(response.mainWallet.balance) || 0;
          setWalletBalance(balance);
        } else {
          setWalletBalance(0);
        }
      } catch (error) {
        console.error("Failed to fetch wallet balance:", error);
        setWalletBalance(0);
      }
    };

    fetchWalletBalance();
    const interval = setInterval(fetchWalletBalance, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefreshBalance = async () => {
    if (isRefreshingBalance) return;
    setIsRefreshingBalance(true);
    try {
      const response = await getWalletBalance();
      if (response?.success && response?.mainWallet) {
        const balance = Number(response.mainWallet.balance) || 0;
        setWalletBalance(balance);
      } else {
        setError("Failed to refresh balance");
      }
    } catch (error) {
      setError("Failed to refresh balance. Please try again.");
    } finally {
      setIsRefreshingBalance(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      const updates = {};
      let hasUpdates = false;

      if (socketPeriod && socketPeriod.periodId !== currentPeriod.periodId) {
        if (socketPeriod.periodId && socketPeriod.periodId !== "Loading...") {
          updates.period = socketPeriod;
          hasUpdates = true;
        }
      }

      if (
        socketTime &&
        (socketTime.minutes !== timeRemaining.minutes ||
          socketTime.seconds !== timeRemaining.seconds)
      ) {
        updates.time = socketTime;
        hasUpdates = true;
      }

      if (hasUpdates) {
        if (updates.period) {
          setCurrentPeriod(updates.period);
        }
        if (updates.time) {
          setTimeRemaining(updates.time);
        }
      }
    }
  }, [
    isConnected,
    socketPeriod,
    socketTime,
    currentPeriod.periodId,
    timeRemaining.minutes,
    timeRemaining.seconds,
  ]);

  useEffect(() => {
    if(timeRemaining.minutes == 0 && timeRemaining.seconds < 2){
            setFetchDataFlag(prev =>!prev)
    }
    if (timeRemaining.minutes === 0 && timeRemaining.seconds === 0) {
      console.log("Hello")
      const currentId = parseInt(currentPeriod.periodId) || 0;
      const nextPeriodId = (currentId + 1).toString();

      setCurrentPeriod((prev) => ({
        ...prev,
        periodId: nextPeriodId,
      }));

      if (!isConnected) {
        const timer = setTimeout(() => {
          const duration = buttonData[activeButton].duration;
          setTimeRemaining({
            minutes: Math.floor(duration / 60),
            seconds: duration % 60,
          });
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [timeRemaining.minutes, timeRemaining.seconds, activeButton, isConnected, currentPeriod.periodId]);

  useEffect(() => {
    if (showSuccessPopup) {
      const timer = setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessPopup]);

  const fetchGameData = async (page, duration) => {
    try {
      const accessToken = localStorage.getItem("token");
      if (!accessToken) {
        throw new Error("No access token found. Please log in.");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/games/K3/${duration}/history?page=${page}&limit=10`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      let results = [];
      if (data.success && data.data) {
        const dataArray =
          data.data.results || (Array.isArray(data.data) ? data.data : []);
        if (Array.isArray(dataArray)) {
          results = dataArray.map((item) => ({
            periodId: item.periodId || "N/A",
            dice1: item.result?.dice_1 || 1,
            dice2: item.result?.dice_2 || 1,
            dice3: item.result?.dice_3 || 1,
            sum: item.result?.sum || 0,
            sumSize: item.result?.sum_size || "N/A",
            hasPair: item.result?.has_pair || false,
            hasTriple: item.result?.has_triple || false,
            isStraight: item.result?.is_straight || false,
            sumParity: item.result?.sum_parity || "N/A",
          }));
        } else if (typeof data.data === "object") {
          results = [{
            periodId: data.data.periodId || "N/A",
            dice1: data.data.result?.dice_1 || 1,
            dice2: data.data.result?.dice_2 || 1,
            dice3: data.data.result?.dice_3 || 1,
            sum: data.data.result?.sum || 0,
            sumSize: data.data.result?.sum_size || "N/A",
            hasPair: data.data.result?.has_pair || false,
            hasTriple: data.data.result?.has_triple || false,
            isStraight: data.data.result?.is_straight || false,
            sumParity: data.data.result?.sum_parity || "N/A",
          }];
        }
      }

      return {
        results,
        pagination: data.data?.pagination || { total_pages: 1 },
      };
    } catch (error) {
      console.error("Error fetching game data:", error);
      return { results: [], pagination: { total_pages: 1 } };
    }
  };

  useEffect(() => {
    if (activeTab === "gameHistory") {
      const duration = buttonData[activeButton].duration;
      const fetchGameHistory = async () => {
        setIsLoading(true);
        const response = await fetchGameData(currentPage, duration);
        if (isMounted.current) {
          setGameHistoryData(response.results);
          setTotalPages(response.pagination.total_pages || 1);
          setIsLoading(false);
        }
      };
      fetchGameHistory().catch(console.error);
    }
  }, [activeTab, currentPage, activeButton,fetchDataFlag]);

  useEffect(() => {
    if (activeTab === "chart") {
      const duration = buttonData[activeButton].duration;
      const fetchChartData = async () => {
        setIsLoading(true);
        const response = await fetchGameData(currentPage, duration);
        if (isMounted.current) {
          setChartData(response.results);
          setTotalPages(response.pagination.total_pages || 1);
          setIsLoading(false);
        }
      };
      fetchChartData().catch(console.error);
    }
  }, [activeTab, currentPage, activeButton,fetchDataFlag]);

  const fetchUserBets = useCallback(async () => {
    if (!isMounted.current) return;
    setIsLoading(true);
    try {
      const mockBets = [];
      if (isMounted.current) {
        setHistoryData(mockBets);
      }
    } catch (error) {
      if (isMounted.current) {
        setError("Failed to fetch user bets");
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (activeTab === "myHistory") {
      fetchUserBets();
    }
  }, [activeTab, fetchUserBets,fetchDataFlag]);

  useEffect(() => {
    const duration = buttonData[activeButton].duration;
    setTimeRemaining({
      minutes: Math.floor(duration / 60),
      seconds: duration % 60,
    });
    setCurrentPeriod({ periodId: "Loading..." });
    setIsPeriodTransitioning(true);
    setTimeout(() => {
      if (!isConnected) {
        setIsPeriodTransitioning(false);
      }
    }, 500);
  }, [activeButton]);

  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const isValidPair = (redValue, greenValue) => {
    const redDigit = Math.floor(redValue / 11);
    return redDigit !== greenValue;
  };

  const handleOptionClick = (option, type) => {
    if (activeImgTab === "2same") {
      if (type === "twoSame" && [11, 22, 33, 44, 55, 66].includes(option)) {
        setSelectedTwoSameNumbers((prev) => {
          const newSelected = prev.includes(option)
            ? prev.filter((num) => num !== option)
            : [...prev, option].filter((num) =>
              [11, 22, 33, 44, 55, 66].includes(num)
            );
          setSelectedOptions(newSelected);
          setSelectedPair({ red: null, green: null });
          return newSelected;
        });
      } else if (
        type === "pairRed" &&
        [11, 22, 33, 44, 55, 66].includes(option)
      ) {
        setSelectedPair((prev) => {
          const newPair = { ...prev, red: prev.red === option ? null : option };

          if (newPair.red && newPair.green && !isValidPair(newPair.red, newPair.green)) {
            alert("Invalid pair: Same numbers cannot be paired (e.g., 22 cannot be paired with 2)");
            return prev;
          }

          const pair =
            newPair.red && newPair.green ? [newPair.red, newPair.green] : null;
          setSelectedOptions(pair ? [pair] : []);
          setSelectedTwoSameNumbers([]);
          return newPair;
        });
      } else if (type === "pairGreen" && [1, 2, 3, 4, 5, 6].includes(option)) {
        setSelectedPair((prev) => {
          const newPair = {
            ...prev,
            green: prev.green === option ? null : option,
          };

          if (newPair.red && newPair.green && !isValidPair(newPair.red, newPair.green)) {
            alert("Invalid pair: Same numbers cannot be paired (e.g., 22 cannot be paired with 2)");
            return prev;
          }

          const pair =
            newPair.red && newPair.green ? [newPair.red, newPair.green] : null;
          setSelectedOptions(pair ? [pair] : []);
          setSelectedTwoSameNumbers([]);
          return newPair;
        });
      }
    } else if (activeImgTab === "3same") {
      if (
        type === "threeSame" &&
        [111, 222, 333, 444, 555, 666].includes(option)
      ) {
        setSelectedThreeSameNumbers((prev) => {
          const newSelected = prev.includes(option)
            ? prev.filter((num) => num !== option)
            : [...prev, option].filter((num) =>
              [111, 222, 333, 444, 555, 666].includes(num)
            );
          setSelectedOptions(newSelected);
          return newSelected;
        });
      } else if (type === "anyThree") {
        const isCurrentlySelected = selectedOptions.includes("Any 3");
        setSelectedOptions(isCurrentlySelected ? [] : ["Any 3"]);
        setSelectedThreeSameNumbers([]);
      }
    } else if (activeImgTab === "different") {
      const isSelected = selectedOptions.includes(option);
      let newSelectedOptions;
      if (isSelected) {
        newSelectedOptions = selectedOptions.filter((item) => item !== option);
      } else {
        newSelectedOptions = [...selectedOptions, option];
      }
      setSelectedOptions(newSelectedOptions);
      setSelectedTwoSameNumbers([]);
      setSelectedPair({ red: null, green: null });
      setSelectedThreeSameNumbers([]);
    } else {
      setSelectedOptions([option]);
      setSelectedTwoSameNumbers([]);
      setSelectedPair({ red: null, green: null });
      setSelectedThreeSameNumbers([]);
    }
  };

  const getCombinationCount = (n, r) => {
    if (r > n || r < 0) return 0;
    if (r === 0 || r === n) return 1;

    let result = 1;
    for (let i = 0; i < r; i++) {
      result = result * (n - i) / (i + 1);
    }
    return Math.floor(result);
  };

  const calculateDifferentBetAmount = () => {
    let totalAmount = 0;

    const threeDifferentNumbers = selectedOptions.filter(
      (option) => option >= 1 && option <= 6
    );
    const twoDifferentNumbers = selectedOptions.filter(
      (option) => option >= 11 && option <= 16
    );
    const hasContinuous = selectedOptions.includes("3 Continuous");

    if (threeDifferentNumbers.length >= 3) {
      const count = getCombinationCount(threeDifferentNumbers.length, 3);
      totalAmount += count;
    }

    if (hasContinuous) {
      totalAmount += 1;
    }

    if (twoDifferentNumbers.length >= 2) {
      const count = getCombinationCount(twoDifferentNumbers.length, 2);
      totalAmount += count;
    }

    return totalAmount;
  };

  const calculateTotalBetAmount = () => {
    if (activeImgTab === "2same") {
      let totalAmount = 0;

      totalAmount += selectedTwoSameNumbers.length;

      if (selectedPair.red && selectedPair.green && isValidPair(selectedPair.red, selectedPair.green)) {
        totalAmount += 1;
      }

      return totalAmount;
    } else if (activeImgTab === "3same") {
      let totalAmount = 0;

      totalAmount += selectedThreeSameNumbers.length;

      if (selectedOptions.includes("Any 3")) {
        totalAmount += 1;
      }

      return totalAmount;
    } else if (activeImgTab === "different") {
      return calculateDifferentBetAmount();
    } else {
      return selectedOptions.length > 0 ? 1 : 0;
    }
  };

  const getDiceImage = (number) => {
    return diceImages[number] || diceImages[1];
  };

  const formatTime = (num) => num.toString().padStart(2, "0");

  const getDisplayPeriodId = () => {
    return currentPeriod.periodId || "Loading...";
  };

  if (error) {
    return (
      <div className="bg-[#242424] min-h-screen w-full mx-auto flex flex-col items-center justify-center">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#242424]  w-full mx-auto flex flex-col items-center justify-center pr-2 pl-2   pt-20 pb-24">
      <LotteryWingoheader />
      <div className="text-center w-full max-w-sm mx-auto">
        <div className="relative rounded-2xl shadow-lg overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <img
              src={walletbggame}
              alt="wallet background"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-[#4d4d4c] opacity-70 z-10"></div>

          {/* Main content */}
          <div className="relative z-20 p-2">
            {/* Balance + Refresh */}
            <div className="relative flex items-center justify-center ml-2">
              <div className="text-lg font-bold text-white">₹{walletBalance.toFixed(2)}</div>
              <img
                src={refresh}
                alt="Refresh balance"
                className={`w-5 h-5 absolute right-4  top-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-200 ${isRefreshingBalance ? 'animate-spin opacity-50' : 'hover:scale-110'
                  }`}
                onClick={handleRefreshBalance}
                style={{
                  pointerEvents: isRefreshingBalance ? 'none' : 'auto',
                }}
              />
            </div>

            {/* Wallet label */}
            <div className="flex items-center justify-center mb-4 mt-[-2]">
              <img src={wallet} alt="icon" className="w-5 h-5" />
              <span className="ml-2 text-[#f5f3f0] text-xs ">Wallet Balance</span>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-10 mb-2">
              <Link to="/withdraw">
                <button className="bg-[#d23838] text-white text-sm font-semibold px-10 py-2 rounded-full hover:bg-red-600 transition-all">
                  Withdraw
                </button>
              </Link>
              <Link to="/deposit">
                <button className="bg-[#17b15e] text-white text-sm font-semibold px-10 py-2 rounded-full hover:bg-green-600 transition-all">
                  Deposit
                </button>
              </Link>
            </div>


          </div>
        </div>
      </div>


      <div className="bg-[#242424]  w-full h-full mt-2 flex flex-col justify-center">
        <div className="  mt-0">
          <div className="flex justify-between items-center w-full">
            <img src={speaker} alt="icon" className="w-6 h-6 ml-1" />
            <p className="text-xs text-white ml-2 flex-1 opacity-80 transition-opacity duration-1000">
              Thanks to all our members — past and present — for being part of our journey.
            </p>

            <button
              className="text-xs min-w-[80px] px-3 py-[1px] rounded-md flex items-center justify-center gap-1"
              style={{
                backgroundImage: `url(${invitation})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <img src={fire} alt="icon" className="w-3 h-3" /> Detail
            </button>


          </div>
        </div>

        <div className="bg-[#4d4d4c] rounded-lg mt-4 shadow-md">
          <div className="button-container justify-between flex">
            {buttonData.map((button) => (
              <button
                key={button.id}
                onClick={() => handleButtonClick(button.id)}
                className={`flex flex-col items-center px-2 py-2 rounded-lg flex-1 mx-0.5 transition-all duration-300 ${activeButton === button.id
                  ? "bg-gradient-to-b from-[#fae59f] to-[#c4933f] text-[#8f5206]"
                  : "bg-[#4d4d4c] text-[#a8a5a1]"
                  }`}
                style={{
                  textAlign: "center",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  className="icon"
                  style={{ fontSize: "14px", marginBottom: "2px" }}
                >
                  {activeButton === button.id ? button.activeIcon : button.icon}
                </div>
                <span className="text-xs leading-none whitespace-nowrap">{button.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#333332] rounded-lg mt-4 shadow-md mb-2 p-4">
          <div className="flex justify-between mb-2">
            <div>
              <div className="flex items-center">
                <p className="text-[#a8a5a1] mr-3 text-xs">Period</p>
                <div className="border border-[#d9ac4f] rounded-full px-2 py-0.5 text-[#d9ac4f] text-center">
                  <button
                    className="flex items-center gap-1 text-[#d9ac4f] text-xs px-3 rounded-md"
                    onClick={() => setShowHowToPlay(true)}
                  >
                    <img
                      src={howtoplay}
                      alt="How to Play"
                      className="w-2 h-2"
                    />
                    <span className="text-xs">How to Play</span>
                  </button>
                </div>
              </div>
              <p className="text-lg text-[#f5f3f0] mt-1">
                {getDisplayPeriodId()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[#a8a5a1] mb-2 text-xs">Time Remaining</p>
              <div className="flex space-x-0.5 text-[#d9ac4f] justify-end items-center">
                <span className="bg-[#f7e2c5] text-[#8f5206] font-bold text-lg rounded px-1 py-0.5 w-6 text-center">
                  {formatTime(timeRemaining.minutes)[0]}
                </span>
                <span className="bg-[#f7e2c5] text-[#8f5206] font-bold text-lg rounded px-1 py-0.5 w-6 text-center">
                  {formatTime(timeRemaining.minutes)[1]}
                </span>
                <span className="text-[#8f5206] font-bold text-lg px-0.5 w-4 text-center">
                  :
                </span>
                <span className="bg-[#f7e2c5] text-[#8f5206] font-bold text-lg rounded px-1 py-0.5 w-6 text-center">
                  {formatTime(timeRemaining.seconds)[0]}
                </span>
                <span className="bg-[#f7e2c5] text-[#8f5206] font-bold text-lg rounded px-1 py-0.5 w-6 text-center">
                  {formatTime(timeRemaining.seconds)[1]}
                </span>
              </div>
            </div>
          </div>

          <FreezePopup timeRemaining={timeRemaining}>
            <div className="relative bg-[#00b971] p-2 rounded-lg w-full">
              <div className="relative bg-green-950 p-2 rounded-lg w-full overflow-hidden">
                <div className="absolute left-[-10px] top-1/2 transform -translate-y-1/2 w-2 h-6 bg-[#00b971] rounded-l-md z-0"></div>

                <div className="absolute top-0 left-0 h-full w-3 z-10">
                  <div className="absolute top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[16px] border-t-transparent border-b-[16px] border-b-transparent border-l-[12px] border-l-[#00b971]"></div>
                </div>

                <div className="absolute top-0 right-0 h-full w-3 z-10">
                  <div className="absolute top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[16px] border-t-transparent border-b-[16px] border-b-transparent border-r-[12px] border-r-[#00b971]"></div>
                </div>

                <div className="grid grid-cols-3 gap-1">
                  <div className="flex bg-zinc-500 p-1 rounded justify-center">

                    <img
                      src={isConnected && currentResult?.dice_1 ? getDiceImage(currentResult.dice_1) : num1}
                      alt="Dice 1"
                      className="w-16 h-16"
                    />
                  </div>
                  <div className="flex bg-zinc-500 p-1 rounded justify-center">

                    <img
                      src={isConnected && currentResult?.dice_2 ? getDiceImage(currentResult.dice_2) : num1}
                      alt="Dice 2"
                      className="w-16 h-16"
                    />
                  </div>
                  <div className="flex bg-zinc-500 p-1 rounded justify-center">

                    <img
                      src={isConnected && currentResult?.dice_3 ? getDiceImage(currentResult.dice_3) : num1}
                      alt="Dice 3"
                      className="w-16 h-16"
                    />
                  </div>
                </div>
              </div>
            </div>


            <div className="flex gap-1 justify-between mt-2 mb-2">
              {[
                { label: "Total", value: "total" },
                { label: "2 same", value: "2same" },
                { label: "3 same", value: "3same" },
                { label: "Different", value: "different" },
              ].map((tab, index) => {
                const isActive = activeImgTab === tab.value;
                return (
                  <button
                    key={index}
                    className={`flex-1 px-2 py-3 text-xs text-center rounded-t-md ${isActive
                      ? "bg-[#d9ac4f] text-[#8f5206]"
                      : "text-[#a8a5a1]"
                      } focus:outline-none`}
                    style={!isActive ? { backgroundColor: "#4d4d4c" } : {}}
                    onClick={() => setActiveImgTab(tab.value)}
                  >
                    {tab.label}
                  </button>

                );
              })}
            </div>
          </FreezePopup>

          {activeImgTab === "total" && (
            <div className="grid grid-cols-4 gap-3 ml-3">
              {imageUrls.map((image, index) => (
                <div key={index} className="flex flex-col items-center mt-4 relative w-12 h-12">
                  <img
                    src={image.url}
                    alt={`Ball ${image.number}`}
                    className="w-14 h-14 cursor-pointer"
                    onClick={() => handleOptionClick(image.number)}
                  />
                  <span
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold"
                    style={{ color: image.textColor }}
                  >
                    {image.number}
                  </span>
                  <span className="text-xs text-white mt-1" style={{ color: "#a8a5a1" }}>{image.description}</span>
                </div>
              ))}
              <div className="col-span-4 flex justify-between text-xs mt-4 -ml-5 gap-1 -mr-2">
                {["Big 1.98", "Small 1.98", "Odd 1.98", "Even 1.98"].map((label, idx) => {
                  const commonClasses =
                    "text-white px-6 py-1 rounded-md hover:opacity-90 text-center cursor-pointer";
                  const gradientStyle =
                    idx === 0
                      ? {
                        background:
                          "-webkit-linear-gradient(top, #FF827A 0%, #E93333 68.18%)",
                      }
                      : {};
                  const fallbackBg = [
                    "",
                    "bg-[#00b971]",
                    "bg-blue-500",
                    "bg-yellow-500",
                  ];
                  return (
                    <button
                      key={idx}
                      className={`${commonClasses} ${idx !== 0 ? fallbackBg[idx] : ""}`}
                      style={gradientStyle}
                      onClick={() => handleOptionClick(label.split(" ")[0])}
                    >
                      {label.split(" ").map((word, i) => (
                        <span key={i} className="block">
                          {word}
                        </span>
                      ))}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeImgTab === "2same" && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm font-medium text-white">
                <span>2 matching numbers: odds (13.83)</span>
                <img
                  src={mark}
                  alt="mark"
                  className="h-5 w-5 cursor-pointer"
                  onClick={() => setShowTwoSamePopup(true)}
                />
              </div>
              <div className="flex justify-center text-sm space-x-2">
                {[11, 22, 33, 44, 55, 66].map((value, index) => (
                  <div
                    key={index}
                    className={`w-14 h-12 flex flex-col justify-center items-center text-white bg-purple-600 rounded-md shadow cursor-pointer relative ${selectedTwoSameNumbers.includes(value)
                      ? "bg-opacity-70"
                      : ""
                      }`}
                    onClick={() => handleOptionClick(value, "twoSame")}
                  >
                    <span className="text-lg">{value}</span>
                    {selectedTwoSameNumbers.includes(value) && (
                      <span className="absolute bottom-1 right-1 flex items-center justify-center w-4 h-4 bg-white rounded-full text-cyan-400 text-xs">
                        ✔
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center space-x-2 text-sm font-medium text-white">
                <span>A pair of unique numbers: odds (69.12)</span>
                <img
                  src={mark}
                  alt="mark"
                  className="h-5 w-5 cursor-pointer"
                  onClick={() => setShowTwoSamePopup(true)}
                />
              </div>
              <div className="flex justify-center space-x-2">
                {[11, 22, 33, 44, 55, 66].map((value, index) => (
                  <div
                    key={index}
                    className={`w-14 h-12 flex flex-col justify-center items-center text-white bg-red-500 rounded-md shadow cursor-pointer relative ${selectedPair.red === value ? "bg-opacity-70" : ""
                      }`}
                    onClick={() => handleOptionClick(value, "pairRed")}
                  >
                    <span className="text-lg">{value}</span>
                    {selectedPair.red === value && (
                      <span className="absolute bottom-1 right-1 flex items-center justify-center w-4 h-4 bg-white rounded-full text-cyan-400 text-xs">
                        ✔
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5, 6].map((value, index) => (
                  <div
                    key={index}
                    className={`w-14 h-12 flex flex-col justify-center items-center text-white bg-green-600 rounded-md shadow cursor-pointer relative ${selectedPair.green === value ? "bg-opacity-70" : ""
                      }`}
                    onClick={() => handleOptionClick(value, "pairGreen")}
                  >
                    <span className="text-lg">{value}</span>
                    {selectedPair.green === value && (
                      <span className="absolute bottom-1 right-1 flex items-center justify-center w-4 h-4 bg-white rounded-full text-cyan-400 text-xs">
                        ✔
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeImgTab === "3same" && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm font-medium text-white">
                <span>3 of the same number: odds (207.36)</span>
                <img
                  src={mark}
                  alt="mark"
                  className="h-5 w-5 cursor-pointer"
                  onClick={() => setShowThreeSamePopup(true)}
                />
              </div>
              <div className="flex justify-center space-x-2">
                {[111, 222, 333, 444, 555, 666].map((value, index) => (
                  <div
                    key={index}
                    className={`w-14 h-12 flex flex-col justify-center items-center text-white bg-purple-600 rounded-md shadow cursor-pointer relative ${selectedThreeSameNumbers.includes(value)
                      ? "bg-opacity-70"
                      : ""
                      }`}
                    onClick={() => handleOptionClick(value, "threeSame")}
                  >
                    <span className="text-lg">{value}</span>
                    {selectedThreeSameNumbers.includes(value) && (
                      <span className="absolute bottom-1 right-1 flex items-center justify-center w-4 h-4 bg-white rounded-full text-cyan-400 text-xs">
                        ✔
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center space-x-2 text-sm font-medium text-white">
                <span>Any 3 of the same number: odds (34.56)</span>
                <img
                  src={mark}
                  alt="mark"
                  className="h-5 w-5 cursor-pointer"
                  onClick={() => setShowThreeSamePopup(true)}
                />
              </div>
              <div className="flex justify-center">
                <button
                  className={`w-full bg-red-600 text-white text-sm font-semibold py-3 rounded-md shadow cursor-pointer ${selectedOptions.includes("Any 3") ? "bg-opacity-70" : ""
                    }`}
                  onClick={() => handleOptionClick("Any 3", "anyThree")}
                >
                  Any 3 of the same number: odds
                  {selectedOptions.includes("Any 3") && (
                    <span className="absolute bottom-1 right-1 flex items-center justify-center w-4 h-4 bg-white rounded-full text-cyan-400 text-xs">
                      ✔
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}

          {activeImgTab === "different" && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm font-medium text-white">
                <span>3 different numbers: odds (34.56)</span>
                <img
                  src={mark}
                  alt="mark"
                  className="h-5 w-5 cursor-pointer"
                  onClick={() => setShowDifferentPopup(true)}
                />
              </div>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5, 6].map((value, index) => (
                  <div
                    key={index}
                    className={`w-12 h-10 flex justify-center items-center text-white bg-purple-600 rounded-md shadow cursor-pointer relative ${selectedOptions.includes(value) ? "bg-opacity-70" : ""
                      }`}
                    onClick={() => handleOptionClick(value, "threeDifferent")}
                  >
                    {value}
                    {selectedOptions.includes(value) && (
                      <span className="absolute bottom-1 right-1 flex items-center justify-center w-4 h-4 bg-white rounded-full text-cyan-400 text-xs">
                        ✔
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center space-x-2 text-sm font-medium text-white">
                <span>3 continuous numbers: odds (8.64)</span>
                <img
                  src={mark}
                  alt="mark"
                  className="h-5 w-5 cursor-pointer"
                  onClick={() => setShowDifferentPopup(true)}
                />
              </div>
              <div className="flex justify-center">
                <button
                  className={`w-full bg-red-600 text-white text-sm font-semibold py-3 rounded-md shadow cursor-pointer ${selectedOptions.includes("3 Continuous") ? "bg-opacity-70" : ""
                    }`}
                  onClick={() => handleOptionClick("3 Continuous", "continuous")}
                >
                  3 continuous numbers
                  {selectedOptions.includes("3 Continuous") && (
                    <span className="absolute bottom-1 right-1 flex items-center justify-center w-4 h-4 bg-white rounded-full text-cyan-400 text-xs">
                      ✔
                    </span>
                  )}
                </button>
              </div>
              <div className="flex items-center space-x-2 text-sm font-medium text-white">
                <span>2 different numbers: odds (6.91)</span>
                <img
                  src={mark}
                  alt="mark"
                  className="h-5 w-5 cursor-pointer"
                  onClick={() => setShowDifferentPopup(true)}
                />
              </div>
              <div className="flex justify-center space-x-2">
                {[
                  { value: 11, label: "1" },
                  { value: 12, label: "2" },
                  { value: 13, label: "3" },
                  { value: 14, label: "4" },
                  { value: 15, label: "5" },
                  { value: 16, label: "6" },
                ].map(({ value, label }, index) => (
                  <div
                    key={index}
                    className={`w-12 h-10 flex justify-center items-center text-white bg-purple-600 rounded-md shadow cursor-pointer relative ${selectedOptions.includes(value) ? "bg-opacity-70" : ""
                      }`}
                    onClick={() => handleOptionClick(value, "twoDifferent")}
                  >
                    {label}
                    {selectedOptions.includes(value) && (
                      <span className="absolute bottom-1 right-1 flex items-center justify-center w-4 h-4 bg-white rounded-full text-cyan-400 text-xs">
                        ✔
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <BettingModal
          activeImgTab={activeImgTab}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
          selectedTwoSameNumbers={selectedTwoSameNumbers}
          setSelectedTwoSameNumbers={setSelectedTwoSameNumbers}
          selectedPair={selectedPair}
          setSelectedPair={setSelectedPair}
          selectedThreeSameNumbers={selectedThreeSameNumbers}
          setSelectedThreeSameNumbers={setSelectedThreeSameNumbers}
          betAmount={betAmount}
          setBetAmount={setBetAmount}
          quantity={quantity}
          setQuantity={setQuantity}
          selectedMultiplier={selectedMultiplier}
          setSelectedMultiplier={setSelectedMultiplier}
          checked={checked}
          setChecked={setChecked}
          currentPeriod={currentPeriod}
          placeBet={placeBet}
          setShowSuccessPopup={setShowSuccessPopup}
          setShowTwoSamePopup={setShowTwoSamePopup}
          setShowThreeSamePopup={setShowThreeSamePopup}
          calculateTotalBetAmount={calculateTotalBetAmount}
          getCombinationCount={getCombinationCount}
          gameType={gameType}
          activeButton={activeButton}
          buttonData={buttonData}
          setError={setError}
        />

        {showSuccessPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]">
            <div className="bg-[#201d2b] rounded-2xl shadow-lg w-[90%] max-w-[300px] p-6 text-center">
              <div className="text-white text-lg font-bold mb-4">Success</div>
              <p className="text-white text-sm mb-6">
                Your bet has been placed successfully!
              </p>
              <button
                onClick={() => setShowSuccessPopup(false)}
                className="bg-gradient-to-b from-[#fae59f] to-[#c4933f] text-[#8f5206] px-6 py-2 rounded-full font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {showPreSalePopup && (
          <div className="fixed inset-0 bg-[#201d2b] bg-opacity-60 flex items-center justify-center z-[60]">
            <div className="bg-[#201d2b] text-white rounded-3xl shadow-lg w-[90%] max-w-[360px] p-4 relative mt-[-5vh]">
              <div className="bg-gradient-to-b from-[#FAE59F] to-[#C4933F] text-white text-center py-3 text-lg font-normal rounded-t-2xl w-full absolute top-0 left-0">
                《Pre-sale rules》
              </div>
              <div className="text-sm text-white max-h-[45vh] overflow-y-auto p-3 mt-8 leading-[2.5]">
                <p>
                  In order to protect the legitimate rights and interests of
                  users participating in the pre-sale and maintain the normal
                  operating order of the pre-sale, these rules are formulated in
                  accordance with relevant agreements and regulations.
                </p>
                <ol className="list-decimal pl-4">
                  <li>
                    <strong>Pre-sale definition:</strong> Refers to a sales
                    model in which a seller offers a bundle of a product or
                    service collectively.
                  </li>
                  <li>
                    <strong>Pre-sale process:</strong> Customers place an order,
                    make a deposit, and the product is delivered at a specified
                    date.
                  </li>
                  <li>
                    <strong>Cancellation policy:</strong> Orders can be canceled
                    before the final payment, but deposits may be non-refunded.
                  </li>
                  <li>
                    <strong>Pre-sale system:</strong> This helps sellers
                    organize product launches and ensures smooth transactions.
                  </li>
                  <li>
                    <strong>Pricing:</strong> Pre-sale items have two components
                    – deposit and final payment.
                  </li>
                  <li>
                    <strong>Refunds:</strong> Refunds are only applicable under
                    certain conditions.
                  </li>
                </ol>
              </div>
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setShowPreSalePopup(false)}
                  className="bg-gradient-to-b from-[#FAE59F] to-[#C4933F] rounded-lg text-white px-8 py-2 font-normal shadow-md"
                >
                  I know
                </button>
              </div>
            </div>
          </div>
        )}

        {showTwoSamePopup && (
          <div className="fixed inset-0 bg-[#201d2b] bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative">
              <div className="bg-[#201d2b] text-[#a8a5a1] rounded-lg p-6 w-80 shadow-xl">
                <div className="flex justify-center mb-4">
                  {selectedTwoSameNumbers.map((num) => (
                    <img
                      key={num}
                      src={getDiceImage(Math.floor(num / 11))}
                      alt={`Dice ${num}`}
                      className="w-16 h-16 mr-2"
                    />
                  ))}
                  {selectedPair.red && selectedPair.green && (
                    <>
                      <img
                        src={getDiceImage(Math.floor(selectedPair.red / 11))}
                        alt={`Dice ${selectedPair.red}`}
                        className="w-16 h-16 mr-2"
                      />
                      <img
                        src={getDiceImage(selectedPair.green)}
                        alt={`Dice ${selectedPair.green}`}
                        className="w-16 h-16"
                      />
                    </>
                  )}
                </div>
                <p className="text-center text-sm mb-4 leading-tight">
                  {selectedTwoSameNumbers.length > 0
                    ? "Choose 2 same numbers. If the draw results match your selection, you win (different numbers)."
                    : "Choose one number from red and one from green. If the draw results match your pair, you win."}
                </p>
              </div>
              <button
                className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 w-8 h-8 flex items-center justify-center border border-white rounded-full text-white text-xl z-50"
                onClick={() => setShowTwoSamePopup(false)}
              >
                ×
              </button>
            </div>
          </div>
        )}

        {showThreeSamePopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative">
              <div className="bg-[#333332] text-white rounded-lg p-6 w-80 shadow-xl relative">
                <div className="flex justify-center mb-4">
                  {selectedThreeSameNumbers.map((num) => (
                    <img
                      key={num}
                      src={getDiceImage(Math.floor(num / 111))}
                      alt={`Dice ${num}`}
                      className="w-16 h-16 mr-2"
                    />
                  ))}
                  {selectedOptions.includes("Any 3") && (
                    <>
                      <img src={num4} alt="Dice 1" className="w-16 h-16 mr-2" />
                      <img src={num4} alt="Dice 2" className="w-16 h-16 mr-2" />
                      <img src={num4} alt="Dice 3" className="w-16 h-16" />
                    </>
                  )}
                </div>
                <p className="text-center text-sm mb-4 leading-tight">
                  {selectedThreeSameNumbers.length > 0
                    ? "Choose 3 same numbers. If the draw results match your selection, you win (unless numbers are the same)."
                    : "Choose 'Any 3 of the same number' for a chance to win if any three dice match."}
                </p>
              </div>
              <button
                onClick={() => setShowThreeSamePopup(false)}
                className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2"
              >
                <img src={close} alt="icon" className="h-6 w-6" />
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between space-x-2 mb-6 ">
          <button
            className={`w-full min-w-[120px] px-6 py-2 text-sm rounded-lg shadow whitespace-nowrap text-center flex justify-center ${activeTab === "gameHistory"
              ? "bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-[#8f5206] font-bold"
              : "bg-[#333332] text-[#a8a5a1] font-normal"
              }`}
            onClick={() => setActiveTab("gameHistory")}
          >
            Game history
          </button>
          <button
            className={`w-full min-w-[100px] px-6 py-2 text-sm rounded-lg shadow whitespace-nowrap text-center flex justify-center ${activeTab === "chart"
              ? "bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-[#8f5206] font-bold"
              : "bg-[#333332] text-[#a8a5a1] font-normal"
              }`}
            onClick={() => setActiveTab("chart")}
          >
            Chart
          </button>
          <button
            className={`w-full min-w-[110px] px-6 py-2 text-sm rounded-lg shadow whitespace-nowrap text-center flex justify-center ${activeTab === "myHistory"
              ? "bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-[#8f5206] font-bold"
              : "bg-[#333332] text-[#a8a5a1] font-normal"
              }`}
            onClick={() => setActiveTab("myHistory")}
          >
            My History
          </button>
        </div>

        <div className="mb-2 rounded-lg shadow">
          {activeTab === "gameHistory" && (
            <div>
              <table className="table-auto bg-[#333332] rounded-lg w-full text-center">
                <thead>
                  <tr className="bg-[#3a3947] text-white">
                    <th className="px-2 py-2 text-center text-sm">Period</th>
                    <th className="px-2 py-2 text-center text-sm">Sum</th>
                    <th className="px-2 py-2 text-center text-sm">Results</th>
                  </tr>
                </thead>
                <tbody>
                  {gameHistoryData.length > 0 ? (
                    gameHistoryData.map((entry, index) => {
                      const isBig = entry.sum >= 11;
                      const isEven = entry.sum % 2 === 0;
                      return (
                        <tr key={index} className="bg-[#333332]">
                          <td className="text-xs text-[#f5f3f0] ">
                            <span className="ml-2">{entry.periodId}</span>
                          </td>
                          <td className="px-2 py-2 text-xs text-[#f5f3f0] whitespace-nowrap">
                            <div className="flex justify-center items-center">
                              <span className="inline-block w-[19px] text-right">{entry.sum}</span>
                              <span className="inline-block w-[38px] text-left ml-7">{isBig ? "Big" : "Small"}</span>
                            </div>
                          </td>







                          <td className="px-2 py-2 text-xs text-[#f5f3f0] text-center">
                            <div className="flex items-center justify-center space-x-1 overflow-hidden">
                              <span className="mr-3">
                                {isEven ? "Even" : "Odd"}
                              </span>
                              <img
                                src={diceImages[entry.dice1] || diceImages[1]}
                                alt={`Dice ${entry.dice1}`}
                                className="w-5 h-5 object-contain"
                              />
                              <img
                                src={diceImages[entry.dice2] || diceImages[1]}
                                alt={`Dice ${entry.dice2}`}
                                className="w-5 h-5 object-contain"
                              />
                              <img
                                src={diceImages[entry.dice3] || diceImages[1]}
                                alt={`Dice ${entry.dice3}`}
                                className="w-5 h-5 object-contain"
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-2 py-2 text-xs text-[#f5f3f0] text-center">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "chart" && (
            <div>
              <table className="table-auto bg-[#3f3f3e] rounded-lg w-full text-left">
                <thead>
                  <tr className="bg-[#3a3947] text-white rounded-lg">
                    <th className="px-2 py-2 text-center">Period</th>
                    <th className="px-2 py-2 text-center">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.length > 0 ? (
                    chartData.map((entry, index) => (
                      <tr key={index} className="bg-[#3f3f3e]">
                        <td className="px-2 text-[#f5f3f0] text-sm py-2 text-center">
                          {entry.periodId}
                        </td>
                        <td className="px-2 py-2 text-sm text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <img
                              src={diceImages[entry.dice1] || diceImages[1]}
                              alt={`Dice ${entry.dice1}`}
                              className="w-6 h-6"
                            />
                            <img
                              src={diceImages[entry.dice2] || diceImages[1]}
                              alt={`Dice ${entry.dice2}`}
                              className="w-6 h-6"
                            />
                            <img
                              src={diceImages[entry.dice3] || diceImages[1]}
                              alt={`Dice ${entry.dice3}`}
                              className="w-6 h-6"
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="px-2 py-2 text-sm text-[#f5f3f0] text-center">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "myHistory" && (
            <div className="p-4 mb-4 text-right">
              {historyData.length > 0 ? (
                historyData.map((history, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-start border-b pb-4 mb-4"
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-[#00b971] rounded-md mb-2 mr-3"></div>
                      <div>
                        <p className="text-gray-700">{history.id}</p>
                        <p className="text-gray-500 text-sm">
                          Date: {history.date || "N/A"}
                        </p>
                        <p className="text-gray-500 text-sm">
                          Time: {history.time || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[#00b971] mt-2 border text-right rounded text-sm px-2 border-[#00b971]">
                        {history.detail || "Detail"}
                      </p>
                      <p className="text-[#00b971] mt-2 border rounded text-sm px-2 border-[#00b971]">
                        {history.status || "Succeed"}
                      </p>
                      <p className="text-black font-medium">
                        {history.amount || "$0"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center bg-[#4d4d4c]">
                  <div className="flex flex-col bg-[#4d4d4c] items-center justify-center">
                    <img
                      src={empty}
                      alt="No Data"
                      className="w-64 h-60 object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="text-center mb-0 w-full mt-2">
          <div className="bg-[rgb(77,77,76)] bg-opacity-40 rounded-xl shadow-lg p-4 flex items-center justify-center">
            <button
              className="p-3 text-[#a8a5a1] bg-[#6f7381] rounded-lg disabled:opacity-50"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <IoIosArrowBack className="w-5 h-5" />
            </button>
            <span className="px-8 text-sm text-[#a8a5a1] font-semibold">
              {currentPage} / {totalPages}
            </span>
            <button
              className="p-3 text-[#8f5206] bg-[#d9ac4f] rounded-lg disabled:opacity-50"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <IoIosArrowForward />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LotteryK3;