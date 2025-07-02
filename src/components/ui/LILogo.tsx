const LILogo = ({ className = "w-8 h-8" }: { className?: string }) => {
  return (
    <div className={`${className} bg-white rounded-lg flex items-center justify-center relative overflow-hidden border border-gray-200`}>
      <div className="relative flex items-end">
        {/* L acting as a bed/platform */}
        <span className="text-blue-600 font-bold text-xl font-fredoka transform rotate-2">L</span>
        
        {/* i sitting/resting on the L */}
        <div className="absolute -top-1 left-3 flex flex-col items-center transform -rotate-12">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mb-0.5"></div>
          <span className="text-green-500 font-bold text-lg">i</span>
        </div>
      </div>
    </div>
  );
};

export default LILogo;