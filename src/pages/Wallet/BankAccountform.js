import React, { useEffect, useState } from "react";
import bankicon from "../../Assets/Bankicons/bankicon.png";
import nameicon from "../../Assets/Bankicons/nameicon.png";
import bankcardicon from "../../Assets/Bankicons/bankcardicon.png";
import phoneicon from "../../Assets/Bankicons/phoneicon.png";
import mailicon from "../../Assets/Bankicons/mailicon.png";
import hint from "../../Assets/loader/hint.png";
import ifsc from "../../Assets/Bankicons/ifsccodeicon.png";
import BankAccountHeader from "../../components/BankAccountHeader";
import apiServices, { getUserProfile } from "../../api/apiServices";
import { useNavigate } from "react-router-dom";

const BankAccountForm = () => {
  const [bankName, setBankName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [isPrimaryAccount, setIsPrimaryAccount] = useState(false);
  const [error, setError] = useState("");
  const [sessionId, setSessionId] = useState("");
  
  // Bank search states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // OTP related states
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSending, setIsOtpSending] = useState(false);
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);
  const [phone, setPhone] = useState(null);
  const [otpError, setOtpError] = useState("");
  const [formData, setFormData] = useState(null);

  const fetchProfile = async () => {
    let storedPhone = await getUserProfile();
    if (storedPhone) {
      setPhone(storedPhone?.user?.phone_no);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const banks = [
    "Axis Bank Ltd.",
    "Bandhan Bank Ltd.",
    "CSB Bank Limited",
    "City Union Bank Ltd.",
    "DCB Bank Ltd.",
    "Dhanlaxmi Bank Ltd.",
    "Federal Bank Ltd.",
    "HDFC Bank Ltd",
    "ICICI Bank Ltd.",
    "IndusInd Bank Ltd",
    "IDFC FIRST Bank Limited",
    "Jammu & Kashmir Bank Ltd.",
    "Karnataka Bank Ltd.",
    "Karur Vysya Bank Ltd.",
    "Kotak Mahindra Bank Ltd",
    "Nainital bank Ltd.",
    "RBL Bank Ltd.",
    "South Indian Bank Ltd.",
    "Tamilnad Mercantile Bank Ltd.",
    "YES Bank Ltd.",
    "IDBI Bank Limited",
    "Coastal Local Area Bank Ltd",
    "Krishna Bhima Samruddhi LAB Ltd",
    "Au Small Finance Bank Ltd.",
    "Capital Small Finance Bank Ltd",
    "Equitas Small Finance Bank Ltd",
    "ESAF Small Finance Bank Ltd.",
    "Suryoday Small Finance Bank Ltd.",
    "Ujjivan Small Finance Bank Ltd.",
    "Utkarsh Small Finance Bank Ltd.",
    "slice Small Finance Bank Ltd.",
    "Jana Small Finance Bank Ltd",
    "Shivalik Small Finance Bank Ltd",
    "Unity Small Finance Bank Ltd",
    "Airtel Payments Bank Ltd",
    "India Post Payments Bank Ltd",
    "FINO Payments Bank Ltd",
    "Paytm Payments Bank Ltd",
    "Jio Payments Bank Ltd",
    "NSDL Payments Bank Limited",
    "Bank of Baroda",
    "Bank of India",
    "Bank of Maharashtra",
    "Canara Bank",
    "Central Bank of India",
    "Indian Bank",
    "Indian Overseas Bank",
    "Punjab & Sind Bank",
    "Punjab National Bank",
    "State Bank of India",
    "UCO Bank",
    "Union Bank of India",
    "Export-Import Bank of India",
    "National Housing Bank",
    "Small Industries Development Bank of India",
    "Assam Gramin Vikash Bank",
    "Andhra Pradesh Grameena Vikas Bank",
    "Andhra Pragathi Grameena Bank",
    "Arunachal Pradesh Rural Bank",
    "Aryavart Bank",
    "Bangiya Gramin Vikash Bank",
    "Baroda Gujarat Gramin Bank",
    "Baroda Rajasthan Kshetriya Gramin Bank",
    "Baroda UP Bank",
    "Chaitanya Godavari GB",
    "Chhattisgarh Rajya Gramin Bank",
    "Dakshin Bihar Gramin Bank",
    "Ellaquai Dehati Bank",
    "Himachal Pradesh Gramin Bank",
    "J&K Grameen Bank",
    "Jharkhand Rajya Gramin Bank",
    "Karnataka Gramin Bank",
    "Karnataka Vikas Gramin Bank",
    "Kerala Gramin Bank",
    "Madhya Pradesh Gramin Bank",
    "Madhyanchal Gramin Bank",
    "Maharashtra Gramin Bank",
    "Manipur Rural Bank",
    "Meghalaya Rural Bank",
    "Mizoram Rural Bank",
    "Nagaland Rural Bank",
    "Odisha Gramya Bank",
    "Paschim Banga Gramin Bank",
    "Prathama U.P. Gramin Bank",
    "Puduvai Bharathiar Grama Bank",
    "Punjab Gramin Bank",
    "Rajasthan Marudhara Gramin Bank",
    "Saptagiri Grameena Bank",
    "Sarva Haryana Gramin Bank",
    "Saurashtra Gramin Bank",
    "Tamil Nadu Grama Bank",
    "Telangana Grameena Bank",
    "Tripura Gramin Bank",
    "Uttar Bihar Gramin Bank",
    "Utkal Grameen Bank",
    "Uttarbanga Kshetriya Gramin Bank",
    "Vidharbha Konkan Gramin Bank",
    "Uttarakhand Gramin Bank",
  ];

  const navigate = useNavigate();

  // Filter banks based on search term
  const filteredBanks = banks.filter(bank =>
    bank.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBankSelect = (bank) => {
    setBankName(bank);
    setSearchTerm("");
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      bank_name: String(bankName),
      account_holder_name: String(recipientName),
      account_number: String(accountNumber),
      ifsc_code: String(ifscCode),
      is_primary: isPrimaryAccount,
    };

    setFormData(payload);

    try {
      setIsOtpSending(true);
      setError("");

      const otpResponse = await apiServices.sendOtp(phone, "bank_account");

      if (otpResponse?.success) {
        setShowOtpPopup(true);
        setSessionId(otpResponse?.otpSessionId);
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.log(err);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsOtpSending(false);
    }
  };

  const handleOtpVerification = async () => {
    if (!otp || otp.length !== 4) {
      setOtpError("Please enter a valid 4-digit OTP");
      return;
    }

    try {
      setIsOtpVerifying(true);
      setOtpError("");

      const verifyPayload = {
        phone: phone,
        code: otp,
        otp_session_id: sessionId,
      };

      const verifyResponse = await apiServices.verifyOtp(verifyPayload);

      if (verifyResponse?.success) {
        const data = await apiServices.addBankAccount(formData);

        if (data?.success === true) {
          setBankName("");
          setRecipientName("");
          setAccountNumber("");
          setIfscCode("");
          setIsPrimaryAccount(false);
          setError("");
          setShowOtpPopup(false);
          setOtp("");
          navigate(-1);
          setSessionId("");
        } else {
          setOtpError("Failed to add bank account. Please try again.");
        }
      } else {
        setOtpError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.log(err);
      setOtpError("Failed to verify OTP. Please try again.");
    } finally {
      setIsOtpVerifying(false);
    }
  };

  const closeOtpPopup = () => {
    setShowOtpPopup(false);
    setOtp("");
    setOtpError("");
  };

  const resendOtp = async () => {
    try {
      setIsOtpSending(true);
      setOtpError("");

      const otpResponse = await apiServices.sendOtp(phone, "bank_account");

      if (otpResponse?.success) {
        setOtpError("");
      } else {
        setOtpError("Failed to resend OTP. Please try again.");
      }
    } catch (err) {
      console.log(err);
      setOtpError("Failed to resend OTP. Please try again.");
    } finally {
      setIsOtpSending(false);
    }
  };

  return (
    <>
      <BankAccountHeader />
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <div className="min-h-screen flex flex-col bg-[#333332] pb-8">
          <div className="mt-16 mx-auto max-w-md w-full bg-[#242424] text-white p-6 rounded-lg overflow-y-auto">
            {/* Warning Banner */}
            <div className="flex items-center gap-3 p-2 mb-8 bg-[#333332] rounded-lg">
              <img src={hint} alt="hint" className="w-7 h-7" />
              <p className="text-xs text-red-500">
                To ensure the safety of your funds, please bind your bank account
              </p>
            </div>

            {/* Phone Number Field */}
            {phone && (
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <img src={phoneicon} alt="Phone Icon" className="w-5 h-5" />
                  <label className="text-sm font-medium">Phone Number</label>
                </div>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  className="w-full p-4 bg-[#333332] rounded-lg text-gray-300"
                  value={phone}
                  disabled={true}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            )}

            {/* Bank Selection with Search */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <img src={bankicon} alt="Bank Icon" className="w-5 h-5" />
                <label className="text-sm font-medium">Choose a bank</label>
              </div>
              
              <div className="relative">
                {/* Display Selected Bank or Search Input */}
                <div
                  className="w-full p-4 rounded-lg cursor-pointer flex items-center justify-between"
                  style={{
                    background: "linear-gradient(90deg, #FAE59F 0%, #C4933F 100%)",
                  }}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className="text-[#8f5206] font-medium truncate">
                    {bankName || "Please select a bank"}
                  </span>
                  <svg
                    className={`w-4 h-4 text-[#8f5206] transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                {/* Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 bg-[#333332] border border-gray-600 rounded-lg mt-1 shadow-lg z-50 max-h-60 overflow-hidden">
                    {/* Search Input */}
                    <div className="p-3 border-b border-gray-600">
                      <input
                        type="text"
                        placeholder="Search banks..."
                        className="w-full p-2 bg-[#242424] text-white rounded border border-gray-500 focus:border-yellow-500 focus:outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                      />
                    </div>
                    
                    {/* Bank List */}
                    <div className="max-h-48 overflow-y-auto">
                      {filteredBanks.length > 0 ? (
                        filteredBanks.map((bank, idx) => (
                          <div
                            key={idx}
                            className="p-3 hover:bg-[#242424] cursor-pointer text-white border-b border-gray-700 last:border-b-0"
                            onClick={() => handleBankSelect(bank)}
                          >
                            {bank}
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-gray-400 text-center">
                          No banks found
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Clear Selection */}
                {bankName && (
                  <button
                    type="button"
                    className="absolute right-8 top-1/2 transform -translate-y-1/2 text-[#8f5206] hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      setBankName("");
                      setIsDropdownOpen(false);
                    }}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Recipient Name */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <img src={nameicon} alt="Name Icon" className="w-5 h-5" />
                <label className="text-sm font-medium">Full recipient's name</label>
              </div>
              <input
                type="text"
                placeholder="Please enter the recipient's name"
                className="w-full p-4 bg-[#333332] rounded-lg text-gray-300"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
              />
            </div>

            {/* Bank Account Number */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <img src={bankcardicon} alt="Bank Card Icon" className="w-5 h-5" />
                <label className="text-sm font-medium">Bank account number</label>
              </div>
              <input
                type="text"
                placeholder="Please enter your bank account number"
                className="w-full p-4 bg-[#333332] rounded-lg text-gray-300"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>

            {/* IFSC Code */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <img src={ifsc} alt="IFSC Code Icon" className="w-5 h-5" />
                <label className="text-sm font-medium">IFSC code</label>
              </div>
              <input
                type="text"
                placeholder="Please enter IFSC code"
                className="w-full p-4 bg-[#333332] rounded-lg text-gray-300"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value)}
              />
            </div>

            {/* Save Button */}
            <button
              className="w-full p-2 text-xl bg-[#6f7381] text-white font-bold rounded-full mt-8 transition-colors disabled:opacity-50"
              type="submit"
              disabled={
                !ifscCode ||
                !recipientName ||
                !bankName ||
                !accountNumber ||
                isOtpSending
              }
            >
              {isOtpSending ? "Sending OTP..." : "S a v e"}
            </button>
            <p className="text-red-500 mt-2">{error}</p>
          </div>
        </div>
      </form>

      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}

      {/* OTP Verification Popup */}
      {showOtpPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#242424] p-6 rounded-lg max-w-sm w-full mx-4">
            <h3 className="text-white text-lg font-medium mb-4">Verify OTP</h3>
            <p className="text-gray-300 text-sm mb-4">
              Please enter the 4-digit OTP sent to {phone}
            </p>

            <input
              type="text"
              placeholder="Enter 4-digit OTP"
              className="w-full p-3 bg-[#333332] rounded-lg text-gray-300 mb-4"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))
              }
              maxLength={4}
            />

            {otpError && <p className="text-red-500 text-sm mb-4">{otpError}</p>}

            <div className="flex gap-3">
              <button
                onClick={handleOtpVerification}
                disabled={isOtpVerifying || otp.length !== 4}
                className="flex-1 p-3 bg-[#6f7381] text-white rounded-lg disabled:opacity-50"
              >
                {isOtpVerifying ? "Verifying..." : "Verify"}
              </button>

              <button
                onClick={closeOtpPopup}
                className="flex-1 p-3 bg-gray-600 text-white rounded-lg"
              >
                Cancel
              </button>
            </div>

            <button
              onClick={resendOtp}
              disabled={isOtpSending}
              className="w-full mt-3 p-2 text-sm text-yellow-500 underline disabled:opacity-50"
            >
              {isOtpSending ? "Sending..." : "Resend OTP"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BankAccountForm;