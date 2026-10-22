"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HeartHandshake } from "lucide-react";
import { api } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useFetch } from "@/hooks/useFetch";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import SectionHeading from "@/components/common/SectionHeading";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import DataTable from "@/components/ui/Table";
import { useToast } from "@/components/ui/Toast";

const presets = [10, 25, 50, 100];

function FundingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const sessionId = searchParams.get("session_id");
  const confirmedRef = useRef(null);

  const [page, setPage] = useState(1);
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [processing, setProcessing] = useState(false);

  const { data, loading, error, reload } = useFetch(() => api.getFundings({ page, limit: 8 }), [page]);

  // Returning from Stripe Checkout: verify the session server-side exactly once.
  useEffect(() => {
    if (!sessionId || confirmedRef.current === sessionId) return;
    confirmedRef.current = sessionId;

    api
      .confirmFunding(sessionId)
      .then(() => {
        toast.success("Thank you! Your contribution was received.");
        setPage(1);
        reload();
      })
      .catch((err) => toast.error(err.message))
      .finally(() => router.replace("/funding"));
  }, [sessionId, toast, router, reload]);

  const onSubmit = async (event) => {
    event.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value < 1 || value > 10000) {
      setAmountError("Enter an amount between 1 and 10,000 USD.");
      return;
    }
    setAmountError("");
    setProcessing(true);
    try {
      const { url } = await api.createCheckoutSession({ amount: value });
      window.location.assign(url);
    } catch (err) {
      setAmountError(err.errors?.amount || "");
      toast.error(err.message);
      setProcessing(false);
    }
  };

  const columns = [
    { key: "userName", header: "Contributor", render: (row) => <span className="font-semibold">{row.userName}</span> },
    { key: "amount", header: "Amount", render: (row) => formatCurrency(row.amount) },
    { key: "createdAt", header: "Date", render: (row) => formatDate(row.createdAt) },
  ];

  return (
    <div className="container-page section">
      <SectionHeading
        as="h1"
        eyebrow="Funding"
        title="Support donors who travel to save a life"
        description="Contributions pay for donor transport, refreshments at awareness camps and the running costs of the platform. Every dollar is tracked below."
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-1">
          <Card>
            <CardBody className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-muted">Total raised</p>
              <p className="mt-2 text-4xl font-extrabold text-brand-600">{data ? formatCurrency(data.totalFunds) : "—"}</p>
              <p className="mt-1 text-sm text-muted">{data ? `${data.total} contributions` : " "}</p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HeartHandshake className="size-5 text-brand-600" aria-hidden="true" />
                Make a contribution
              </CardTitle>
              <p className="text-sm text-muted">Secure card payment by Stripe, in US dollars.</p>
            </CardHeader>
            <CardBody>
              <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
                <div className="grid grid-cols-4 gap-2" role="group" aria-label="Preset amounts">
                  {presets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(String(preset))}
                      aria-pressed={amount === String(preset)}
                      className={`focus-ring h-10 rounded-xl border text-sm font-semibold transition-colors ${
                        amount === String(preset) ? "border-brand-600 bg-brand-600 text-white" : "border-line bg-surface text-ink hover:border-brand-500"
                      }`}
                    >
                      ${preset}
                    </button>
                  ))}
                </div>
                <Input
                  label="Amount (USD)"
                  type="number"
                  inputMode="decimal"
                  min="1"
                  max="10000"
                  step="1"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  error={amountError}
                />
                <Button type="submit" size="lg" loading={processing} className="w-full">
                  {processing ? "Redirecting…" : "Contribute"}
                </Button>
              </form>
            </CardBody>
          </Card>
        </div>

        <Card className="overflow-hidden lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent contributions</CardTitle>
          </CardHeader>
          {error ? (
            <p role="alert" className="p-5 text-sm font-medium text-red-600">
              {error.message}
            </p>
          ) : (
            <DataTable
              columns={columns}
              rows={data?.items}
              loading={loading}
              page={page}
              pages={data?.pages ?? 1}
              total={data?.total}
              onPageChange={setPage}
              empty="No contributions yet. Be the first to support SaveBlood."
            />
          )}
        </Card>
      </div>
    </div>
  );
}

export default function FundingPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={null}>
        <FundingContent />
      </Suspense>
    </ProtectedRoute>
  );
}
