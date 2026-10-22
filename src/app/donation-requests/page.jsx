import RequestExplorer from "@/components/requests/RequestExplorer";

export const metadata = {
  title: "Blood Donation Requests",
  description:
    "Browse open blood requests across Bangladesh. Filter by blood group, district and urgency, then respond as a donor.",
};

export default function DonationRequestsPage() {
  return <RequestExplorer />;
}
