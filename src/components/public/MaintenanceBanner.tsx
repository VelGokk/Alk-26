export default function MaintenanceBanner({ message }: { message: string }) {
  return (
    <div className="w-full bg-ember text-white text-sm px-4 py-2 text-center">
      {message}
    </div>
  );
}
