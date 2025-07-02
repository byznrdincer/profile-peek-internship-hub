const LILogo = ({ className = "w-8 h-8" }: { className?: string }) => {
  return (
    <div className={`${className} bg-white rounded-lg flex items-center justify-center relative overflow-hidden border border-gray-200`}>
      <div className="flex items-end leading-none">
        <span className="text-black font-bold text-lg font-fredoka">L</span>
        <div className="flex flex-col items-center ml-0.5">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mb-0.5"></div>
          <span className="text-red-500 font-bold text-lg">i</span>
        </div>
      </div>
    </div>
  );
};

export default LILogo;