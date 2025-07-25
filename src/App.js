import React, { Suspense, useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigationType,
} from "react-router-dom";
import { isAuthenticated } from "./api/auth";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoadingFallback from "./components/Loader/LoadingFallback";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPassword from "./pages/ForgotPassword";
import CustomerService from "./pages/CustomerService";
import ProfilePage from "./pages/ProfilePage";
import Wallet from "./pages/Wallet";
import ActivityPage from "./pages/ActivityPage";
import PromotionPage from "./pages/PromotionPage";
import Subordinate from "./pages/Promotion/Subordinate";
import Attandancebonus from "./pages/Activity/AttendanceBonus";
import GameStatistics from "./pages/Profile/GameStatisticsProfile";
import ActivityAward from "./pages/Activity/ActivityAward";
import CommissionDetailsPage from "./pages/Promotion/CommissionDetailPage";
import PromotionRule from "./pages/Promotion/PromotionRule";
import AgentCustomer from "./pages/Promotion/AgentCustomer";
import RebateRatio from "./pages/Promotion/RebateRatio";
import Rebate from "./pages/Activity/rebate";
import Jackpot from "./pages/Activity/Jackpot";
import Gift from "./pages/Activity/Gift";
import Home from "./pages/Home";
import LotteryWingo from "./pages/Lottery/LotteryWingo/LotteryWingo";
import LotteryK3 from "./pages/Lottery/LotteryK3/LotteryK3";
import Lottery5d from "./pages/Lottery/Lottery5d/Lottery5d";
import LotteryTrxWingo from "./pages/Lottery/LotteryTrx/LotteryTrxWingo";
import Deposit from "./pages/Wallet/Deposit";
import Withdraw from "./pages/Wallet/Withdraw";
import AboutusProfile from "./pages/Profile/AboutusProfile";
import ARWallet from "./pages/Profile/ARWallet";
import BeginnerGuide from "./pages/Profile/BeginnerGuide";
import CustomerServiceProfile from "./pages/Profile/CustomerServiceProfile";
import DepositHistoryProfile from "./pages/Profile/DepositHistoryProfile";
import DepositProfile from "./pages/Profile/DepositProfile";
import FeedbackProfile from "./pages/Profile/FeedbackProfile";
import GameHistoryProfile from "./pages/Profile/GameHistoryProfile";
import GiftsProfile from "./pages/Profile/GiftsProfile";
import NotificationProfile from "./pages/Profile/NotificationProfile";
import Notifications from "./pages/Profile/NotificationsService";
import SafeProfile from "./pages/Profile/SafeProfile";
import SettingsProfile from "./pages/Profile/SettingsProfile";
import TransactionProfile from "./pages/Profile/TransactionProfile";
import VIPProfile from "./pages/Profile/VIPProfile";
import WithdrawHistoryProfile from "./pages/Profile/WithdrawHistoryProfile";
import PrivacyAgreement from "./pages/PrivacyAgreement";
import DepositWingo from "./pages/Lottery/LotteryWingo/DepositWingo";
import WithdrawWingo from "./pages/Lottery/LotteryWingo/WithdrawWingo";
import DepositK3 from "./pages/Lottery/LotteryK3/DepositK3";
import WithdrawK3 from "./pages/Lottery/LotteryK3/WithdrawK3";
import Deposit5d from "./pages/Lottery/Lottery5d/Deposit5d";
import Withdraw5d from "./pages/Lottery/Lottery5d/Withdraw5d";
import DepositTrx from "./pages/Lottery/LotteryTrx/DepositTrx";
import WithdrawTrx from "./pages/Lottery/LotteryTrx/WithdrawTrx";
import NewSubordinate from "./pages/Promotion/NewSubordinate";
import InvitePage from "./pages/Promotion/InvitePage";
import DepositHistory from "./pages/Wallet/depositHistory";
import WithdrawHistory from "./pages/Wallet/withdrawHistory";
import AttendanceBonusCombined from "./pages/Profile/Gamerules";
import ActivityAwardss from "./pages/Profile/ActivityInvite";
import InviteBonusTable from "./pages/Activity/InvitationRewardRule";
import MemberInfoCard from "./pages/Activity/InvitationRecord";
import FinancialCard from "./pages/Profile/Safe";
import ActivityDetails from "./pages/Activity/ActivityDetails";
import BankAccountForm from "./pages/Wallet/BankAccountform";
import WalletForm from "./pages/Wallet/AddUSDT";
import PasswordChangeForm from "./pages/SettingsLogin";
import LoginVerificationForm from "./pages/LoginVerification";
import OrderDetailsComponent from "./pages/Lottery/LotteryWingo/LotteryGameDetailed";
import OnlineChatSupport from "./components/OnlineChatSupport";
import VIPHistory from "./pages/Profile/VIPHistory";
import RulesComponent from "./pages/Profile/LearnAboutSafe";
import BDGWin from "./pages/LandingPage";
import { Provider } from "react-redux";
import store from "./redux/store";
import UserProfile from "./pages/Settings";
import SlotGame from "./pages/SlotGame";
import OriginalGames from "./pages/OriginalGame";
import SportsGame from "./pages/SportGame";
import CasinoGames from "./pages/LiveCasino";
import CollectReward from "./pages/Activity/CollectReward";
import { Outlet } from "react-router-dom";
import { AudioProvider } from "./contexts/AudioContext";
import AttendanceHistory from "./pages/Activity/AttendanceHistory";
import SubordinateLevelPage from "./pages/Promotion/SubordinateLevelPage";
import GlobalLoader from "./components/GlobalLoader";
import AboutDetails from "./pages/Profile/AboutDetails";
import RiskDetails from "./pages/Profile/RiskDetails";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import your landing image
import landImage from "./Assets/newIcon/dice/3.png";

// Initial Loading Screen Component
const InitialLoadingScreen = () => {
  return (
    <div className="relative flex flex-col items-center bg-[#242424] min-h-screen w-full max-w-full md:max-w-[400px] mx-auto overflow-x-hidden" style={{backgroundColor:'#232323'}}>
      <img
        src={landImage}
        alt="Loading"
        className="w-full h-full object-cover"
        style={{
          width: '100vw',
          height: '100vh',
          objectFit: 'contain'
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
      </div>
    </div>
  );
};

function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  React.useEffect(() => {
    // iOS Safari specific scroll fix
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isIOS) {
      // Force scroll to top with a slight delay for iOS
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
        // Additional fix for iOS Safari
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname, navigationType]);

  return null;
}

// Enhanced Protected Route Component
const ProtectedRoute = ({ children }) => {
  const authStatus = isAuthenticated();

  if (!authStatus) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Layout component for protected routes
const ProtectedLayout = () => {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
};

function App() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
 useEffect(() => {
    // Check if the loading screen has already been shown in this session
    const hasShownLoading = sessionStorage.getItem('hasShownInitialLoading');
    
    if (hasShownLoading) {
      // If already shown in this session, skip the loading screen
      setIsInitialLoading(false);
    } else {
      // Show loading screen for 2 seconds, then mark as shown
      const timer = setTimeout(() => {
        setIsInitialLoading(false);
        // Mark that loading screen has been shown in this session
        sessionStorage.setItem('hasShownInitialLoading', 'true');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  // Show the initial loading screen
  if (isInitialLoading) {
    return <InitialLoadingScreen />;
  }

  return (
    <Provider store={store}>
      <BrowserRouter>
        <ScrollToTop />
        <GlobalLoader />
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            <Suspense fallback={<LoadingFallback />}>
              <AudioProvider>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/forgotpassword" element={<ForgotPassword />} />
                  <Route path="/privacy-policy" element={<AboutDetails />} />
                  <Route path="/agentcustomer" element={<AgentCustomer />} />
                  <Route
                    path="/customerservice"
                    element={<CustomerService />}
                  />
                  <Route
                    path="/privacyagreement"
                    element={<PrivacyAgreement />}
                  />
                  <Route path="/bdgwin" element={<BDGWin />} />

                  {/* Protected Routes */}
                  <Route element={<ProtectedLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/profilepage" element={<ProfilePage />} />
                    <Route path="/wallet" element={<Wallet />} />
                    <Route path="/activitypage" element={<ActivityPage />} />
                    <Route path="/promotionpage" element={<PromotionPage />} />
                    <Route path="/subordinate" element={<Subordinate />} />
                    <Route
                      path="/commissiondetailpage"
                      element={<CommissionDetailsPage />}
                    />
                    <Route path="/promotionrule" element={<PromotionRule />} />

                    <Route path="/rebateratio" element={<RebateRatio />} />
                    <Route
                      path="/newsubordinate"
                      element={<NewSubordinate />}
                    />
                    <Route path="/invitepage" element={<InvitePage />} />
                    <Route path="/invitebonus" element={<ActivityAward />} />
                    <Route path="/rebate" element={<Rebate />} />
                    <Route path="/jackpot" element={<Jackpot />} />
                    <Route path="/gift" element={<Gift />} />
                    <Route
                      path="/attendancebonus"
                      element={<Attandancebonus />}
                    />
                    <Route
                      path="/game-rules"
                      element={<AttendanceBonusCombined />}
                    />
                    <Route
                      path="/activityawards"
                      element={<ActivityAwardss />}
                    />
                    <Route
                      path="/invitationrule"
                      element={<InviteBonusTable />}
                    />
                    <Route
                      path="/invitaionrecord"
                      element={<MemberInfoCard />}
                    />
                    <Route
                      path="/activitygamesrules/:pageName"
                      element={<ActivityDetails />}
                    />
                    <Route
                      path="/chat-support"
                      element={<OnlineChatSupport />}
                    />
                    <Route path="/lotterywingo" element={<LotteryWingo />} />
                    <Route path="/depositwingo" element={<DepositWingo />} />
                    <Route path="/withdrawwingo" element={<WithdrawWingo />} />
                    <Route path="/lotteryk3" element={<LotteryK3 />} />
                    <Route path="/depositk3" element={<DepositK3 />} />
                    <Route path="/withdrawk3" element={<WithdrawK3 />} />
                    <Route path="/lottery5d" element={<Lottery5d />} />
                    <Route
                      path="/lotterytrxwing"
                      element={<LotteryTrxWingo />}
                    />
                    <Route path="/deposit5d" element={<Deposit5d />} />
                    <Route path="/withdraw5d" element={<Withdraw5d />} />

                    <Route path="/deposittrx" element={<DepositTrx />} />
                    <Route path="/withdrawtrx" element={<WithdrawTrx />} />
                    <Route
                      path="/orderdetail"
                      element={<OrderDetailsComponent />}
                    />
                    <Route path="/deposit" element={<Deposit />} />
                    <Route path="/withdraw" element={<Withdraw />} />
                    <Route
                      path="/deposit-history"
                      element={<DepositHistory />}
                    />
                    <Route
                      path="/withdraw-history"
                      element={<WithdrawHistory />}
                    />
                    <Route
                      path="/bankaccountform"
                      element={<BankAccountForm />}
                    />
                    <Route path="/addusdt" element={<WalletForm />} />
                    <Route
                      path="/passwordchangeform"
                      element={<PasswordChangeForm />}
                    />
                    <Route
                      path="/resetemail"
                      element={<LoginVerificationForm />}
                    />
                    <Route
                      path="/aboutusprofile"
                      element={<AboutusProfile />}
                    />
                    <Route path="/aboutDetail" element={<AboutDetails />} />
                    <Route path="/riskDetails" element={<RiskDetails />} />
                    <Route path="/arwallet" element={<ARWallet />} />
                    <Route path="/beginnerguide" element={<BeginnerGuide />} />
                    <Route
                      path="/customerserviceprofile"
                      element={<CustomerServiceProfile />}
                    />
                    <Route
                      path="/deposithistoryprofile"
                      element={<DepositHistoryProfile />}
                    />
                    <Route
                      path="/depositprofile"
                      element={<DepositProfile />}
                    />
                    <Route
                      path="/feedbackprofile"
                      element={<FeedbackProfile />}
                    />
                    <Route
                      path="/gamehistoryprofile"
                      element={<GameHistoryProfile />}
                    />
                    <Route
                      path="/gamestatistics"
                      element={<GameStatistics />}
                    />
                    <Route path="/giftsprofile" element={<GiftsProfile />} />
                    <Route
                      path="/notificationprofile"
                      element={<NotificationProfile />}
                    />
                    <Route
                      path="/notificationsservice"
                      element={<Notifications />}
                    />
                    <Route path="/safeprofile" element={<SafeProfile />} />
                    <Route path="/settingsprofile" element={<UserProfile />} />
                    <Route
                      path="/transactionprofile"
                      element={<TransactionProfile />}
                    />
                    <Route path="/vipprofile" element={<VIPProfile />} />
                    <Route
                      path="/withdrawhistoryprofile"
                      element={<WithdrawHistoryProfile />}
                    />
                    <Route path="/safe" element={<FinancialCard />} />
                    <Route path="/about-safe" element={<RulesComponent />} />
                    <Route path="/viphistory" element={<VIPHistory />} />
                    <Route path="/SlotGame" element={<SlotGame />} />
                    <Route path="/original-games" element={<OriginalGames />} />
                    <Route path="/SportsGame" element={<SportsGame />} />
                    <Route path="/casino-games" element={<CasinoGames />} />
                    <Route path="/collect-reward" element={<CollectReward />} />
                    <Route
                      path="/attendance-history"
                      element={<AttendanceHistory />}
                    />
                    <Route
                      path="/subordinate/level/:id"
                      element={<SubordinateLevelPage />}
                    />
                  </Route>

                  {/* Default Redirect */}
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
              </AudioProvider>
            </Suspense>
          </main>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </BrowserRouter>
    </Provider>
  );
}

export default App;