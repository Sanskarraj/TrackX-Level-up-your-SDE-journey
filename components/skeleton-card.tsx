const SkeletonCard = ({ className = "" }) => (
  <div className={`bg-gray-800/50 rounded-xl p-6 animate-pulse ${className}`}>
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
    <div className="mt-4">
      <div className="h-2 bg-gray-700 rounded-full"></div>
    </div>
  </div>
);

export default SkeletonCard;