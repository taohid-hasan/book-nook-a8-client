"use client";

import { useId, useRef, useState } from "react";
import {
  BookPlusIcon,
  ChevronDownIcon,
  LinkIcon,
  UploadCloudIcon,
} from "lucide-react";
import { toast } from "sonner";

import { BookCover } from "@/components/shared/book-cover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { uploadImage, uploadIsConfigured } from "@/lib/imgbb";
import { cn } from "@/lib/utils";
import {
  BOOK_CATEGORIES,
  type BookCategory,
  type BookInput,
} from "@/types/book";

interface BookFormProps {
  initialValues?: Partial<BookInput>;
  submitLabel: string;
  submittingLabel?: string;
  onSubmit: (values: BookInput) => Promise<void>;
  onCancel?: () => void;
}

type FieldErrors = Partial<Record<keyof BookInput, string>>;

const HTTP_URL_PATTERN = /^https?:\/\/\S+$/i;
const SCHEME_ERROR = "Start the cover link with http:// or https://.";
const DIRECT_IMAGE_ERROR =
  "This link is not a direct image. Paste an image link (right-click the image, Copy image address) or use Upload cover.";

type ImageStatus = "empty" | "loading" | "valid" | "invalid";

function initialImageStatus(image: string | undefined): ImageStatus {
  const value = image?.trim() ?? "";
  if (!value) return "empty";
  return HTTP_URL_PATTERN.test(value) ? "loading" : "invalid";
}

const emptyValues: BookInput = {
  title: "",
  author: "",
  category: "Fiction",
  image: "",
  description: "",
  totalCopies: 1,
};

function logFormError(error: unknown) {
  if (process.env.NODE_ENV === "development") {
    console.error("[book-form] save failed", error);
  }
}

export function BookForm({
  initialValues,
  submitLabel,
  submittingLabel = "Saving…",
  onSubmit,
  onCancel,
}: BookFormProps) {
  const id = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const configured = uploadIsConfigured();

  const [values, setValues] = useState<BookInput>({
    ...emptyValues,
    ...initialValues,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageStatus, setImageStatus] = useState<ImageStatus>(() =>
    initialImageStatus(initialValues?.image),
  );
  const [imageError, setImageError] = useState<string | null>(() => {
    const image = initialValues?.image?.trim() ?? "";
    return image && !HTTP_URL_PATTERN.test(image) ? SCHEME_ERROR : null;
  });

  function update<K extends keyof BookInput>(key: K, value: BookInput[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));

    if (key === "image") {
      const image = String(value).trim();
      if (!image) {
        setImageStatus("empty");
        setImageError(null);
      } else if (!HTTP_URL_PATTERN.test(image)) {
        setImageStatus("invalid");
        setImageError(SCHEME_ERROR);
      } else {
        setImageStatus("loading");
        setImageError(null);
      }
    }
  }

  function validate(): FieldErrors {
    const next: FieldErrors = {};

    if (values.title.trim().length < 2) {
      next.title = "Give the book a title of at least two characters.";
    }
    if (values.author.trim().length < 2) {
      next.author = "Who wrote it? Add the author's name.";
    }
    if (!BOOK_CATEGORIES.includes(values.category)) {
      next.category = "Choose one of the five shelves.";
    }
    if (!Number.isFinite(values.totalCopies) || values.totalCopies < 1) {
      next.totalCopies = "There must be at least one copy on the shelf.";
    } else if (values.totalCopies > 99) {
      next.totalCopies = "Keep it under 100 copies, please.";
    }
    if (values.description.length > 1200) {
      next.description = "Keep the description under 1,200 characters.";
    }

    const image = values.image.trim();
    if (!image) {
      next.image = "Add a cover image so readers can spot the book on the shelf.";
    } else if (!HTTP_URL_PATTERN.test(image)) {
      next.image = SCHEME_ERROR;
    } else if (imageStatus !== "valid") {
      next.image = DIRECT_IMAGE_ERROR;
    }

    return next;
  }

  async function handleFile(file: File | undefined) {
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file);
      update("image", url);
      toast.success("Cover uploaded", {
        description: "The image is hosted and ready for the shelf.",
      });
    } catch (error) {
      toast.error("The cover couldn't be uploaded", {
        description:
          error instanceof Error
            ? error.message
            : "Try a different image or paste an image URL.",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("A few fields need attention", {
        description: "Check the highlighted fields and try again.",
      });
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        title: values.title.trim(),
        author: values.author.trim(),
        category: values.category,
        image: values.image.trim(),
        description: values.description.trim(),
        totalCopies: Number(values.totalCopies),
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "The book couldn't be saved. Try again in a moment.";
      logFormError(error);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  const busy = submitting || uploading;
  const previewSrc = values.image.trim();
  const previewIsHttp = HTTP_URL_PATTERN.test(previewSrc);

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="grid gap-6 sm:grid-cols-[170px_1fr]">
        <div className="space-y-2">
          <Label htmlFor={`${id}-cover`}>Cover</Label>
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-border bg-secondary cover-shadow">
            <BookCover
              key={previewSrc}
              src={previewIsHttp ? previewSrc : ""}
              title={values.title.trim() || "Your book"}
              className="h-full w-full"
              imageClassName={cn(imageStatus === "loading" && "opacity-70")}
              titleClassName="text-sm"
              loading="eager"
              onLoad={() => {
                setImageStatus("valid");
                setImageError(null);
              }}
              onError={() => {
                setImageStatus("invalid");
                setImageError(DIRECT_IMAGE_ERROR);
              }}
            />
            {previewIsHttp && imageStatus === "loading" ? (
              <div className="absolute inset-0 flex items-center justify-center bg-background/35">
                <Spinner className="size-5 text-accent" />
              </div>
            ) : null}
            {uploading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/75 text-xs font-medium backdrop-blur-sm">
                <Spinner className="size-5 text-accent" />
                Uploading…
              </div>
            ) : null}
          </div>

          <input
            ref={fileInputRef}
            id={`${id}-cover`}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            disabled={!configured}
            onChange={(event) => void handleFile(event.target.files?.[0])}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            disabled={busy || !configured}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloudIcon aria-hidden />
            Upload cover
          </Button>
          {!configured ? (
            <p className="text-[0.65rem] leading-relaxed text-muted-foreground">
              Imgbb is not configured. Add{" "}
              <code className="font-mono text-foreground">NEXT_PUBLIC_IMGBB_KEY</code>{" "}
              to enable uploads, or paste a URL below.
            </p>
          ) : (
            <p className="text-[0.65rem] leading-relaxed text-muted-foreground">
              JPG, PNG, WebP, or GIF · up to 5 MB.
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`${id}-title`}>Title</Label>
            <Input
              id={`${id}-title`}
              value={values.title}
              onChange={(event) => update("title", event.target.value)}
              placeholder="The Left Hand of Darkness"
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? `${id}-title-error` : undefined}
              className="h-11 rounded-xl bg-background"
            />
            {errors.title ? (
              <p id={`${id}-title-error`} className="text-xs text-destructive" role="alert">
                {errors.title}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${id}-author`}>Author</Label>
            <Input
              id={`${id}-author`}
              value={values.author}
              onChange={(event) => update("author", event.target.value)}
              placeholder="Ursula K. Le Guin"
              aria-invalid={Boolean(errors.author)}
              aria-describedby={errors.author ? `${id}-author-error` : undefined}
              className="h-11 rounded-xl bg-background"
            />
            {errors.author ? (
              <p id={`${id}-author-error`} className="text-xs text-destructive" role="alert">
                {errors.author}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`${id}-category`}>Shelf</Label>
              <div className="relative">
                <select
                  id={`${id}-category`}
                  value={values.category}
                  onChange={(event) =>
                    update("category", event.target.value as BookCategory)
                  }
                  aria-invalid={Boolean(errors.category)}
                  className="h-11 w-full appearance-none rounded-xl border border-input bg-background px-3 pr-9 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
                >
                  {BOOK_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon
                  className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
              </div>
              {errors.category ? (
                <p className="text-xs text-destructive" role="alert">
                  {errors.category}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${id}-copies`}>Copies</Label>
              <Input
                id={`${id}-copies`}
                type="number"
                min={1}
                max={99}
                inputMode="numeric"
                value={values.totalCopies}
                onChange={(event) => update("totalCopies", Number(event.target.value))}
                aria-invalid={Boolean(errors.totalCopies)}
                aria-describedby={errors.totalCopies ? `${id}-copies-error` : undefined}
                className="h-11 rounded-xl bg-background"
              />
              {errors.totalCopies ? (
                <p id={`${id}-copies-error`} className="text-xs text-destructive" role="alert">
                  {errors.totalCopies}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${id}-image`} className="gap-1.5">
              <LinkIcon className="size-3.5 text-muted-foreground" aria-hidden />
              Cover image URL
            </Label>
            <Input
              id={`${id}-image`}
              type="url"
              value={values.image}
              onChange={(event) => update("image", event.target.value)}
              placeholder="https://i.ibb.co/…"
              aria-invalid={Boolean(imageError || errors.image)}
              aria-describedby={
                imageError || errors.image
                  ? `${id}-image-error`
                  : `${id}-image-help`
              }
              className={cn(
                "h-11 rounded-xl bg-background",
                (imageError || errors.image) && "border-destructive",
              )}
            />
            {imageError ? (
              <p
                id={`${id}-image-error`}
                className="text-xs text-destructive"
                role="alert"
              >
                {imageError}
              </p>
            ) : errors.image ? (
              <p
                id={`${id}-image-error`}
                className="text-xs text-destructive"
                role="alert"
              >
                {errors.image}
              </p>
            ) : (
              <p
                id={`${id}-image-help`}
                className="text-[0.65rem] leading-relaxed text-muted-foreground"
              >
                Paste a direct image link. We load a preview to confirm it works
                before saving.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${id}-description`}>Description</Label>
        <Textarea
          id={`${id}-description`}
          value={values.description}
          onChange={(event) => update("description", event.target.value)}
          placeholder="What is this book about, and why should the next reader pick it up?"
          rows={4}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={
            errors.description ? `${id}-description-error` : `${id}-description-count`
          }
          className={cn("min-h-28 rounded-xl bg-background")}
        />
        <div className="flex items-center justify-between gap-3">
          {errors.description ? (
            <p id={`${id}-description-error`} className="text-xs text-destructive" role="alert">
              {errors.description}
            </p>
          ) : (
            <span />
          )}
          <span id={`${id}-description-count`} className="text-[0.65rem] text-muted-foreground">
            {values.description.length}/1200
          </span>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-border/70 pt-5 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" disabled={busy} className="min-w-36">
          {submitting ? (
            <>
              <Spinner className="size-4" />
              {submittingLabel}
            </>
          ) : (
            <>
              <BookPlusIcon aria-hidden />
              {submitLabel}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
