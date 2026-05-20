function RobotProgress({ steps, currentStep, onStepClick }) {
  // Calculate progress percentage to move the mechanic along the track
  const progress = (currentStep / (steps.length - 1)) * 100;

  // Map the 7 wizard steps to the 5 robot frames (0 to 4)
  const getFrameIndex = (step) => {
    if (step <= 1) return 0; // Head
    if (step === 2) return 1; // Head + Body
    if (step === 3) return 2; // + Legs
    if (step === 4) return 3; // + Arms
    return 4; // Complete
  };
  const frameIndex = getFrameIndex(currentStep);

  return (
    <div className="mb-8 w-full max-w-3xl mx-auto px-4">
      {/* Inline styles for walking animation */}
      <style>{`
        @keyframes walk-front {
          0%, 100% { transform: rotate(-20deg); }
          50% { transform: rotate(20deg); }
        }
        @keyframes walk-back {
          0%, 100% { transform: rotate(20deg); }
          50% { transform: rotate(-20deg); }
        }
        .leg-front { animation: walk-front 0.8s infinite ease-in-out; transform-origin: 12px 17px; }
        .leg-back { animation: walk-back 0.8s infinite ease-in-out; transform-origin: 12px 17px; }
      `}</style>

      {/* Track Container (Added padding top to make room for Warehouse) */}
      <div className="relative pt-20 pb-6 mx-8">
        
        {/* WAREHOUSE (Placed above step 0) */}
        <div className="absolute top-2 left-0 -ml-[18px] z-20 flex flex-col items-center">
          {/* Simple Warehouse SVG/CSS */}
          <div className="w-10 h-10 bg-slate-200 rounded-sm border-b-2 border-slate-300 flex items-end justify-center relative shadow-sm">
            {/* Roof */}
            <div className="absolute -top-3 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[12px] border-b-slate-400"></div>
            {/* Door */}
            <div className="w-4 h-6 bg-slate-800 rounded-t-sm"></div>
            {/* Windows */}
            <div className="absolute top-1.5 left-1 w-1.5 h-1.5 bg-blue-200"></div>
            <div className="absolute top-1.5 right-1 w-1.5 h-1.5 bg-blue-200"></div>
          </div>
          <span className="text-[8px] font-bold text-slate-500 mt-0.5 uppercase tracking-widest">Base</span>
        </div>

        {/* The Track */}
        <div className="relative h-2 w-full bg-slate-200 rounded-full">
          {/* Filled portion of track */}
          <div
            className="absolute top-0 left-0 h-full transition-all duration-700 ease-in-out"
            style={{ width: `${progress}%`, backgroundColor: '#3b82f6' }}
          />

          {/* Dots for each step */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full flex justify-between px-[1px] pointer-events-none">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`w-3.5 h-3.5 rounded-full transition-colors duration-700 z-10 ${i <= currentStep ? 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]' : 'bg-slate-300'}`}
              />
            ))}
          </div>
        </div>

        {/* THE WALKING MECHANIC */}
        <div
          className="absolute bottom-4 transition-all duration-700 ease-in-out z-30 flex flex-col items-center -ml-5"
          style={{ left: `${progress}%` }}
        >
          <div className="relative flex items-end">
            
            {/* The Robot State being carried (hidden on Step 0) */}
            <div className={`absolute -top-10 -right-8 z-40 w-16 h-16 animate-bounce drop-shadow-lg transition-opacity duration-500 ${currentStep === 0 ? 'opacity-0' : 'opacity-100'}`}>
              <img 
                src={`/part-${frameIndex}.png`} 
                alt="Robot Part" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden w-full h-full bg-slate-200 rounded text-[10px] text-slate-500 items-center justify-center text-center font-bold shadow-sm p-1">
                Add<br/>part-{frameIndex}.png
              </div>
            </div>
            
            {/* Mechanic SVG */}
            <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-slate-700" stroke="currentColor">
              {/* Head */}
              <circle cx="12" cy="7" r="3" strokeWidth="2" fill="currentColor" />
              {/* Body */}
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v7" />
              {/* Right Arm (Carrying) */}
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12l3-2h3" />
              {/* Left Arm (Swinging) */}
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12l-2 3" />
              {/* Legs walking */}
              <path className="leg-front" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 17l-2 5" />
              <path className="leg-back" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 17l2 5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Step Labels */}
      <div className="flex flex-wrap gap-2 justify-center ml-12">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isPast = index < currentStep;
          
          return (
            <button
              key={step}
              onClick={() => onStepClick(index)}
              style={
                isActive 
                  ? { backgroundColor: '#3b82f6', color: '#ffffff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' } 
                  : {}
              }
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 ${
                !isActive && isPast
                  ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                  : !isActive && !isPast
                  ? "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  : ""
              }`}
            >
              {step}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default RobotProgress;
