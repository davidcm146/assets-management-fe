import { zodResolver } from "@hookform/resolvers/zod"
import { Bell, Pencil, Plus, Search, Trash2, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

type BorrowRequest = {
  id: string
  fullName: string
  department?: string
  position?: string
  productName?: string
  serialNumber?: string
  description?: string
  imageUrl?: string
  imageName?: string
  borrowDate: string
  returnDate: string
  createdAt: number
}

const requestSchema = z.object({
  fullName: z.string().trim().min(1, "Họ tên là bắt buộc"),
  department: z.string().trim().optional(),
  position: z.string().trim().optional(),
  productName: z.string().trim().optional(),
  serialNumber: z.string().trim().optional(),
  description: z.string().trim().optional(),
  borrowDate: z.string().trim().optional(),
  returnDate: z.string().trim().min(1, "Ngày trả là bắt buộc"),
  imageFile: z.instanceof(File).optional(),
})

type RequestFormValues = z.infer<typeof requestSchema>

function makeId() {
  const uuid = globalThis.crypto?.randomUUID?.()
  if (uuid) return uuid
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

function normalizeOptionalText(value: string | undefined) {
  const v = value?.trim() ?? ""
  return v.length ? v : undefined
}

function nowDateValue() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

function addDays(dateValue: string, days: number) {
  const [y, m, d] = dateValue.split("-").map((x) => Number(x))
  const base = new Date(y, m - 1, d)
  base.setDate(base.getDate() + days)
  const yyyy = base.getFullYear()
  const mm = String(base.getMonth() + 1).padStart(2, "0")
  const dd = String(base.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

const seedRequests: BorrowRequest[] = [
  {
    id: makeId(),
    fullName: "Nguyễn Văn A",
    department: "Bảo vệ",
    position: "NV",
    productName: "Laptop Dell",
    serialNumber: "SN-123456",
    description: "Mượn để kiểm tra",
    borrowDate: nowDateValue(),
    returnDate: addDays(nowDateValue(), 1),
    createdAt: Date.now() - 1000 * 60 * 60,
  },
]

function Home() {
  const [requests, setRequests] = useState<BorrowRequest[]>(seedRequests)
  const [query, setQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const today = nowDateValue()

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      fullName: "",
      department: "",
      position: "",
      productName: "",
      serialNumber: "",
      description: "",
      borrowDate: nowDateValue(),
      returnDate: "",
      imageFile: undefined,
    },
    mode: "onSubmit",
  })

  const filteredRequests = useMemo(() => {
    const q = query.trim().toLowerCase()
    const sorted = [...requests].sort((a, b) => b.createdAt - a.createdAt)
    if (!q) return sorted

    return sorted.filter((r) => {
      const haystack = [
        r.fullName,
        r.department ?? "",
        r.position ?? "",
        r.productName ?? "",
        r.serialNumber ?? "",
        r.description ?? "",
      ]
        .join(" ")
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [requests, query])

  const overdueRequests = useMemo(() => {
    return requests
      .filter((r) => r.returnDate < today)
      .sort((a, b) => a.returnDate.localeCompare(b.returnDate))
  }, [requests, today])

  const watchedFile = form.watch("imageFile")

  useEffect(() => {
    if (!watchedFile) {
      setImagePreviewUrl(null)
      return
    }

    const url = URL.createObjectURL(watchedFile)
    setImagePreviewUrl(url)
    return () => {
      URL.revokeObjectURL(url)
    }
  }, [watchedFile])

  function openCreate() {
    setEditingId(null)
    form.reset({
      fullName: "",
      department: "",
      position: "",
      productName: "",
      serialNumber: "",
      description: "",
      borrowDate: nowDateValue(),
      returnDate: "",
      imageFile: undefined,
    })
    setIsModalOpen(true)
  }

  function openEdit(request: BorrowRequest) {
    setEditingId(request.id)
    form.reset({
      fullName: request.fullName,
      department: request.department ?? "",
      position: request.position ?? "",
      productName: request.productName ?? "",
      serialNumber: request.serialNumber ?? "",
      description: request.description ?? "",
      borrowDate: request.borrowDate,
      returnDate: request.returnDate,
      imageFile: undefined,
    })
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
  }

  function closeNotifications() {
    setIsNotificationsOpen(false)
  }

  function removeRequest(id: string) {
    setRequests((prev) => prev.filter((r) => r.id !== id))
  }

  function onSubmit(values: RequestFormValues) {
    const existing = editingId ? requests.find((r) => r.id === editingId) : null

    let imageUrl = existing?.imageUrl
    let imageName = existing?.imageName
    if (values.imageFile) {
      imageUrl = URL.createObjectURL(values.imageFile)
      imageName = values.imageFile.name
    }

    const normalized: BorrowRequest = {
      id: editingId ?? makeId(),
      fullName: values.fullName.trim(),
      department: normalizeOptionalText(values.department),
      position: normalizeOptionalText(values.position),
      productName: normalizeOptionalText(values.productName),
      serialNumber: normalizeOptionalText(values.serialNumber),
      description: normalizeOptionalText(values.description),
      imageUrl,
      imageName,
      borrowDate: values.borrowDate?.trim() ? values.borrowDate.trim() : today,
      returnDate: values.returnDate.trim(),
      createdAt: existing?.createdAt ?? Date.now(),
    }

    setRequests((prev) => {
      const exists = prev.some((r) => r.id === normalized.id)
      if (!exists) return [normalized, ...prev]
      return prev.map((r) => (r.id === normalized.id ? normalized : r))
    })
    closeModal()
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Phiếu mượn</h1>
          <p className="text-sm text-muted-foreground">Bảo vệ nhập thông tin người mượn và thiết bị.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsNotificationsOpen((v) => !v)}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-md border bg-background hover:bg-muted"
            aria-label="Thông báo"
            title="Thông báo"
          >
            <Bell className="h-5 w-5" />
            {overdueRequests.length ? (
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-xs font-semibold text-destructive-foreground">
                {overdueRequests.length}
              </span>
            ) : null}
          </button>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Tạo phiếu
          </button>
        </div>
      </header>

      {isNotificationsOpen ? (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0" onClick={closeNotifications} />
          <div className="absolute right-6 top-20 w-[calc(100%-3rem)] max-w-md rounded-lg border bg-card shadow-lg">
            <div className="flex items-center justify-between border-b p-4">
              <div className="text-left">
                <div className="text-sm font-semibold">Thông báo quá hạn</div>
                <div className="text-xs text-muted-foreground">Các phiếu có ngày trả trước hôm nay ({today}).</div>
              </div>
              <button
                type="button"
                onClick={closeNotifications}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background hover:bg-muted"
                aria-label="Đóng"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-auto p-2">
              {overdueRequests.length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground">Không có phiếu quá hạn.</div>
              ) : (
                <div className="space-y-2">
                  {overdueRequests.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        closeNotifications()
                        openEdit(r)
                      }}
                      className="w-full rounded-md border bg-background p-3 text-left hover:bg-muted"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-medium">{r.fullName}</div>
                          <div className="text-xs text-muted-foreground">{r.productName ?? "-"}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-semibold text-destructive">Quá hạn</div>
                          <div className="text-xs text-muted-foreground">Ngày trả: {r.returnDate}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}

      <section className="rounded-lg border bg-card">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm theo họ tên, bộ phận, sản phẩm, serial..."
              className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="text-sm text-muted-foreground">
            Tổng: <span className="font-medium text-foreground">{filteredRequests.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Họ tên</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Bộ phận</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Chức vụ</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Sản phẩm</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Serial</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Ngày mượn</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Ngày trả</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    Chưa có phiếu.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((r) => (
                  <tr key={r.id} className={`hover:bg-muted/30 ${r.returnDate < today ? "bg-destructive/10" : ""}`}>
                    <td className="whitespace-nowrap px-4 py-3 font-medium">{r.fullName}</td>
                    <td className="whitespace-nowrap px-4 py-3">{r.department ?? "-"}</td>
                    <td className="whitespace-nowrap px-4 py-3">{r.position ?? "-"}</td>
                    <td className="min-w-[220px] px-4 py-3">
                      <div className="font-medium">{r.productName ?? "-"}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{r.description ?? ""}</div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">{r.serialNumber ?? "-"}</td>
                    <td className="whitespace-nowrap px-4 py-3">{r.borrowDate}</td>
                    <td className={`whitespace-nowrap px-4 py-3 ${r.returnDate < today ? "font-semibold text-destructive" : ""}`}
                    >
                      {r.returnDate}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(r)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background hover:bg-muted"
                          aria-label="Sửa"
                          title="Sửa"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeRequest(r.id)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background hover:bg-muted"
                          aria-label="Xóa"
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-card shadow-lg">
            <div className="flex items-center justify-between border-b p-4">
              <div className="text-left">
                <div className="text-lg font-semibold">{editingId ? "Sửa phiếu" : "Tạo phiếu"}</div>
                <div className="text-sm text-muted-foreground">Chỉ cần bắt buộc nhập họ tên.</div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background hover:bg-muted"
                aria-label="Đóng"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-sm font-medium">Họ tên *</label>
                <input
                  {...form.register("fullName")}
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Nhập họ tên"
                />
                {form.formState.errors.fullName ? (
                  <div className="text-xs text-destructive">{form.formState.errors.fullName.message}</div>
                ) : null}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Bộ phận</label>
                <input
                  {...form.register("department")}
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="VD: Sales / IT / ..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Chức vụ</label>
                <input
                  {...form.register("position")}
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="VD: Nhân viên"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Tên sản phẩm</label>
                <input
                  {...form.register("productName")}
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="VD: Laptop / iPhone / ..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Số serial number</label>
                <input
                  {...form.register("serialNumber")}
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="VD: SN-123456"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-sm font-medium">Mô tả</label>
                <textarea
                  {...form.register("description")}
                  className="min-h-[90px] w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Ghi chú nếu có"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Ngày mượn</label>
                <input
                  {...form.register("borrowDate")}
                  type="date"
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Ngày trả *</label>
                <input
                  {...form.register("returnDate")}
                  type="date"
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                {form.formState.errors.returnDate ? (
                  <div className="text-xs text-destructive">{form.formState.errors.returnDate.message}</div>
                ) : null}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium">Hình ảnh đính kèm (nếu có)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    form.setValue("imageFile", file, { shouldDirty: true })
                  }}
                />
                {imagePreviewUrl ? (
                  <div className="rounded-md border bg-muted/20 p-2">
                    <img src={imagePreviewUrl} alt="preview" className="max-h-40 w-auto rounded" />
                  </div>
                ) : null}
                {editingId ? (
                  <div className="text-xs text-muted-foreground">Nếu không chọn ảnh mới thì giữ ảnh cũ (nếu có).</div>
                ) : null}
              </div>

              <div className="col-span-1 flex flex-col-reverse gap-2 pt-2 sm:col-span-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  {editingId ? "Lưu" : "Tạo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Home