"use client";

import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Card, CardBody } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import RequestForm from "@/components/forms/RequestForm";
import PageHeader from "@/components/dashboard/PageHeader";

export default function CreateRequestPage() {
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async (payload) => {
    await api.createRequest(payload);
    toast.success("Your donation request is now live.");
    router.push("/dashboard/requests");
  };

  return (
    <div className="max-w-3xl">
      <PageHeader title="Create a donation request" description="Share the patient and hospital details so matching donors can respond quickly." />
      <Card>
        <CardBody className="sm:p-8">
          <RequestForm submitLabel="Publish request" onSubmit={handleSubmit} />
        </CardBody>
      </Card>
    </div>
  );
}
