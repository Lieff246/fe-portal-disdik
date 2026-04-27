export const Skeleton = ({
    className = "",
    fullHeight = false,
  }: {
    className?: string;
    fullHeight?: boolean;
  }) => {
    return (
      <div
        className={`animate-pulse bg-gray-200 rounded-2xl ${className} ${
          fullHeight ? "h-full" : ""
        }`}
      ></div>
    );
  };
  
