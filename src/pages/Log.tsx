import { BookOpen } from "lucide-react";

export default function Log() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-8 w-1 rounded-full bg-blue-700" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Nhật ký
          </h1>
          <p className="text-sm text-muted-foreground">
            Lịch sử hoạt động của hệ thống
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-200 bg-blue-50/40 py-16">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 mb-4">
          <BookOpen className="h-7 w-7 text-blue-600" />
        </div>
        <p className="text-sm font-medium text-foreground">
          Chưa có nhật ký nào
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Các hoạt động của hệ thống sẽ được ghi lại tại đây
        </p>
      </div>
    </div>
  );
}
