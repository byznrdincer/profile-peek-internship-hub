const LILogo = ({ className = "w-8 h-8" }: { className?: string }) => {
  return (
    <div className={`${className} bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center relative overflow-hidden`}>
      <div className="relative text-white font-bold text-lg leading-none">
        <span className="absolute -left-1 font-fredoka">L</span>
        <span className="absolute left-2 font-light">I</span>
      </div>
    </div>
  );
};

export default LILogo;