import { useEffect, useState } from 'react';
import { HelpCircle } from 'lucide-react';
import awardbg from '../../Assets/awardbg.png';
import HeaderAward from '../../components/HeaderAward';
import succeed from '../../Assets/succeed.png';
import lottery from '../../Assets/lottery1.png';

import wallet from '../../Assets/vip/wallets.png';
import apiServices from '../../api/apiServices';

// const missions = [
//   {
//     type: 'Daily mission',
//     status: 'Unfinished',
//     icon: lottery,
//     title: 'Daily betting bonus',
//     progress: '0/500',
//     award: '₹10',
//   },
//   {
//     type: 'Daily mission',
//     status: 'Unfinished',
//     icon: lottery,
//     title: 'Lottery betting bonus',
//     progress: '0/100000',
//     description: 'Lottery betting bonus',
//     award: '₹500.00',
//   },
//   // {
//   //   type: 'Weekly mission',
//   //   status: 'Unfinished',
//   //   icon: lottery,
//   //   title: 'Casino gaming bonus',
//   //   progress: '0/500000',
//   //   description: 'Play casino games and win',
//   //   award: '₹2,000.00',
//   // },
//   // {
//   //   type: 'Weekly mission',
//   //   status: 'Unfinished',
//   //   icon: lottery,
//   //   title: 'Sports betting bonus',
//   //   progress: '0/300000',
//   //   description: 'Bet on sports and win',
//   //   award: '₹1,500.00',
//   // },
//   // {
//   //   type: 'Monthly mission',
//   //   status: 'Unfinished',
//   //   icon: lottery,
//   //   title: 'VIP exclusive bonus',
//   //   progress: '0/1000000',
//   //   description: 'Exclusive rewards for VIPs',
//   //   award: '₹5,000.00',
//   // },
// ];

const Rebate = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [completedMission, setCompletedMission] = useState(null);
  const [missions, setMissions] = useState([]);

  const fetchActivity = async () => {
    try {
      const data = await apiServices.getActivityStatus();
      const allGamesMax = 500;
      const lotteryMax = 100000;

      const allGamesProgress = Math.min(data?.allGames?.betAmount ?? 0, allGamesMax);
      const lotteryProgress = Math.min(data?.lottery?.betAmount ?? 0, lotteryMax);

      const newMissions = [];

      if (data?.allGames) {
        newMissions.push({
          type: 'Daily mission',
          status: 'Incomplete',
          icon: lottery,
          title: 'Daily betting bonus',
          progress: `${allGamesProgress}/${allGamesMax}`,
          award: '₹10',
          disable: data?.allGames?.milestones["500"]?.achieved,
          isClaimed: data?.allGames?.milestones["500"]?.claimed,
          milestoneType: "all_games",
          milestoneKey: "500"
        });
      }

      if (data?.lottery) {
        newMissions.push({
          type: 'Daily mission',
          status: 'Incomplete',
          icon: lottery,
          title: 'Lottery betting bonus',
          progress: `${lotteryProgress}/${lotteryMax}`,
          description: 'Lottery betting bonus',
          award: '₹500.00',
          disable: data?.lottery?.milestones["100K"]?.achieved,
          isClaimed: data?.lottery?.milestones["100K"]?.claimed,
          milestoneType: "lottery",
          milestoneKey: "100K"
        });
      }
      if (data?.allGames) {
        newMissions.push({
          type: 'Daily mission',
          status: 'Incomplete',
          icon: lottery,
          title: 'Daily betting bonus',
          progress: `${allGamesProgress}/${allGamesMax}`,
          award: '₹10',
          disable: data?.allGames?.milestones["500"]?.achieved,
          isClaimed: data?.allGames?.milestones["500"]?.claimed,
          milestoneType: "all_games",
          milestoneKey: "500"
        });
      }
      setMissions(newMissions);
    } catch (err) {
      console.error("Failed to fetch activity", err);
    }
  };


  useEffect(() => {
    fetchActivity()
  }, [])

  const handleComplete = (mission) => {
    setCompletedMission(mission);
    setShowPopup(true);
  };

  const closePopup = async () => {
    console.log(completedMission)
    let payload = {
      milestoneKey: completedMission?.milestoneKey,
      milestoneType: completedMission?.milestoneType
    }
    const data = await apiServices.claimActivity(payload)
    if (data?.success == true) {
      fetchActivity()
    }
    setShowPopup(false);
  };

  return (
    <div className="w-full bg-[#242424] overflow-hidden shadow-md">
      <HeaderAward />
      {/* Header */}
      <div
        className="p-6 text-white relative bg-cover bg-center flex flex-col justify-center"
        style={{
          backgroundImage: `url(${awardbg})`,
          height: '150px'
        }}
      >
        <div className="absolute right-4 top-4">
          <HelpCircle className="w-10 h-10 text-white opacity-30" />
        </div>
        <h2 className="text-2xl font-bold leading-tight">Activity Award</h2>
        <p className="text-sm leading-snug">
          Complete weekly/daily tasks to receive <br />
          rich rewards <br />
          Weekly rewards cannot be accumulated <br />
          to the next week, and daily rewards <br />
          cannot be accumulated to the next day.
        </p>
      </div>


      <div className="p-4" style={{minHeight: '75vh'}}>
        {missions.map((mission, index) => (
          <div
            key={index}
            className="p-4 bg-[#333332] rounded-lg shadow-md border border-gray-700 mt-4 relative"
          >
            {/* <div className="flex justify-between items-center mb-2">
              <div className="text-white py-1 px-3 rounded-full text-sm font-semibold flex items-center bg-[#17b15e] text-white px-6 py-2 rounded-br-3xl h-12">
                {mission.type}
              </div>
              <div className="text-gray-400 text-sm">{mission.status}</div>
            </div> */}
            <div className="flex justify-between items-center pb-2 mt-6">
              <div className="absolute top-[-2px] left-0 flex items-center justify-between h-[40px]" style={{width:'100%'}}>
                <div className="flex items-center bg-[#17b15e] text-white px-6 py-2 rounded-br-3xl h-[40px]" style={{borderStartStartRadius: '7px'}}>
                  <span className="font-medium font-semibold text-[16px]" >{mission?.type}</span>
                </div>
                <span className='text-gray-400 text-sm mr-1 pr-[12px]'>  {mission.status}</span>
              </div>
              <div className='border-b border-gray-700 w-full'></div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-md p-2 flex items-center justify-center w-10 h-10">
                <img
                  src={mission.icon}
                  alt={mission.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <span className="text-gray-300">{mission.title}</span>
              <span className="ml-auto text-orange-500 font-medium">{mission.progress}</span>
            </div>

            {/* <div className="text-gray-400 text-sm ml-9 mb-3">{mission.description}</div> */}

            <div className="flex justify-between items-center mb-3 pb-2" style={{borderBottom:'1px solid gray'}}>
              <div className="text-gray-300 pl-1">Award amount</div>
              <div className="flex items-center">
                <div className="mr-1">
                  <img src={wallet} alt="Wallet" className="w-4 h-4" />
                </div>
                <div className="text-orange-400 font-bold">{mission.award}</div>
              </div>
            </div>
            <button
              className="w-full py-2 border border-green-500 rounded-full text-green-500 font-medium"
              onClick={() => handleComplete(mission)}
              disabled={!(mission?.disable && !mission?.isClaimed)}
            >
              To Complete
            </button>

          </div>
        ))}
      </div>


      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-[#2A2A2A] rounded-xl w-full max-w-xs mx-4 overflow-visible shadow-lg min-h-[250px] p-4 mt-2">

            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <img
                src={succeed}
                alt="Success"
                className="w-38 h-24"
              />
            </div>


            <div className="pt-12 flex flex-col items-center">
              <h3 className="text-white text-xl font-semibold mb-2">Congratulations!</h3>
              <p className="text-gray-300 text-center mb-4">
                You have successfully completed {completedMission?.title || 'Bonus'} challenge!
              </p>
              <p className="text-yellow-400 font-bold text-lg mb-4">{completedMission?.award || '₹55.00'} Earned</p>


              <button
                onClick={closePopup}
                className="w-full bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-black py-3 rounded-full text-center text-sm font-medium"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rebate;