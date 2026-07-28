export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
      <div className="flex justify-between items-start mb-3">
        <div className="h-5 w-24 bg-mist rounded-lg" />
        <div className="h-4 w-16 bg-mist rounded-md" />
      </div>
      <div className="h-6 w-3/4 bg-mist rounded-lg mb-2" />
      <div className="h-4 w-full bg-mist rounded mb-1" />
      <div className="h-4 w-2/3 bg-mist rounded mb-4" />
      <div className="flex gap-4 mb-4">
        <div className="h-4 w-20 bg-mist rounded" />
        <div className="h-4 w-20 bg-mist rounded" />
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="h-5 w-24 bg-mist rounded-lg" />
        <div className="h-6 w-20 bg-mist rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonWorkerCard() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse text-center">
      <div className="w-16 h-16 rounded-2xl bg-mist mx-auto mb-4" />
      <div className="h-4 w-24 bg-mist rounded mx-auto mb-2" />
      <div className="h-3 w-16 bg-mist rounded mx-auto mb-3" />
      <div className="h-4 w-20 bg-mist rounded mx-auto mb-3" />
      <div className="h-6 w-24 bg-mist rounded-lg mx-auto" />
    </div>
  );
}
