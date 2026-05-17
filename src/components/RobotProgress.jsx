function RobotProgress({ steps, currentStep, onStepClick }) {
  // Calculate progress percentage to move the robot along the track
  const progress = (currentStep / (steps.length - 1)) * 100;

  // Calculate how much of the robot to reveal (top to bottom)
  // Step 0: 35% (Head), Step 1: 45%, Step 2: 55%, Step 3: 65% (Arms), Step 4: 80% (Legs), Step 5: 90%, Step 6: 100% (Full)
  const revealPercentages = [35, 45, 55, 65, 80, 90, 100];
  const currentReveal = revealPercentages[currentStep] || 100;
  const bottomInset = 100 - currentReveal;

  return (
    <div className="mb-8 w-full max-w-2xl mx-auto px-4">
      {/* Robot and Bar Container */}
      <div className="relative pt-8 pb-4">
        {/* The Robot Icon (absolutely positioned moving along the track) */}
        <div
          className="absolute top-0 -ml-8 -mt-10 transition-all duration-700 ease-out z-10 flex flex-col items-center"
          style={{ left: `${progress}%` }}
        >
          {/* The Assembling Robot Image */}
          <div className="w-16 h-20 relative flex items-end justify-center">
            {/* We use clip-path to reveal the robot from top to bottom */}
            <img 
              src="/robot.png" 
              alt="Robot Progress" 
              className="w-full h-full object-contain drop-shadow-xl transition-all duration-700 ease-out"
              style={{ clipPath: `inset(0 0 ${bottomInset}% 0)` }}
              onError={(e) => {
                // Fallback text if image is not found
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            {/* Fallback box if robot.png is missing */}
            <div className="hidden w-10 h-10 bg-blue-500 text-white rounded-md items-center justify-center text-xs text-center p-1 leading-tight shadow-lg">
              Add<br/>robot.png
            </div>
          </div>
          
          {/* Tooltip triangle */}
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-t-[6px] border-t-blue-500 border-r-[6px] border-r-transparent mt-1" />
        </div>

        {/* The Track */}
        <div className="relative h-2 w-full bg-slate-200 rounded-full overflow-hidden mt-6">
          {/* Filled portion of track */}
          <div
            className="absolute top-0 left-0 h-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%`, backgroundColor: '#3b82f6' }}
          />
        </div>
      </div>

      {/* Step Labels */}
      <div className="flex flex-wrap gap-2 justify-center mt-4">
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
