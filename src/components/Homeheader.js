import React, { useState, useEffect } from "react";
import download from "../Assets/download.png";
import IconWallet from "../Assets/homewallet.png";
import flagIcon from "../Assets/usFlag.png";
import headerLogo from "../Assets/newLogo/newLogo.png";
import { startLoading, stopLoading } from "../redux/Slice/Loader";
import apiServices from "../api/apiServices";
import { useDispatch } from "react-redux";
const Homeheader = () => {
  const [walletBalance, setWalletBalance] = useState("0.00");
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const dispatch = useDispatch();
  const [pwaStatus, setPwaStatus] = useState({
    canInstall: false,
    isInstalled: false,
    errors: [],
  });

  // Debug PWA installation readiness
  const checkPWAReadiness = () => {
    const errors = [];

    // Check if app is already installed
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true
    ) {
      setPwaStatus((prev) => ({ ...prev, isInstalled: true }));
      return;
    }

    // Check HTTPS
    if (
      window.location.protocol !== "https:" &&
      window.location.hostname !== "localhost"
    ) {
      errors.push("App must be served over HTTPS");
    }

    // Check for service worker
    if (!("serviceWorker" in navigator)) {
      errors.push("Service Worker not supported");
    } else {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        if (registrations.length === 0) {
          errors.push("No Service Worker registered");
        }
      });
    }

    // Check for web app manifest
    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (!manifestLink) {
      errors.push("Web App Manifest not found");
    } else {
      // Validate manifest content
      fetch(manifestLink.href)
        .then((response) => response.json())
        .then((manifest) => {
          const requiredFields = [
            "name",
            "short_name",
            "start_url",
            "display",
            "icons",
          ];
          const missingFields = requiredFields.filter(
            (field) => !manifest[field]
          );

          if (missingFields.length > 0) {
            errors.push(`Manifest missing: ${missingFields.join(", ")}`);
          }

          if (!manifest.icons || manifest.icons.length === 0) {
            errors.push("Manifest needs at least one icon");
          } else {
            const hasRequiredIcon = manifest.icons.some(
              (icon) =>
                icon.sizes &&
                (icon.sizes.includes("192x192") ||
                  icon.sizes.includes("512x512"))
            );
            if (!hasRequiredIcon) {
              errors.push("Manifest needs icons with sizes 192x192 or 512x512");
            }
          }
        })
        .catch(() => {
          errors.push("Manifest file could not be loaded");
        });
    }

    setPwaStatus((prev) => ({ ...prev, errors }));
  };

  // Fetch wallet balance
  useEffect(() => {
    const fetchWalletBalance = async () => {
      dispatch(startLoading());
      try {
        const data = await apiServices.getWalletBalanceForWithDraw();
        setWalletBalance(data?.wallet?.balance);
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(stopLoading());
      }
    };
    fetchWalletBalance();
  }, []);

  // Check PWA readiness on component mount
  useEffect(() => {
    checkPWAReadiness();
  }, []);

  // Handle beforeinstallprompt event for PWA installation
  useEffect(() => {
    const handler = (e) => {
      console.log("beforeinstallprompt event fired");
      e.preventDefault();
      setDeferredPrompt(e);
      setPwaStatus((prev) => ({ ...prev, canInstall: true }));
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Also listen for app installed event
    window.addEventListener("appinstalled", () => {
      console.log("PWA was installed");
      setPwaStatus((prev) => ({ ...prev, isInstalled: true }));
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", () => {});
    };
  }, []);

  // Enhanced install handler with better debugging
  const handleInstallClick = async () => {
    if (pwaStatus.isInstalled) {
      alert("App is already installed!");
      return;
    }

    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to install prompt: ${outcome}`);

        if (outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }

        setDeferredPrompt(null);
      } catch (error) {
        console.error("Error during installation:", error);
      }
    } else {
      // Show debug info
      const debugInfo = [
        `PWA Install Status:`,
        `- Can Install: ${pwaStatus.canInstall}`,
        `- Is Installed: ${pwaStatus.isInstalled}`,
        `- Protocol: ${window.location.protocol}`,
        `- Host: ${window.location.hostname}`,
        `- Errors: ${pwaStatus.errors.length ? pwaStatus.errors.join(", ") : "None"}`,
      ].join("\n");

      console.log(debugInfo);
      alert(`Installation not available.\n\n${debugInfo}`);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full flex justify-center z-50">
      <header
        className="bg-[#3f3f3f] flex items-center w-full justify-between px-4 shadow-md"
        style={{
          height: "100px",
          maxWidth: "400px",
          width: "100%",
          position:'relative'
        }}
      >
        <div className="flex flex-col items-center justify-center">
          {/* Logo */}
          <img
            src={headerLogo}
            alt="Logo"
            className="w-24 h-15 mb-2 sm: md:object-contain"
          />

          {/* Flag + Welcome text */}
          <div
            className="flex items-center space-x-2"
            style={{
              position: "absolute",
              top: "4.5rem",
              left: "1rem",
            }}
          >
            <img
              src={flagIcon}
              alt="US Flag"
              className="w-4 h-4 sm:w-5 sm:h-5"
            />
            <span className="text-[#d9ac4f] text-xs sm:text-sm md:text-base font-medium">
              Welcome to Strike Game
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center px-2 py-2 bg-gradient-to-b from-[#F6E3A3] to-[#D2A753] rounded-lg shadow-md w-28 sm:w-32 md:w-28 lg:w-32">
            <img
              src={IconWallet}
              alt="Wallet Icon"
              className="w-6 h-6 sm:w-8 sm:h-8 ml-2"
            />
            <div className="flex flex-col items-center leading-tight w-full">
              <span className="text-[#292d2e] font-semibold text-[10px] sm:text-xs">
                Balance
              </span>
              <span className="text-[#292d2e] font-semibold text-[10px] sm:text-xs">
                {walletBalance}
              </span>
            </div>
          </div>

          <div
            className="flex items-center px-2 py-2 bg-gradient-to-b from-[#F6E3A3] to-[#D2A753] rounded-lg shadow-md cursor-pointer w-28 sm:w-32 md:w-28 lg:w-32"
            onClick={handleInstallClick}
            style={{
              opacity: pwaStatus.isInstalled ? 0.6 : 1, // Only fade if already installed
            }}
            title={
              pwaStatus.isInstalled ? "App already installed" : "Install app"
            }
          >
            <img
              src={download}
              alt="Download Icon"
              className="w-5 h-5 sm:w-6 sm:h-6 ml-2"
            />
            <div className="flex flex-col items-center leading-tight w-full">
              <span className="text-[#292d2e] font-semibold text-[10px] sm:text-xs">
                {pwaStatus.isInstalled ? "Installed" : "Download"}
              </span>
              <span className="text-[#292d2e] font-semibold text-[10px] sm:text-xs text-center">
                App
              </span>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Homeheader;
