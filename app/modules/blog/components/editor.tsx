import { $generateHtmlFromNodes } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LoaderIcon, SaveIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { EditorContent } from "~/components/editor/composer";
import { Button } from "~/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import type { PostSchema } from "../schemas";
import { generateSlug } from "../services";
import { Textarea } from "~/components/ui/textarea";
import type { ValidationError } from "~/types";
import { toast } from "sonner";

export function EditorSidebar() {
  return <Sidebar></Sidebar>;
}

export function Editor() {
  const [editor] = useLexicalComposerContext();
  const fetcher = useFetcher();
  const saving = fetcher.state !== "idle";
  const [post, setPost] = useState<PostSchema>({
    title: "",
    slug: "",
    content: "",
    contentHtml: "",
    status: "draft",
    visibility: "private",
    excerpt: "",
    coverImageUrl: "",
  });
  const initialFieldErrors = fetcher.data?.errors
    .fieldErrors as ValidationError<PostSchema>;
  const [fieldErrors, setFieldErrors] = useState(initialFieldErrors);

  useEffect(() => {
    setFieldErrors(initialFieldErrors);
    if (initialFieldErrors) {
      Object.values(initialFieldErrors).forEach((errors) => {
        errors?.forEach((error) => {
          toast.error(error.message);
        });
      });
    }
  }, [initialFieldErrors]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const content = JSON.stringify(editorState.toJSON());
        const contentHtml = $generateHtmlFromNodes(editor);
        setPost((prev) => ({ ...prev, content, contentHtml }));
      });
    });
  }, [editor]);

  const handleSave = () => {
    let payload = post;
    if (!post.slug || post.slug === "") {
      const generatedSlug = generateSlug(post.title);
      payload = { ...post, slug: generatedSlug };
      setPost(payload);
    }
    fetcher.submit(payload, {
      action: "/desk/blog/new",
      method: "POST",
    });
  };

  const handleBlur = (field: keyof PostSchema) => {
    setFieldErrors((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: undefined };
    });
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <Collapsible defaultOpen={true}>
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger>METADATA</CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <FieldGroup className="gap-3 ps-4">
                    <Field
                      className="gap-0.5"
                      data-invalid={!!fieldErrors?.excerpt}
                    >
                      <FieldLabel className="text-xs">Excerpt</FieldLabel>
                      <Textarea
                        placeholder="Input some description here..."
                        value={post.excerpt ?? ""}
                        onChange={(e) =>
                          setPost((prev) => ({
                            ...prev,
                            excerpt: e.target.value,
                          }))
                        }
                        aria-invalid={!!fieldErrors?.excerpt}
                        onBlur={() => handleBlur("excerpt")}
                      ></Textarea>
                    </Field>
                    <Field
                      className="gap-0.5"
                      data-invalid={!!fieldErrors?.slug}
                    >
                      <FieldLabel className="text-xs">Slug</FieldLabel>
                      <Input
                        type="text"
                        placeholder={
                          post.title
                            ? generateSlug(post.title)
                            : "Input some description here..."
                        }
                        value={post.slug}
                        onChange={(e) =>
                          setPost((prev) => ({ ...prev, slug: e.target.value }))
                        }
                        aria-invalid={!!fieldErrors?.slug}
                        onBlur={() => handleBlur("slug")}
                      />
                    </Field>
                    <Field
                      className="gap-0.5"
                      data-invalid={!!fieldErrors?.visibility}
                    >
                      <FieldLabel className="text-xs">Visibility</FieldLabel>
                      <Select
                        value={post.visibility}
                        onValueChange={(value) => {
                          setPost((prev) => ({ ...prev, visibility: value }));
                          handleBlur("visibility");
                        }}
                      >
                        <SelectTrigger
                          className="w-full"
                          aria-invalid={!!fieldErrors?.visibility}
                        >
                          <SelectValue placeholder="Select Visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="unlisted">Unlisted</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </FieldGroup>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <main className="flex justify-center">
          <div className="max-w-2xl grow px-2 py-4">
            <div className="typeset typeset-docs mb-4">
              <h1
                className="before:text-muted-foreground/50 outline-none empty:before:content-[attr(data-placeholder)]"
                contentEditable="plaintext-only"
                suppressContentEditableWarning={true}
                data-placeholder="Title"
                onInput={(e) => {
                  const text = e.currentTarget.textContent || "";
                  if (text === "") {
                    e.currentTarget.innerHTML = "";
                  }
                  setPost((prev) => ({ ...prev, title: text }));
                }}
              ></h1>
            </div>
            <EditorContent
              className="typeset typeset-docs"
              placeholder="Write your article here..."
            />
          </div>
        </main>
      </SidebarInset>
      <div className="fixed right-0 bottom-0 left-0 z-1">
        <div className="flex justify-center p-1">
          <div className="bg-primary-foreground flex gap-2 rounded border p-0.5 px-2 shadow">
            <SidebarTrigger />
            <Separator orientation="vertical" />
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleSave}
              disabled={saving}
              title={saving ? "Saving..." : "Save"}
            >
              {saving ? <LoaderIcon className="animate-spin" /> : <SaveIcon />}
            </Button>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
