import Image from "next/image";
import loading from "@/public/loading.gif";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <Image
          src={loading}
          alt="Loading..."
          width={150}
          height={150}
          className="animate-spin-slow"
        />
      </div>
    </div>
  );
}
