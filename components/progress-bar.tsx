
type ProgressBarProps = {
  progress: number;
  className?: string;
};

const ProgressBar = ({ progress, className = "" }: ProgressBarProps) => (
  <div className={`w-full bg-gray-700 rounded-full h-2 overflow-hidden ${className}`}>
    <div 
      className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-700 ease-out transform"
      style={{ width: `${progress}%` }}
    >
      <div className="h-full w-full bg-white/20 animate-pulse"></div>
    </div>
  </div>
);


export default ProgressBar;