import CommanHeader from '../../components/CommanHeader';

const AttendanceBonusCombined = () => {
  // Table data with headers and rows
  const headers = ["Continuous attendance", "Accumulated amount", "Attendance bonus"];
  const rows = [
    { day: 1, accumulatedAmount: "₹300.00", attendanceBonus: "₹10.00" },
    { day: 2, accumulatedAmount: "₹1,000.00", attendanceBonus: "₹30.00" },
    { day: 3, accumulatedAmount: "₹3,000.00", attendanceBonus: "₹130.00" },
    { day: 4, accumulatedAmount: "₹8,000.00", attendanceBonus: "₹300.00" },
    { day: 5, accumulatedAmount: "₹20,000.00", attendanceBonus: "₹650.00" },
    { day: 6, accumulatedAmount: "₹80,000.00", attendanceBonus: "₹3,150.00" },
    { day: 7, accumulatedAmount: "₹200,000.00", attendanceBonus: "₹7,500.00" }
  ];

  // Rules data
  const rules = [
    "The higher the number of consecutive login days, the more rewards you get, up to 7 consecutive days",
    "During the activity, please check once a day",
    "Players with no deposit history cannot claim the bonus",
    "Deposit requirements must be met from day one",
    "The platform reserves the right to final interpretation of this activity",
    "When you encounter problems, please contact customer service"
  ];

  return (
    <div className="bg-[#242424] min-h-screen w-full flex flex-col items-center p-4 font-serif">
        <CommanHeader title='Game Rules'/>
      <div className="w-full max-w-md mx-auto mt-10">
        
        {/* Attendance Bonus Table Container */}
        <div className="bg-gray-800 rounded-lg overflow-hidden w-full mb-8">
          <table className="w-full border-collapse table-fixed">
            {/* Table headers */}
            <thead className="bg-[#3a3947] text-center border-b border-black">
              <tr>
                {headers.map((header, index) => (
                  <th 
                    key={index} 
                    className="py-3 px-2 text-sm sm:text-sm font-medium text-white"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            
            {/* Table body */}
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr 
                  key={rowIndex} 
                  className={rowIndex % 2 === 0 ? "bg-[#333332]" : "bg-[#282730]"}
                >
                  <td className="py-3 px-2 text-center text-[#a8a5a1] text-[14px] sm:text-sm font-sans">{row.day}</td>
                  <td className="py-3 px-2 text-center text-[#a8a5a1] text-[14px] sm:text-sm">
                    <span className="font-sans">₹{row.accumulatedAmount.replace('₹', '')}</span>
                  </td>
                  <td className="py-3 px-2 text-center text-[#a8a5a1] text-[14px] sm:text-sm">
                    <span className="font-sans">₹{row.attendanceBonus.replace('₹', '')}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Rules Section - Separated */}
        <div className="bg-gray-800 rounded-lg overflow-hidden w-full">
          {/* Rules Header */}
          {/* <div className="bg-[#3a3947] text-white py-3 px-4 text-center border-b border-black">
            <h2 className="text-lg font-medium">Rules</h2>
          </div> */}
          
          {/* Rules list */}
          <div className="bg-[#333332]">
                        <div
              className="bg-[#3a3947] text-white py-4 px-4 text-center relative mb-2"
              style={{
                borderRadius: "0px 0px 50% 50% / 8px 8px 10px 10px",
                width: "240px",
                margin: "auto",
                height: "30px",
              }}
            >
              <h2
                className="text-lg font-medium"
                style={{ marginTop: "-13px" }}
              >
                Rules
              </h2>
            </div>
            <ul className="space-y-3">
              {rules.map((rule, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-amber-500 mr-2 flex-shrink-0 mt-1">◆</span>
                  <span className="text-sm sm:text-sm text-[#a8a5a1]">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceBonusCombined;