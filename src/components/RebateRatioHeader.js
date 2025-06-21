import React from "react";
import BackButton from "./BackButton";


const RebateRatioHeader = () => {
  return (
    <header className="bg-[#414140] fixed top-0 w-full max-w-[400px] h-12 flex items-center px-2" style={{zIndex:199}}>
      {/* Back Arrow on the Left */}
      <BackButton className="text-[#f5f3f0] text-xl cursor-pointer ml-2" />

      {/* Notification Title in the Center */}
      <p className="text-[#f5f3f0] text-xl mx-auto">Rebate ratio</p>
    </header>
  );
};

export default RebateRatioHeader;
