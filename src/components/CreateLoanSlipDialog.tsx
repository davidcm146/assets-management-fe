"use client";

import React from "react"

import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon, ImagePlus, Loader2, X } from "lucide-react";
import { format } from "date-fns";
import {
    createLoanSlipSchema,
    type CreateLoanSlipFormValues,
} from "@/features/loan-slips/loan-slip.schema";

interface CreateLoanSlipDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: CreateLoanSlipFormValues) => Promise<void>;
}

function RequiredMark() {
    return <span className="text-destructive ml-0.5">*</span>;
}

export function CreateLoanSlipDialog({
    open,
    onOpenChange,
    onSubmit,
}: CreateLoanSlipDialogProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const form = useForm<CreateLoanSlipFormValues>({
        resolver: zodResolver(createLoanSlipSchema),
        defaultValues: {
            name: "",
            borrower_name: "",
            department: "",
            position: "",
            description: "",
            serial_number: "",
            borrowed_date: new Date(),
            returned_date: new Date(),
            images: []
        },
    });

    const { isSubmitting } = form.formState;
    const currentImages = form.watch("images");

    const handleClose = (isOpen: boolean) => {
        if (!isOpen) {
            form.reset();
            setImagePreviews([]);
        }
        onOpenChange(isOpen);
    };

    const handleFormSubmit = async (
        values: CreateLoanSlipFormValues
    ) => {
        await onSubmit(values);

        form.reset();
        setImagePreviews([]);
        onOpenChange(false);
    };


    const handleImageAdd = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (!files) return;

            const current = form.getValues("images") ?? [];
            const remaining = 5 - current.length;
            const newFiles = Array.from(files).slice(0, remaining);

            if (newFiles.length === 0) return;

            const updatedFiles = [...current, ...newFiles];
            form.setValue("images", updatedFiles, { shouldValidate: true });

            for (const file of newFiles) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    setImagePreviews((prev) => [
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

    const handleImageRemove = useCallback(
        (index: number) => {
            const current = form.getValues("images") ?? [];
            const updatedFiles = current.filter((_, i) => i !== index);
            form.setValue("images", updatedFiles, { shouldValidate: true });
            setImagePreviews((prev) => prev.filter((_, i) => i !== index));
        },
        [form]
    );

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Tạo phiếu mượn mới</DialogTitle>
                    <DialogDescription>
                        Điền thông tin để tạo phiếu mượn tài sản. Các trường có dấu {" "}
                        <span className="text-destructive">*</span> là bắt buộc.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleFormSubmit)}
                        className="grid gap-4 py-4"
                    >
                        {/* Ten tai san */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Ten tai san
                                        <RequiredMark />
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
                        />

                        {/* Two columns: Borrower Name + Department */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="borrower_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Tên nhà thầu
                                            <RequiredMark />
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
                            />

                            <FormField
                                control={form.control}
                                name="department"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phong ban</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nhập phong ban..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Two columns: Position + Serial Number */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField
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
                            />

                            <FormField
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
                            />
                        </div>

                        {/* Two columns: Borrowed Date + Returned Date */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="borrowed_date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>
                                            Ngày mượn
                                            <RequiredMark />
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
                                            <RequiredMark />
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
                        <FormField
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
                        />

                        {/* Images upload */}
                        <FormField
                            control={form.control}
                            name="images"
                            render={() => (
                                <FormItem>
                                    <FormLabel>
                                        Hình ảnh{" "}
                                        <span className="text-muted-foreground font-normal">
                                            (Tối đa 5)
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <div className="space-y-3">
                                            {/* Preview grid */}
                                            {imagePreviews.length > 0 && (
                                                <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                                                    {imagePreviews.map((preview, index) => (
                                                        <div
                                                            key={`${preview.slice(0, 20)}-${index}`}
                                                            className="group relative aspect-square overflow-hidden rounded-lg border border-border"
                                                        >
                                                            <img
                                                                src={preview || "/placeholder.svg"}
                                                                alt={`Hình ảnh ${index + 1}`}
                                                                className="h-full w-full object-cover"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => handleImageRemove(index)}
                                                                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                                                                aria-label={`Xóa hình ảnh ${index + 1}`}
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Upload button */}
                                            {(currentImages?.length ?? 0) < 5 && (
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 px-4 py-6 text-sm text-muted-foreground transition-colors hover:border-muted-foreground/50 hover:text-foreground"
                                                >
                                                    <ImagePlus className="h-5 w-5" />
                                                    <span>
                                                        Thêm hình ảnh ({currentImages?.length ?? 0}
                                                        /5)
                                                    </span>
                                                </button>
                                            )}

                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                                multiple
                                                className="hidden"
                                                onChange={handleImageAdd}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                                Tạo phiếu mượn
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
