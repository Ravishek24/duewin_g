import React from "react";
import BackButton from "./BackButton";


const SubordinateHeader = () => {
  return (
<header className="bg-[#414140] fixed top-0 w-full max-w-[400px] h-12 flex items-center px-2 z-10 relative">
  {/* Back Arrow on the Left */}
  <BackButton className="text-[#f5f3f0] text-xl cursor-pointer" />

  {/* Notification Title in the Center */}
  <p className="absolute left-1/2 transform -translate-x-1/2 text-[#f5f3f0] text-xl">
    Subordinate data
  </p>
</header>

  );
};

export default SubordinateHeader;
