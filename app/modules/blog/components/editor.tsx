import { $generateHtmlFromNodes } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ChevronRightIcon, LoaderIcon, SaveIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { EditorContent } from "~/components/editor/composer";
import { Button } from "~/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field";
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
  useSidebar,
} from "~/components/ui/sidebar";
import type { PostSchema } from "../schemas";
import { generateSlug } from "../services";
import { Textarea } from "~/components/ui/textarea";
import type { ValidationError } from "~/types";
import { toast } from "sonner";
import Cover from "./cover";

function EditorCenterContainer({ children }: { children: React.ReactNode }) {
  const { state, isMobile, toggleSidebar } = useSidebar();
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === "b" &&
        (event.metaKey || event.ctrlKey) &&
        event.altKey
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  const isExpanded = state === "expanded" && !isMobile;
  // Threshold to avoid overlapping with the sidebar (22rem = 352px):
  // 2 * sidebar_width (704px) + editor_max_width (672px) = 1376px
  const canTranslate = windowWidth >= 1376;
  const shouldTranslate = isExpanded && canTranslate;

  return (
    <div
      className="flex justify-center transition-transform duration-200 ease-linear"
      style={{
        transform: shouldTranslate
          ? "translateX(calc(var(--sidebar-width) * -0.5))"
          : "translateX(0)",
      }}
    >
      {children}
    </div>
  );
}

export function EditorSidebar() {
  return <Sidebar></Sidebar>;
}

export function Editor({ initialPost }: { initialPost?: PostSchema }) {
  const [editor] = useLexicalComposerContext();
  const fetcher = useFetcher();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const saving = fetcher.state !== "idle";
  const defaultPost = {
    title: initialPost?.title ?? "",
    slug: initialPost?.slug ?? "",
    content: initialPost?.content ?? null,
    contentHtml: initialPost?.contentHtml ?? "",
    status: initialPost?.status ?? "draft",
    visibility: initialPost?.visibility ?? "private",
    excerpt: initialPost?.excerpt ?? "",
    coverImageUrl: initialPost?.coverImageUrl ?? "",
  };
  const [post, setPost] = useState<PostSchema>(defaultPost);
  const initialFieldErrors = fetcher.data?.errors
    ?.fieldErrors as ValidationError<PostSchema>;
  const [fieldErrors, setFieldErrors] = useState(initialFieldErrors);

  useEffect(() => {
    if (initialPost) {
      setPost(initialPost ?? defaultPost);
    }
  }, [initialPost]);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.textContent = initialPost?.title ?? "";
    }
  }, [initialPost?.title]);

  useEffect(() => {
    if (initialPost?.content) {
      try {
        const editorState = editor.parseEditorState(initialPost.content);
        editor.setEditorState(editorState);
      } catch (e) {
        console.error("Failed to parse editor state:", e);
      }
    } else {
      // Clear editor state for new post
      editor.update(() => {
        const root = editor.getEditorState()._nodeMap.get("root");
        // Or simpler, set an empty editor state if needed
      });
    }
  }, [editor, initialPost?.content]);

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
        const content = editorState.toJSON();
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
    fetcher.submit(payload as any, {
      method: "POST",
      encType: "application/json",
    });
  };

  const handleBlur = (field: keyof PostSchema) => {
    setFieldErrors((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: undefined };
    });
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "22rem",
        } as React.CSSProperties
      }
    >
      <Sidebar>
        <SidebarContent>
          <Collapsible defaultOpen={true} className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel
                className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
                asChild
              >
                <CollapsibleTrigger>
                  METADATA{" "}
                  <ChevronRightIcon className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <FieldGroup className="gap-3 ps-4">
                    <Field className="gap-0.5">
                      <FieldLabel className="text-xs">Cover Image</FieldLabel>
                      <Cover />
                    </Field>
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
                        defaultValue={post.slug}
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
                        defaultValue={post.visibility}
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
        <EditorCenterContainer>
          <div className="max-w-2xl grow px-2 py-4">
            <div className="typeset typeset-docs mb-4">
              <h1
                ref={titleRef}
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
        </EditorCenterContainer>
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
