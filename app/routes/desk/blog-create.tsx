import BlogEditor from "~/modules/blog/components/editor";

export default function BlogCreate() {
  return (
    <div className="typeset typeset-docs mx-auto max-w-2xl p-4">
      <h1
        className="before:text-muted-foreground/50 outline-none empty:before:content-[attr(data-placeholder)]"
        contentEditable="plaintext-only"
        suppressContentEditableWarning={true}
        data-placeholder="Title"
        onInput={(e) => {
          if (e.currentTarget.textContent === "") {
            e.currentTarget.innerHTML = "";
          }
        }}
      ></h1>
      <BlogEditor />
    </div>
  );
}
