"use client";

import React from "react";

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn, mapStatusToNumber } from "@/lib/utils";
import { CalendarIcon, ImagePlus, Loader2, X } from "lucide-react";
import { format } from "date-fns";
import {
    updateLoanSlipSchema,
    type UpdateLoanSlipFormValues,
} from "@/features/loan-slips/update-loan-slip.schema";
import { LOAN_STATUS, type LoanSlip } from "@/types/loan-slip";
import { handleApiError } from "@/api/error-handler";

interface UpdateLoanSlipDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: UpdateLoanSlipFormValues) => Promise<void>;
    loanSlip: LoanSlip | null
    role: string | undefined
}

function parseDate(value: string | Date): Date {
    if (value instanceof Date) return value;
    const parts = value.split("-");
    if (parts.length === 3 && parts[0].length <= 2) {
        return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
    }
    return new Date(value);
}

export function UpdateLoanSlipDialog({
    open,
    onOpenChange,
    onSubmit,
    loanSlip,
    role,
}: UpdateLoanSlipDialogProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
    const isAdmin = role === "admin"
    const isIT = role === "IT"

    const form = useForm<UpdateLoanSlipFormValues>({
        resolver: zodResolver(updateLoanSlipSchema),
        defaultValues: {
            name: "",
            borrower_name: "",
            department: "",
            position: "",
            description: "",
            serial_number: "",
            status: 1,
            borrowed_date: new Date(),
            returned_date: new Date(),
            existing_images: [],
            new_images: [],
        },
    });

    const { isSubmitting } = form.formState;
    const existingImages = form.watch("existing_images");
    const newImages = form.watch("new_images");
    const totalImages = (existingImages?.length ?? 0) + (newImages?.length ?? 0);

    useEffect(() => {
        if (loanSlip && open) {
            form.reset({
                name: loanSlip.name,
                borrower_name: loanSlip.borrower_name,
                department: loanSlip.department ?? "",
                position: loanSlip.position ?? "",
                description: loanSlip.description ?? "",
                serial_number: loanSlip.serial_number ?? "",
                status: mapStatusToNumber(loanSlip.status),
                borrowed_date: parseDate(loanSlip.borrowed_date || ""),
                returned_date: parseDate(loanSlip.returned_date || ""),
                existing_images: loanSlip.images ?? [],
                new_images: [],
            });
            setNewImagePreviews([]);
        }
    }, [loanSlip, open, form]);

    const handleClose = (isOpen: boolean) => {
        if (!isOpen) {
            form.reset();
            setNewImagePreviews([]);
        }
        onOpenChange(isOpen);
    };

    const handleFormSubmit = async (values: UpdateLoanSlipFormValues) => {
        try {
            let payload = values;
    
            if (isAdmin) {
                payload = {
                    status: values.status,
                    borrowed_date: values.borrowed_date,
                    returned_date: values.returned_date,
                };
            }
    
            await onSubmit(payload);
            form.reset();
            onOpenChange(false);
        } catch (error: any) {
            const apiError = error

            handleApiError(apiError.response.data)
        }
    };


    const handleImageAdd = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (!files) return;

            const currentExisting = form.getValues("existing_images") ?? [];
            const currentNew = form.getValues("new_images") ?? [];
            const remaining = 5 - currentExisting.length - currentNew.length;
            const newFiles = Array.from(files).slice(0, remaining);

            if (newFiles.length === 0) return;

            const updatedFiles = [...currentNew, ...newFiles];
            form.setValue("new_images", updatedFiles, { shouldValidate: true });

            for (const file of newFiles) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    setNewImagePreviews((prev) => [
                        ...prev,
                        event.target?.result as string,
                    ]);
                };
                reader.readAsDataURL(file);
            }

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        },
        [form]
    );

    const handleExistingImageRemove = useCallback(
        (index: number) => {
            const current = form.getValues("existing_images") ?? [];
            const updated = current.filter((_, i) => i !== index);
            form.setValue("existing_images", updated, { shouldValidate: true });
        },
        [form]
    );

    const handleNewImageRemove = useCallback(
        (index: number) => {
            const current = form.getValues("new_images") ?? [];
            const updated = current.filter((_, i) => i !== index);
            form.setValue("new_images", updated, { shouldValidate: true });
            setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
        },
        [form]
    );

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Cập nhật phiếu mượn</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleFormSubmit)}
                        className="grid gap-4 py-4"
                    >
                        {/* Ten tai san */}
                        {isIT && <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Tên tài sản
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nhập tên tài sản (3-100 ký tự)..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />}

                        {/* Two columns: Borrower Name + Department */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {isIT && <FormField
                                control={form.control}
                                name="borrower_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Tên nhà thầu
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Nhập tên nhà thầu (3-50 ký tự)..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />}

                            {isIT && <FormField
                                control={form.control}
                                name="department"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phòng ban</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nhập phòng ban..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />}
                        </div>

                        {/* Two columns: Position + Serial Number */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {isIT && <FormField
                                control={form.control}
                                name="position"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Chức vụ</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nhập chức vụ..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />}

                            {isIT && <FormField
                                control={form.control}
                                name="serial_number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Số sê ri</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Nhập số sê ri..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />}
                        </div>

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Trạng thái
                                    </FormLabel>
                                    <Select
                                        onValueChange={(value) =>
                                            field.onChange(Number(value) as 1 | 2)
                                        }
                                        value={String(field.value)}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Chon trang thai" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={String(LOAN_STATUS.BORROWING)}>Đang mượn</SelectItem>
                                            <SelectItem value={String(LOAN_STATUS.RETURNED)}>Đã trả</SelectItem>
                                            <SelectItem value={String(LOAN_STATUS.OVERDUE)}>Quá hạn</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Two columns: Borrowed Date + Returned Date */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="borrowed_date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>
                                            Ngày mượn
                                        </FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full justify-start gap-2 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="h-4 w-4 shrink-0" />
                                                        <span className="truncate">
                                                            {field.value
                                                                ? format(field.value, "dd-MM-yyyy")
                                                                : "Chọn ngày mượn"}
                                                        </span>
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="returned_date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>
                                            Ngày trả
                                        </FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full justify-start gap-2 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="h-4 w-4 shrink-0" />
                                                        <span className="truncate">
                                                            {field.value
                                                                ? format(field.value, "dd-MM-yyyy")
                                                                : "Chọn ngày trả"}
                                                        </span>
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Mo ta */}
                        {isIT && <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mô tả</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Nhập mô tả (10-500 ký tự)..."
                                            rows={3}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />}

                        {/* Images upload */}
                        {isIT && <FormField
                            control={form.control}
                            name="new_images"
                            render={() => {
                                const newImagesError = form.formState.errors.new_images;
                                const existingImagesError = form.formState.errors.existing_images;
                                // Collect all image-related error messages
                                const errorMessages: string[] = [];
                                for (const imagesError of [newImagesError, existingImagesError]) {
                                    if (imagesError) {
                                        if (imagesError.root?.message) {
                                            errorMessages.push(imagesError.root.message);
                                        }
                                        if (imagesError.message) {
                                            errorMessages.push(imagesError.message);
                                        }
                                        if (Array.isArray(imagesError)) {
                                            for (const itemError of imagesError) {
                                                if (itemError?.message) {
                                                    errorMessages.push(itemError.message);
                                                }
                                            }
                                        }
                                    }
                                }
                                const uniqueErrors = [...new Set(errorMessages)];

                                return (
                                <FormItem>
                                    <FormLabel>
                                        Hình ảnh
                                        <span className="text-muted-foreground font-normal">
                                            {" "}(tối đa 5)
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <div className="space-y-3">
                                            {/* Preview grid - existing + new images */}
                                            {((existingImages ?? []).length > 0 || newImagePreviews.length > 0) && (
                                                <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                                                    {/* Existing images from server */}
                                                    {existingImages?.map((url, index) => (
                                                        <div
                                                            key={`existing-${url}-${index}`}
                                                            className="group relative aspect-square overflow-hidden rounded-lg border border-border"
                                                        >
                                                            <img
                                                                src={url || "/placeholder.svg"}
                                                                alt={`Hình ảnh ${index + 1}`}
                                                                className="h-full w-full object-cover"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => handleExistingImageRemove(index)}
                                                                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                                                                aria-label={`Xóa hình ảnh ${index + 1}`}
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                    ))}

                                                    {/* New image previews */}
                                                    {newImagePreviews.map((preview, index) => (
                                                        <div
                                                            key={`new-${preview.slice(0, 20)}-${index}`}
                                                            className="group relative aspect-square overflow-hidden rounded-lg border border-dashed border-primary"
                                                        >
                                                            <img
                                                                src={preview || "/placeholder.svg"}
                                                                alt={`Hinh anh moi ${index + 1}`}
                                                                className="h-full w-full object-cover"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => handleNewImageRemove(index)}
                                                                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                                                                aria-label={`Xóa hình ảnh mới ${index + 1}`}
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Upload button */}
                                            {totalImages < 5 && (
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 px-4 py-6 text-sm text-muted-foreground transition-colors hover:border-muted-foreground/50 hover:text-foreground"
                                                >
                                                    <ImagePlus className="h-5 w-5" />
                                                    <span>
                                                        Thêm hình ảnh ({totalImages}/5)
                                                    </span>
                                                </button>
                                            )}

                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/jpeg,image/jpg,image/png"
                                                multiple
                                                className="hidden"
                                                onChange={handleImageAdd}
                                            />
                                        </div>
                                    </FormControl>
                                    {uniqueErrors.length > 0 && (
                                        <div className="space-y-1">
                                            {uniqueErrors.map((msg) => (
                                                <p
                                                    key={msg}
                                                    className="text-sm font-medium text-destructive"
                                                >
                                                    {msg}
                                                </p>
                                            ))}
                                        </div>
                                    )}
                                </FormItem>
                                );
                            }}
                        />}

                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleClose(false)}
                                disabled={isSubmitting}
                            >
                                Hủy
                            </Button>
                            <Button type="submit" disabled={isSubmitting} className="bg-blue-700 hover:bg-blue-500">
                                {isSubmitting && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Cập nhật
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    );
}
