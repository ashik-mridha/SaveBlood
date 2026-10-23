"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Download, Lock, Mail, MapPin, Phone, Search } from "lucide-react";
import { api } from "@/lib/api";
import { formatLocation } from "@/lib/utils";
import { bloodGroups, districts, upazilas } from "@/components/geoData";
import { useAuth } from "@/providers/AuthProvider";
import { useFetch } from "@/hooks/useFetch";
import SectionHeading from "@/components/common/SectionHeading";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import { Select } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";

const LIMIT = 12;
const validGroup = (value) => (bloodGroups.some((group) => group.key === value) ? value : "");
const validDistrict = (value) => (districts.some((district) => district.key === value) ? value : "");

function DonorCard({ donor, signedIn }) {
  return (
    <article className="flex h-full flex-col gap-4 rounded-2xl border border-line bg-surface p-5 shadow-card">
      <div className="flex items-center gap-3">
        <Avatar name={donor.name} src={donor.avatar} size={48} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-bold text-ink">{donor.name}</h3>
          <p className="flex items-center gap-1 truncate text-sm text-muted">
            <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
            {formatLocation(donor.district, donor.upazila)}
          </p>
        </div>
        <Badge tone="solid" className="text-sm">
          {donor.bloodGroup}
        </Badge>
      </div>

      <div className="mt-auto border-t border-line pt-4 text-sm">
        {signedIn ? (
          <ul className="flex flex-col gap-2">
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0 text-brand-600" aria-hidden="true" />
              <a href={`mailto:${donor.email}`} className="focus-ring truncate rounded hover:text-brand-600">
                {donor.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-brand-600" aria-hidden="true" />
              {donor.phone ? (
                <a href={`tel:${donor.phone}`} className="focus-ring rounded hover:text-brand-600">
                  {donor.phone}
                </a>
              ) : (
                <span className="text-muted">Phone not shared</span>
              )}
            </li>
          </ul>
        ) : (
          <p className="flex items-center gap-2 text-muted">
            <Lock className="size-4 shrink-0" aria-hidden="true" />
            <span>
              <Link href="/login" className="font-semibold text-brand-600 hover:underline">
                Log in
              </Link>{" "}
              to see contact details
            </span>
          </p>
        )}
      </div>
    </article>
  );
}

function SearchContent() {
  const params = useSearchParams();
  const { user } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState({
    bloodGroup: validGroup(params.get("bloodGroup")),
    district: validDistrict(params.get("district")),
    upazila: params.get("upazila") || "",
  });
  const [applied, setApplied] = useState(form);
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);

  const hasFilter = Boolean(applied.bloodGroup || applied.district || applied.upazila);
  const { data, loading, error } = useFetch(() => api.searchDonors({ ...applied, page, limit: LIMIT }), [applied, page, user?._id], {
    enabled: hasFilter,
  });

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value, ...(name === "district" ? { upazila: "" } : {}) }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setApplied(form);
    setPage(1);
  };

  const onReset = () => {
    const cleared = { bloodGroup: "", district: "", upazila: "" };
    setForm(cleared);
    setApplied(cleared);
    setPage(1);
  };

  const exportPdf = async () => {
    setExporting(true);
    try {
      const all = await api.searchDonors({ ...applied, page: 1, limit: 48 });
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("SaveBlood - Donor search results", 14, 18);
      doc.setFontSize(10);
      const filterText = [applied.bloodGroup, applied.district && formatLocation(applied.district), applied.upazila && formatLocation("", applied.upazila)]
        .filter(Boolean)
        .join(" | ");
      doc.text(`Filters: ${filterText} - ${all.total} donor(s)`, 14, 26);

      let y = 38;
      all.items.forEach((donor, index) => {
        if (y > 275) {
          doc.addPage();
          y = 20;
        }
        doc.setFont(undefined, "bold");
        doc.text(`${index + 1}. ${donor.name} (${donor.bloodGroup})`, 14, y);
        doc.setFont(undefined, "normal");
        const line = [formatLocation(donor.district, donor.upazila), user && donor.email, user && donor.phone].filter(Boolean).join("  |  ");
        doc.text(line, 20, y + 6);
        y += 15;
      });
      doc.save("saveblood-donors.pdf");
    } catch (err) {
      toast.error(err.message || "The PDF could not be created.");
    } finally {
      setExporting(false);
    }
  };

  const donors = data?.items ?? [];

  return (
    <div className="container-page section">
      <SectionHeading
        as="h1"
        eyebrow="Find a donor"
        title="Search donors by blood group and location"
        description="Choose a blood group, a district and optionally an upazila. Contact details are shown to signed-in members only."
      />

      <form onSubmit={onSubmit} className="mx-auto mb-10 grid max-w-5xl gap-4 rounded-2xl border border-line bg-surface p-5 shadow-card sm:grid-cols-2 lg:grid-cols-[repeat(3,1fr)_auto]">
        <Select label="Blood group" name="bloodGroup" value={form.bloodGroup} onChange={onChange} options={bloodGroups} placeholder="Any group" />
        <Select label="District" name="district" value={form.district} onChange={onChange} options={districts} placeholder="Any district" />
        <Select
          label="Upazila"
          name="upazila"
          value={form.upazila}
          onChange={onChange}
          options={upazilas[form.district] || []}
          placeholder={form.district ? "Any upazila" : "Select a district first"}
          disabled={!form.district}
        />
        <div className="flex items-end gap-2">
          <Button type="submit" className="flex-1">
            <Search className="size-4" aria-hidden="true" />
            Search
          </Button>
          <Button type="button" variant="outline" onClick={onReset}>
            Reset
          </Button>
        </div>
      </form>

      {!hasFilter ? (
        <EmptyState icon={Search} title="Start your search" description="Pick at least one filter above to see matching donors." />
      ) : error ? (
        <EmptyState title="Search failed" description={error.message} />
      ) : loading && !donors.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" role="status" aria-label="Loading donors">
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      ) : !donors.length ? (
        <EmptyState title="No donors found" description="Try removing the upazila or choosing a nearby district." action={<Button href="/donation-requests" variant="outline">Browse open requests</Button>} />
      ) : (
        <>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-muted" aria-live="polite">
              {data.total} donor{data.total === 1 ? "" : "s"} found
            </p>
            <Button variant="outline" size="sm" onClick={exportPdf} loading={exporting}>
              {!exporting && <Download className="size-4" aria-hidden="true" />}
              Export PDF
            </Button>
          </div>
          <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${loading ? "opacity-60" : ""}`}>
            {donors.map((donor) => (
              <DonorCard key={donor._id} donor={donor} signedIn={Boolean(user)} />
            ))}
          </div>
          <Pagination page={page} pages={data.pages} onChange={setPage} className="mt-10" />
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchContent />
    </Suspense>
  );
}
