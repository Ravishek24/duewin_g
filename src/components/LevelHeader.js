import { ArrowLeft } from 'lucide-react';

const LevelHeader = () => {
  return (
    <div className="bg-[#333332] text-white p-4 flex items-center justify-center relative w-full" style={{ maxWidth: "450px" }}>
      <button onClick={() => window.history.back()} className="absolute left-2">
        <ArrowLeft size={24} />
      </button>
      <h2 className="text-lg font-semibold">Subordinate Level List</h2>
    </div>
  );
};

export default LevelHeader;