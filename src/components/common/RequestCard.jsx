import Image from "next/image";
import { Building2, CalendarDays, Clock, Droplet, MapPin } from "lucide-react";
import { DEFAULT_REQUEST_IMAGE, formatDate, formatLocation, formatStatus, formatTime, getStatusTone, getUrgencyTone, urgencyLabels } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

/** Equal-height listing card for a donation request. */
export default function RequestCard({ request, priority = false }) {
  const image = request.images?.[0] || DEFAULT_REQUEST_IMAGE;
  const summary = request.requestMessage?.length > 110 ? `${request.requestMessage.slice(0, 110).trimEnd()}…` : request.requestMessage;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[16/10] overflow-hidden bg-brand-100 dark:bg-brand-900/30">
        <Image
          src={image}
          alt={`${request.hospitalName}, ${formatLocation(request.district)}`}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-brand-600 px-3 py-1 text-sm font-extrabold text-white shadow">
          <Droplet className="size-3.5 fill-current" aria-hidden="true" />
          {request.bloodGroup}
        </span>
        <div className="absolute right-3 top-3 flex gap-1.5">
          {request.urgency && request.urgency !== "normal" && (
            <Badge tone={getUrgencyTone(request.urgency)}>{urgencyLabels[request.urgency]}</Badge>
          )}
          {request.status !== "pending" && <Badge tone={getStatusTone(request.status)}>{formatStatus(request.status)}</Badge>}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-bold leading-snug tracking-tight text-ink">
          {request.bloodGroup} blood for {request.recipientName}
        </h3>
        <p className="text-sm leading-relaxed text-muted">{summary}</p>

        <ul className="mt-auto flex flex-col gap-1.5 pt-2 text-sm text-muted">
          <li className="flex items-center gap-2">
            <Building2 className="size-4 shrink-0 text-brand-600" aria-hidden="true" />
            <span className="truncate">{request.hospitalName}</span>
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-brand-600" aria-hidden="true" />
            <span className="truncate">{formatLocation(request.district, request.upazila)}</span>
          </li>
          <li className="flex items-center gap-2">
            <CalendarDays className="size-4 shrink-0 text-brand-600" aria-hidden="true" />
            <span>{formatDate(request.donationDate)}</span>
            <Clock className="ml-2 size-4 shrink-0 text-brand-600" aria-hidden="true" />
            <span>{formatTime(request.donationTime)}</span>
          </li>
        </ul>

        <Button href={`/donation-requests/${request._id}`} variant="outline" className="mt-3 w-full">
          View Details
        </Button>
      </div>
    </article>
  );
}
