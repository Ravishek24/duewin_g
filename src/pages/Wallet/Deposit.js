import React, { useEffect, useState } from "react";
import DepositHeader from "../../components/DepositHeader";
import { AiOutlineFileText } from "react-icons/ai";
import { BsDiamondFill } from "react-icons/bs";
import bgImage from "../../Assets/wcard.png";
import balanceIcon from "../../Assets/wbal.png";
import paytm from "../../Assets/gamesimage/paytm.png";
import upi from "../../Assets/gamesimage/UPI.png";
import all from "../../Assets/gamesimage/all.png";
import tpay from "../../Assets/gamesimage/Tpay.png";
import cross from "../../Assets/cross.png";
import iconshouming from "../../Assets/finalicons/iconshouming.png";
import deposit from "../../Assets/finalicons/deposit-copy-icon.png";
import { FaCopy } from "react-icons/fa"; // Copy icon
import { Check } from "lucide-react"; // White tick icon from lucide-react
import iconquickpay from "../../Assets/finalicons/iconquickpay.png";
import refresh from "../../Assets/finalicons/refresh.png";
import apiServices from "../../api/apiServices";
import CommanHeader from "../../components/CommanHeader";
const paymentChannel = [
  { name: "Ok Pay", balance: "500 - 50K", key: "OKPAY", isHighlight: true },
  { name: "GH Pay", balance: "500 - 50K", key: "GHPAY", isHighlight: false },
  { name: "CH Pay", balance: "200 - 50K", key: "CHPAY", isHighlight: false },
  { name: "P Pay", balance: "500 - 50K", key: "PPAY", isHighlight: false },
  { name: "07 Pay", balance: "100 - 50K", key: "07PAY", isHighlight: false },
  { name: "L Pay", balance: "1000 - 50K", key: "LPAY", isHighlight: false },
];

const Deposit = () => {
  const [inputAmount, setInputAmount] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");
  const [paymentChannelList, setPaymentChannelList] = useState(paymentChannel);
  const [selectedChannel, setSelectedChannel] = useState(paymentChannel[0]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAmountSelected, setIsAmountSelected] = useState(false);

  const [showPopup, setShowPopup] = useState({
    visible: false,
    orderNumber: "",
  }); // State for popup
  const [withdrawHistory, setWithDrawHistory] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [page, setPage] = useState(1);
  const fetchWithdrawals = async () => {
    try {
      const data = await apiServices.getDepositHistory(page, 10);
      setWithDrawHistory(data.recharges || []);
    } catch (err) {
      // setError("Failed to fetch withdrawal history");
      console.log(err);
    }
  };
  const fetchWalletBalance = async () => {
    try {
      const response = await apiServices?.getWalletBalance();
      if (response?.success && response?.mainWallet) {
        const balance = Number(response.mainWallet.balance) || 0;
        const thirdPartyBalance =
          Number(response?.thirdPartyWallet?.balance) || 0;
        setWalletBalance((balance + thirdPartyBalance).toFixed(2));
      } else {
        setWalletBalance(0);
      }
    } catch (error) {
      console.error("Failed to fetch wallet balance:", error);
      setWalletBalance(0);
    }
  };
  useEffect(() => {
    fetchWithdrawals();
    fetchWalletBalance();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value)) {
      setInputAmount(value);
      setIsAmountSelected(value !== "");
    }
  };

  const handlePresetAmountClick = (amount) => {
    let numericAmount = amount;
    if (typeof amount === "string" && amount.toLowerCase().includes("k")) {
      numericAmount = parseFloat(amount) * 1000;
    }

    setInputAmount(numericAmount.toString());
  };

  const handleChannelSelect = (selected) => {
    const updatedChannels = paymentChannelList.map((channel) => ({
      ...channel,
      isHighlight: channel.key === selected.key, // only selected gets true
    }));
    setPaymentChannelList(updatedChannels);
    setSelectedChannel(selected);
  };

  const handlePaymentWaySelect = (payment) => {
    setSelectedPayment(payment.key);
  };

  const clearInput = () => {
    setInputAmount("");
  };

  const handleCopyOrderNumber = (orderNumber) => {
    navigator.clipboard.writeText(orderNumber);
    setShowPopup({ visible: true, orderNumber });
    setTimeout(() => setShowPopup({ visible: false, orderNumber: "" }), 2000); // Hide popup after 2 seconds
  };

  const submitPayment = async () => {
    if (!selectedPayment) {
      alert("Please select a payment method");
      return;
    }

    if (!inputAmount || isNaN(inputAmount) || Number(inputAmount) < 100) {
      alert("Please enter a valid amount (minimum ₹100)");
      return;
    }

    if (!selectedChannel) {
      alert("Please select a payment channel");
      return;
    }
    const payload = {
      amount: Number(inputAmount),
      gateway: selectedChannel.key,
    };
    if (selectedChannel.key == "OKPAY") {
      payload.pay_type = selectedPayment;
    }

    try {
      setIsSubmitting(true);
      const res = await apiServices.depositPayment(payload);
      if (res?.success) {
        window.location.href = res?.paymentUrl;
        setInputAmount("");
        setSelectedChannel("");
      } else {
        alert(res?.message || "Deposit failed. Please try again.");
      }
    } catch (error) {
      console.error("Deposit error:", error);
      alert("An error occurred while processing the deposit.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#242424] min-h-screen flex flex-col w-full items-center justify-center mt-4">
      <CommanHeader
        title="Deposit"
        rightButtonText="Deposit History"
        navigateValue="/deposit-history"
      />
      <div className="w-full min-h-screen mt-8 bg-[#242424] p-3 text-[#8f5206] font-sans">
        {/* Balance Card */}
        <div
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "100%",
            backgroundPosition: "top",
            borderRadius: ".26667rem",
          }}
          className="bg-cover bg-center p-4 rounded-xl h-[145px] flex flex-col justify-between relative"
        >
          <div className="flex items-center space-x-2">
            <img src={balanceIcon} alt="Balance Icon" className="w-4 h-4" />
            <span className="text-sm">Balance</span>
          </div>

          <div className="absolute top-[30%] left-4 flex items-center gap-2 text-3xl font-bold">
            ₹{walletBalance}
            <img
              onClick={fetchWalletBalance}
              src={refresh}
              alt="icon"
              className="h-5 w-7"
            />
          </div>
        </div>

        {/* Payment Options */}
        <div className="grid grid-cols-4 gap-1 mb-4">
          {[
            { name: "UPI-QRpay", img: upi, key: "UPI" },
            { name: "USDT", img: tpay, key: "USDT" },
          ].map((item, index) => (
            <div
              key={index}
              onClick={() => handlePaymentWaySelect(item)}
              className={`p-1 rounded-md text-center cursor-pointer relative flex flex-col items-center justify-center ${
                selectedPayment === item.key
                  ? "bg-gradient-to-r from-[#fae59f] to-[#c4933f]"
                  : "bg-[#333332] hover:bg-neutral-700"
              }`}
              style={{ width: "79px", height: "87px" }}
            >
              <img
                src={item.img}
                className="w-12 h-12 mx-auto mb-2"
                alt={item.name}
              />
              <div
                className="text-base text-xs"
                style={{
                  color: selectedPayment === item.key ? "#8f5206" : "#a8a5a1",
                }}
              >
                {item.name}
              </div>
            </div>
          ))}
        </div>
        {/* Deposit Amount (for non-USDT selections) */}
        {selectedPayment == "UPI" && (
          <>
            {/* Payment Channels (for non-USDT selections) */}
            <div className="bg-[#333332] p-3 rounded-xl mt-4">
              <div className="flex items-center gap-2 mb-3">
                <img src={iconquickpay} alt="icon" className="h-8 w-8" />
                <span className="font-semibold text-white">Select channel</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {paymentChannelList?.map((item, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-xl cursor-pointer transition relative ${
                      item.isHighlight
                        ? "bg-gradient-to-r from-[#fae59f] to-[#c4933f]"
                        : "bg-[#4d4d4c] hover:bg-neutral-700"
                    }`}
                    onClick={() => handleChannelSelect(item)}
                  >
                    <div className="font-semibold text-neutral-400 text-sm">
                      {item.name}
                    </div>
                    <div className="text-neutral-400 text-sm">
                      Balance: {item.balance}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recharge Instructions */}

            <div className="bg-[#333332] mt-4 p-3 rounded-xl text-white">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-[#d9ac4f]">
                  payments
                </span>
                <h2 className="text-lg font-semibold">Deposit amount</h2>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {["500", "1K", "5K", "10K", "20K", "50K"].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handlePresetAmountClick(amount)}
                    className="border border-[#666462] hover:bg-neutral-700 transition-colors rounded-lg py-2 text-[#d9ac4f]"
                  >
                    <span className="text-[#666462]"> ₹ </span> {amount}
                  </button>
                ))}
              </div>

              <div className="relative mb-6">
                <div className="flex items-center bg-neutral-800 rounded-full px-4 py-3">
                  <span className="text-[#d9ac4f] mr-2">₹</span>
                  <input
                    type="number"
                    placeholder="Please enter the amount"
                    value={inputAmount}
                    onChange={handleInputChange}
                    className="bg-transparent w-full outline-none placeholder-neutral-400"
                    min="100"
                  />
                </div>
              </div>

              <button
                className={`w-full transition-colors rounded-full py-3 mb-2 ${
                  selectedPayment && selectedChannel && inputAmount >= 110
                    ? "bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-[#8f5206]"
                    : "bg-[#6f7381] text-white"
                }`}
                disabled={
                  !selectedPayment ||
                  !selectedChannel ||
                  Number(inputAmount) < 110 ||
                  isSubmitting
                }
                onClick={submitPayment}
              >
                {isSubmitting ? "Processing..." : "Deposit"}
              </button>
            </div>
            <div className="bg-[#333332] mt-4 p-3 rounded-xl text-white">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-500 mb-2">
                  <img src={iconshouming} alt="icon" className="h-8 w-8" />
                  <h3 className="font-semibold text-[#f5f3f0]">
                    Recharge Instructions
                  </h3>
                </div>

                <div className="border p-4 rounded-xl space-y-2 border-[#666462]">
                  {[
                    "If the transfer time is up, please fill out the deposit form again.",
                    "The transfer amount must match the order you created, otherwise the money cannot be credited successfully.",
                    "If you transfer the wrong amount, our company will not be responsible for the lost amount!",
                    "Note: do not cancel the deposit order after the money has been transferred.",
                  ].map((instruction, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 text-neutral-400 text-sm"
                    >
                      <BsDiamondFill className="text-amber-500 text-sm mt-1" />
                      <p>{instruction}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Conditional Rendering Based on Payment Selection */}
        {selectedPayment === "USDT" ? (
          <>
            {/* Select Channel Section */}
            <div className="bg-[#333332] mt-4 p-3 rounded-xl text-white">
              <div className="flex items-center gap-2 mb-3">
                <img src={iconquickpay} alt="icon" className="h-7 w-7" />
                <span className="font-semibold text-white">Select channel</span>
              </div>
              <div className="space-y-2">
                {[
                  {
                    name: "Upay-USDT",
                    balance: "Balance: 10 - 100K",
                    bonus: "2% bonus",
                    highlight: true,
                  },
                  {
                    name: "Tron-USDT",
                    balance: "Balance: 10 - 100K",
                    bonus: "2% bonus",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleChannelSelect(item.name)}
                    className={`p-3 rounded-xl cursor-pointer transition flex items-center justify-between ${
                      selectedChannel === item.name
                        ? "bg-gradient-to-r from-[#fae59f] to-[#c4933f]"
                        : "bg-[#4d4d4c] hover:bg-neutral-700"
                    }`}
                  >
                    <div className="flex items-center">
                      <img src={tpay} alt="icon" className="h-10 w-10 mr-4" />
                      <div>
                        <div className="font-semibold  text-[14px]">
                          {item.name}
                        </div>
                        <div className="text-[14px]">{item.balance}</div>
                      </div>
                    </div>
                    <div className="text-amber-500 text-sm">{item.bonus}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Select Amount of USDT */}
            <div className="bg-[#333332] mt-4 p-3 rounded-xl text-white">
              <div className="flex items-center gap-2 mb-6">
                <img src={tpay} alt="icon" className="h-7 w-7" />
                <h2 className="text-lg font-semibold">Select amount of USDT</h2>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {["10", "50", "100", "500", "1K", "5K"].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handlePresetAmountClick(amount)}
                    className="flex items-center justify-center bg-[#4d4d4c] hover:bg-neutral-700 transition-colors rounded-lg py-2 text-[#d9ac4f] border border-[#666462]"
                  >
                    <img src={tpay} alt="icon" className="h-6 w-6 mr-2" />
                    {amount}
                  </button>
                ))}
              </div>

              <div className="relative mb-4">
                <div className="flex items-center bg-neutral-800 rounded-full px-4 py-3">
                  <img src={tpay} alt="icon" className="h-6 w-6 mr-2" />
                  <input
                    type="text"
                    placeholder="Please enter USDT amount"
                    value={inputAmount}
                    onChange={handleInputChange}
                    className="bg-transparent w-full outline-none placeholder-neutral-400 text-white"
                  />
                  <button
                    onClick={clearInput}
                    className="text-neutral-400 hover:text-neutral-300"
                  >
                    <img src={cross} alt="cross" className="h-7 w-8" />
                  </button>
                </div>
              </div>

              <div className="relative mb-6">
                <div className="flex items-center bg-neutral-800 rounded-full px-4 py-3">
                  <span className="text-[#d9ac4f] mr-2">₹</span>
                  <input
                    type="text"
                    placeholder="Please enter the amount"
                    value={inputAmount}
                    onChange={handleInputChange}
                    className="bg-transparent w-full outline-none placeholder-neutral-400 text-white"
                  />
                  <button
                    onClick={clearInput}
                    className="text-neutral-400 hover:text-neutral-300"
                  >
                    <img src={cross} alt="cross" className="h-7 w-8" />
                  </button>
                </div>
              </div>

              <button
                className={`w-full transition-colors rounded-full py-3 ${
                  isAmountSelected
                    ? "bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-[#8f5206]"
                    : "bg-[#6f7381] text-white"
                }`}
              >
                Deposit
              </button>
            </div>

            {/* Recharge Instructions */}
            <div className="bg-[#333332] mt-4 p-3 rounded-xl text-white">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-500 mb-2">
                  <img src={iconshouming} alt="icon" className="h-8 w-8" />
                  <h3 className="font-semibold text-[#f5f3f0]">
                    Recharge Instructions
                  </h3>
                </div>

                <div className="border p-4 rounded-xl space-y-2 border-[#666462]">
                  {[
                    "Minimum deposit: 10USDT, deposits less than 10USDT will not be credited",
                    "Do not deposit any non-currency assets to the above address, or the assets will not be recovered.",
                    "Please confirm that the operating environment is safe to avoid information being tampered with or leaked.",
                    "The transfer amount must match the order you created, otherwise the money cannot be credited successfully.",
                    "Note: do not cancel the deposit order after the money has been transferred.",
                  ].map((instruction, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 text-neutral-400 text-sm"
                    >
                      <BsDiamondFill className="text-amber-500 text-sm mt-1" />
                      <p>{instruction}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Deposit History */}
            <div className="bg-[#242424] rounded-xl font-sans mt-6">
              <div className="flex items-center gap-3 mb-4">
                <img src={deposit} alt="icon" className="h-6 w-6" />
                <h2 className="text-neutral-200 text-lg font-medium">
                  Deposit history
                </h2>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}

        <div className="bg-[#242424] rounded-xl font-sans mt-6">
          <div className="flex items-center gap-3 mb-4">
            <img src={deposit} alt="icon" className="h-6 w-6" />
            <h2 className="text-neutral-200 text-lg font-medium">
              Deposit history
            </h2>
          </div>
        </div>
        {withdrawHistory?.length > 0 &&
          withdrawHistory?.map((item, index) => {
            return (
              <div key={index} className="space-y-4 pb-2">
                {/* First Deposit Entry - Completed */}
                <div className="bg-[#333332] p-2 rounded-lg">
                  <div className="flex justify-between items-center mb-3 border-b py-2 border-[#666462]">
                    <button className="bg-emerald-600 hover:bg-emerald-700 transition px-4 py-1.5 rounded-md text-white text-sm">
                      Deposit
                    </button>
                    <span
                      className="text-emerald-500 text-sm"
                      style={{ textTransform: "capitalize" }}
                    >
                      {item?.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#a8a5a1]">Balance</span>
                      <span className="text-[#dd9138]">₹{item?.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#a8a5a1]">Type</span>
                      <span className="text-[#a8a5a1]">
                        {item?.payment_method}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#a8a5a1]">Time</span>
                      <span className="text-[#a8a5a1]">
                        {(item?.created_at).split("T")[0]}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#a8a5a1]">Order number</span>
                      <div className="flex items-center">
                        <span className="text-[#a8a5a1]">{item?.order_id}</span>
                        <button
                          onClick={() =>
                            handleCopyOrderNumber("RC20250216131819825449900")
                          }
                          className="ml-2 text-neutral-400 hover:text-neutral-300"
                        >
                          <FaCopy />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        <div className="px-2 mt-6">
          <button className="w-full mb-4 bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-[#8f5206] transition py-2 rounded-full font-medium">
            All history
          </button>
        </div>

        {/* Popup for Copy Success (Moved outside conditional rendering) */}
        {showPopup.visible && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-black bg-opacity-80 text-white p-4 rounded-lg shadow-lg flex flex-col items-center w-32 h-32">
              <svg
                className="w-20 h-20 text-white mb-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="4"
                  d="M10 24l10 10L38 14"
                ></path>
              </svg>
              <span className="text-sm font-sans text-center">
                Copy successful
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Deposit;
