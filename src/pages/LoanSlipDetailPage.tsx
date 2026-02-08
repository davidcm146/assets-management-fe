import LoanSlipDetail from "@/features/loan-slips/loan-slip-detail";
import { useParams } from "react-router-dom";

export default function LoanSlipDetailPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) return null;

  return (
    <LoanSlipDetail
      id={id}
    />
  );
}
