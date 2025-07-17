// src/components/skeleton-loader.tsx
export default function SkeletonLoader() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 w-1/3 bg-muted rounded" />
      <div className="h-4 w-full bg-muted rounded" />
      <div className="h-4 w-full bg-muted rounded" />
      <div className="h-4 w-2/3 bg-muted rounded" />
    </div>
  );
}
