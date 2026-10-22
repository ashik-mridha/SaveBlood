"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Droplet, HandHeart, Pencil, SearchX } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import { useFetch } from "@/hooks/useFetch";
import { DEFAULT_REQUEST_IMAGE, cn, formatDate, formatLocation, formatStatus, formatTime, getStatusTone, getUrgencyTone, urgencyLabels } from "@/lib/utils";
import RequestCard from "@/components/common/RequestCard";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { Input, Textarea } from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { CardSkeleton, Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";

function DetailsSkeleton() {
  return (
    <div className="container-page grid gap-8 py-10 lg:grid-cols-3" role="status" aria-label="Loading request">
      <div className="space-y-4 lg:col-span-2">
        <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-32 w-full" />
      </div>
      <Skeleton className="h-72 w-full rounded-2xl" />
    </div>
  );
}

function Gallery({ images, alt }) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : [DEFAULT_REQUEST_IMAGE];

  return (
    <div>
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-line bg-brand-100 dark:bg-brand-900/30">
        <Image src={list[active]} alt={alt} fill priority sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover" />
      </div>
      {list.length > 1 && (
        <ul className="mt-3 grid grid-cols-4 gap-3" aria-label="Gallery thumbnails">
          {list.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show image ${i + 1} of ${list.length}`}
                aria-current={i === active}
                className={cn("focus-ring relative block aspect-[16/10] w-full overflow-hidden rounded-xl border-2", i === active ? "border-brand-600" : "border-transparent opacity-70 hover:opacity-100")}
              >
                <Image src={src} alt="" fill sizes="160px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DonateModal({ request, open, onClose, onDonated }) {
  const toast = useToast();
  const [form, setForm] = useState({ donorPhone: "", donorMessage: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      await api.donateToRequest(request._id, form);
      toast.success("Thank you! The requester has been notified that you will donate.");
      onDonated();
      onClose();
    } catch (err) {
      setErrors(err.errors || {});
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Confirm your donation"
      description={`${request.bloodGroup} blood for ${request.recipientName} at ${request.hospitalName}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="donate-form" loading={submitting}>
            Confirm donation
          </Button>
        </>
      }
    >
      <form id="donate-form" onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <Input
          label="Your phone number"
          type="tel"
          inputMode="tel"
          placeholder="01XXXXXXXXX"
          value={form.donorPhone}
          onChange={(e) => setForm((f) => ({ ...f, donorPhone: e.target.value }))}
          error={errors.donorPhone}
          hint="Shared only with the requester so they can coordinate the visit."
        />
        <Textarea
          label="Message to the family"
          rows={3}
          placeholder="When can you reach the hospital?"
          value={form.donorMessage}
          onChange={(e) => setForm((f) => ({ ...f, donorMessage: e.target.value }))}
          error={errors.donorMessage}
        />
      </form>
    </Modal>
  );
}

export default function RequestDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [donateOpen, setDonateOpen] = useState(false);

  const { data: request, error, reload } = useFetch(() => api.getRequest(id), [id, user?._id]);
  const { data: related } = useFetch(() => api.getRelatedRequests(id), [id], { enabled: Boolean(request) });

  if (error?.status === 404 || error?.status === 400) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={SearchX}
          title="This request could not be found"
          description="It may have been removed by the requester or the link is incorrect."
          action={<Button href="/donation-requests">Browse open requests</Button>}
        />
      </div>
    );
  }
  if (error && !request) {
    return (
      <div className="container-page py-16">
        <EmptyState title="We could not load this request" description={error.message} action={<Button onClick={reload}>Try again</Button>} />
      </div>
    );
  }
  if (!request || request._id !== id) return <DetailsSkeleton />;

  const isOwner = user?._id === request.requesterId;
  const canManage = isOwner || user?.role === "admin";
  const canDonate = request.status === "pending" && !isOwner;

  const facts = [
    ["Patient", request.recipientName],
    ["Blood group needed", request.bloodGroup],
    ["Units required", request.unitsNeeded],
    ["Hospital", request.hospitalName],
    ["Address", request.fullAddress],
    ["Area", formatLocation(request.district, request.upazila)],
    ["Donation date", formatDate(request.donationDate)],
    ["Time", formatTime(request.donationTime)],
    ["Requested by", request.requesterName],
    ["Posted on", formatDate(request.createdAt)],
  ];

  return (
    <div className="container-page py-8 md:py-12">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
        <Link href="/donation-requests" className="hover:text-brand-600">
          Donation requests
        </Link>
        <span className="mx-2" aria-hidden="true">/</span>
        <span className="text-ink">{request.recipientName}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <Gallery images={request.images} alt={`${request.hospitalName}, ${formatLocation(request.district)}`} />

          <header>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge tone="solid" className="gap-1 text-sm">
                <Droplet className="size-3.5 fill-current" aria-hidden="true" />
                {request.bloodGroup}
              </Badge>
              <Badge tone={getStatusTone(request.status)}>{formatStatus(request.status)}</Badge>
              <Badge tone={getUrgencyTone(request.urgency)}>{urgencyLabels[request.urgency]} priority</Badge>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-ink md:text-4xl">
              {request.bloodGroup} blood needed for {request.recipientName}
            </h1>
          </header>

          <Card>
            <CardHeader>
              <CardTitle as="h2">Overview</CardTitle>
            </CardHeader>
            <CardBody>
              <p className="whitespace-pre-line leading-relaxed text-ink">{request.requestMessage}</p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle as="h2">Request details</CardTitle>
            </CardHeader>
            <dl className="divide-y divide-line">
              {facts.map(([label, value]) => (
                <div key={label} className="grid gap-1 px-5 py-3 sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-semibold text-muted">{label}</dt>
                  <dd className="text-sm font-medium text-ink sm:col-span-2">{value}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle as="h2">Donor activity</CardTitle>
            </CardHeader>
            <CardBody>
              {request.donorName ? (
                <div className="flex gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/40">
                    <HandHeart className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-ink">
                      {request.donorName} {request.status === "done" ? "donated blood for this request" : "has agreed to donate"}
                    </p>
                    {request.donorRespondedAt && <p className="text-xs text-muted">{formatDate(request.donorRespondedAt)}</p>}
                    {request.donorMessage && <p className="mt-2 rounded-xl bg-surface-muted p-3 text-sm text-ink">“{request.donorMessage}”</p>}
                    {request.donorPhone && <p className="mt-2 text-sm text-muted">Phone: {request.donorPhone}</p>}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted">No donor has responded yet. Be the first to help — every hour matters.</p>
              )}
            </CardBody>
          </Card>
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <Card>
              <CardBody className="space-y-4">
                <p className="text-sm text-muted">
                  {request.status === "pending"
                    ? `${request.unitsNeeded} unit${request.unitsNeeded > 1 ? "s" : ""} of ${request.bloodGroup} needed on ${formatDate(request.donationDate)}.`
                    : `This request is ${formatStatus(request.status).toLowerCase()}.`}
                </p>
                {canDonate && user && (
                  <Button size="lg" className="w-full" onClick={() => setDonateOpen(true)}>
                    <HandHeart className="size-5" aria-hidden="true" />
                    I want to donate
                  </Button>
                )}
                {canDonate && !user && (
                  <>
                    <Button href="/login" size="lg" className="w-full">
                      Log in to donate
                    </Button>
                    <p className="text-center text-xs text-muted">
                      New here?{" "}
                      <Link href="/register" className="font-semibold text-brand-600 hover:underline">
                        Create a free account
                      </Link>
                    </p>
                  </>
                )}
                {canManage && (
                  <Button href={`/dashboard/requests/${request._id}/edit`} variant="outline" className="w-full">
                    <Pencil className="size-4" aria-hidden="true" />
                    Edit request
                  </Button>
                )}
              </CardBody>
            </Card>
            <p className="rounded-xl bg-amber-50 p-4 text-xs leading-relaxed text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
              Blood donation is voluntary. Never pay or accept payment for blood, and confirm details with the hospital blood bank.
            </p>
          </div>
        </aside>
      </div>

      <section className="mt-16" aria-labelledby="related-title">
        <h2 id="related-title" className="mb-6 text-2xl font-extrabold tracking-tight text-ink">
          Related requests
        </h2>
        {!related ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : related.items.length ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {related.items.map((item) => (
              <RequestCard key={item._id} request={item} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">No similar open requests right now.</p>
        )}
      </section>

      {canDonate && user && <DonateModal request={request} open={donateOpen} onClose={() => setDonateOpen(false)} onDonated={reload} />}
    </div>
  );
}
