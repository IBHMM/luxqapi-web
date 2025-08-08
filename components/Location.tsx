import { type GeneralInfo } from "@/lib/api";
import { WazeButton } from "./home/Wazebutton";
import { LocationTexts } from "./home/LocationTexts";

export async function Location({ generalInfo }: { generalInfo?: GeneralInfo }) {
  if (!generalInfo) return null;

  const locationUrl = generalInfo?.location;
  const latMatch = locationUrl.match(/3d([\d.]+)!4d([\d.]+)/);
  const lat = latMatch?.[1];
  const lng = latMatch?.[2];

  return (
    <section className="flex flex-col md:flex-row gap-6 items-stretch p-6 max-w-7xl mx-auto py-16">
      <div className="flex-1 min-h-[350px]">
        {lat && lng ? (
          <iframe
            src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
            className="w-full h-full min-h-[350px] rounded-lg border"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <p className="text-red-500">Xəritə mövcud deyil.</p>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center gap-6">
        <LocationTexts generalInfo={generalInfo} />

        <div>
          {lat && lng && <WazeButton lat={lat} lng={lng} />}
        </div>
      </div>
    </section>
  );
}
