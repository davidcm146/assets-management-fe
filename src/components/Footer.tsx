export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card text-muted-foreground">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <p className="text-xs">
          &copy; {currentYear} Hệ thống Quản lý Phiếu mượn. Bản quyền thuộc về
          công ty.
        </p>
        <p className="hidden text-xs md:block">
          Phát triển bởi{" "}
          <span className="font-medium text-blue-700">Đội ngũ kỹ thuật</span>
        </p>
      </div>
    </footer>
  );
}
