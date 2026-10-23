"use client";

import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import { useFetch } from "@/hooks/useFetch";
import { Card, CardBody } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import RequestForm from "@/components/forms/RequestForm";
import PageHeader from "@/components/dashboard/PageHeader";

export default function EditRequestPage() {
  const { id } = useParams();
  const router = useRouter();
  const toast = useToast();
  const { user } = useAuth();
  const { data: request, error } = useFetch(() => api.getRequest(id), [id]);

  const handleSubmit = async (payload) => {
    // The server only accepts the editable fields and ignores the rest.
    await api.updateRequest(id, payload);
    toast.success("Request updated.");
    router.push("/dashboard/requests");
  };

  const forbidden = request && user.role !== "admin" && request.requesterId !== user._id;

  return (
    <div className="max-w-3xl">
      <PageHeader title="Edit donation request" description="Only pending requests can be edited by their owner." />
      <Card>
        <CardBody className="sm:p-8">
          {error || forbidden ? (
            <p role="alert" className="text-sm font-medium text-red-700 dark:text-red-300">
              {forbidden ? "You can only edit your own requests." : error.message}
            </p>
          ) : !request ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 6 }, (_, index) => (
                <Skeleton key={index} className="h-11" />
              ))}
            </div>
          ) : (
            <RequestForm initial={request} submitLabel="Save changes" onSubmit={handleSubmit} />
          )}
        </CardBody>
      </Card>
    </div>
  );
}
