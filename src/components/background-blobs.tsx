export function BackgroundBlobs() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute -top-[10vw] -left-[8vw] h-[40vw] w-[40vw] rounded-full bg-pink opacity-45 blur-[70px] dark:bg-[#FF8FB1] dark:opacity-[0.28]" />
      <div className="absolute top-[30vh] -right-[10vw] h-[36vw] w-[36vw] rounded-full bg-blue opacity-30 blur-[70px] dark:bg-[#5B7CFF] dark:opacity-[0.28]" />
      <div className="absolute bottom-[-8vw] left-[25vw] h-[30vw] w-[30vw] rounded-full bg-sun opacity-35 blur-[70px] dark:bg-[#7C5CFF] dark:opacity-[0.25]" />
    </div>
  );
}
