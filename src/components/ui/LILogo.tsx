const LILogo = ({ className = "w-8 h-8" }: { className?: string }) => {
  return (
    <div className={`${className} bg-white rounded-lg flex flex-col items-center justify-center relative overflow-hidden border border-gray-200 p-1`}>
      {/* Red rectangle on top */}
      <div className="w-4 h-3 bg-red-600 mb-1"></div>
      
      {/* Black L shape below */}
      <div className="relative">
        <div className="w-1 h-4 bg-black"></div>
        <div className="w-4 h-1 bg-black absolute bottom-0 left-0"></div>
      </div>
    </div>
  );
};

export default LILogo;