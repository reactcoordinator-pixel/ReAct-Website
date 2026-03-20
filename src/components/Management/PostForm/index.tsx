"use client";

import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Node, mergeAttributes } from "@tiptap/core";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Spinner,
} from "@heroui/react";
import DropzoneButton from "./Dropzone/index";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Video,
  Undo,
  Redo,
} from "lucide-react";

import { categoryOptions } from "./FormModules";

const CustomIframe = Node.create({
  name: "iframe",
  group: "block",
  atom: true,
  addAttributes() {
    return { src: { default: null } };
  },
  parseHTML() {
    return [{ tag: "iframe" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      { class: "relative pb-[56.25%] h-0 overflow-hidden mt-6 mb-6" },
      [
        "iframe",
        mergeAttributes(HTMLAttributes, {
          frameborder: "0",
          allowfullscreen: "",
          class: "absolute top-0 left-0 w-full h-full rounded-lg",
        }),
      ],
    ];
  },
  addCommands() {
    return {
      setIframe:
        (attributes) =>
        ({ commands }) => {
          return commands.insertContent({
            type: "iframe",
            attrs: attributes,
          });
        },
    };
  },
});

export default function PostForm({
  handleSave,
  props,
}: {
  handleSave: any;
  props: any;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: props?.title || "",
    subtitle: props?.subtitle || "",
    imageUrl: props?.imageUrl || null,
    category: props?.category || "BLOG",
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Write your blog content here..." }),
      CustomIframe,
    ],
    content: props?.about || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none min-h-[500px] p-6",
      },
    },
  });

  const handleImage = (url: string | null) => {
    setFormData({ ...formData, imageUrl: url });
  };

  const setLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl || "");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const insertVideo = () => {
    if (!editor) return;
    const url = window.prompt("Enter video URL (YouTube, Vimeo, etc.)");
    if (url) {
      editor.chain().focus().setIframe({ src: url }).run();
    }
  };

  const handleSaveContent = async () => {
    if (!editor) return;

    const savePromise = handleSave(props?.id, {
      ...formData,
      about: editor.getHTML(),
    });

    toast.promise(savePromise, {
      loading: "Saving post...",
      success: "Post saved successfully!",
      error: "Failed to save post",
    });

    try {
      await savePromise;
      router.back(); // Go back after successful save
    } catch (err) {
      // Error already shown by toast
    }
  };

  if (!editor) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-gray-500">
        <Spinner size="lg" /> Loading editor...
      </div>
    );
  }

  return (
    <section className="w-full py-8">
      <div className="flex flex-col rounded-2xl gap-8 py-8 bg-white shadow-xl">
        <DropzoneButton
          handleImage={handleImage}
          defaultValue={formData.imageUrl}
        />

        <Autocomplete
          label="Select a Category"
          defaultSelectedKey={formData.category}
          onSelectionChange={(key) =>
            setFormData({ ...formData, category: key as string })
          }
          className="max-w-full"
        >
          {categoryOptions.map((cat) => (
            <AutocompleteItem key={cat}>{cat}</AutocompleteItem>
          ))}
        </Autocomplete>

        <Input
          label="Front Title"
          placeholder="Enter front title"
          value={formData.title}
          onValueChange={(value) => setFormData({ ...formData, title: value })}
          isRequired
        />

        <Input
          label="Subtitle"
          placeholder="Enter subtitle"
          value={formData.subtitle}
          onValueChange={(value) =>
            setFormData({ ...formData, subtitle: value })
          }
        />

        {/* Tiptap Editor with HeroUI toolbar */}
        <div className="border border-gray-300 rounded-2xl overflow-hidden shadow-md">
          {/* Toolbar - now using HeroUI Buttons */}
          <div className="bg-gray-50 p-3 border-b border-gray-300 flex items-center gap-2 flex-wrap">
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onPress={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={
                editor.isActive("heading", { level: 1 }) ? "bg-gray-300" : ""
              }
            >
              <Heading1 className="w-5 h-5" />
            </Button>
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onPress={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={
                editor.isActive("heading", { level: 2 }) ? "bg-gray-300" : ""
              }
            >
              <Heading2 className="w-5 h-5" />
            </Button>

            <div className="w-px h-8 bg-gray-300 mx-2" />

            <Button
              isIconOnly
              variant="light"
              size="sm"
              onPress={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive("bold") ? "bg-gray-300" : ""}
            >
              <Bold className="w-5 h-5" />
            </Button>
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onPress={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive("italic") ? "bg-gray-300" : ""}
            >
              <Italic className="w-5 h-5" />
            </Button>
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onPress={() => editor.chain().focus().toggleUnderline().run()}
              className={editor.isActive("underline") ? "bg-gray-300" : ""}
            >
              <UnderlineIcon className="w-5 h-5" />
            </Button>
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onPress={() => editor.chain().focus().toggleStrike().run()}
              className={editor.isActive("strike") ? "bg-gray-300" : ""}
            >
              <Strikethrough className="w-5 h-5" />
            </Button>

            <div className="w-px h-8 bg-gray-300 mx-2" />

            <Button
              isIconOnly
              variant="light"
              size="sm"
              onPress={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive("bulletList") ? "bg-gray-300" : ""}
            >
              <List className="w-5 h-5" />
            </Button>
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onPress={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive("orderedList") ? "bg-gray-300" : ""}
            >
              <ListOrdered className="w-5 h-5" />
            </Button>
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onPress={() => editor.chain().focus().toggleBlockquote().run()}
              className={editor.isActive("blockquote") ? "bg-gray-300" : ""}
            >
              <Quote className="w-5 h-5" />
            </Button>

            <div className="w-px h-8 bg-gray-300 mx-2" />

            <Button isIconOnly variant="light" size="sm" onPress={setLink}>
              <LinkIcon className="w-5 h-5" />
            </Button>
            <Button isIconOnly variant="light" size="sm" onPress={insertVideo}>
              <Video className="w-5 h-5" />
            </Button>

            <div className="w-px h-8 bg-gray-300 mx-2" />

            <Button
              isIconOnly
              variant="light"
              size="sm"
              onPress={() => editor.chain().focus().undo().run()}
              isDisabled={!editor.can().undo()}
            >
              <Undo className="w-5 h-5" />
            </Button>
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onPress={() => editor.chain().focus().redo().run()}
              isDisabled={!editor.can().redo()}
            >
              <Redo className="w-5 h-5" />
            </Button>
          </div>

          <EditorContent editor={editor} />
        </div>

        <Button
          size="lg"
          className="bg-yellow-500 text-black font-bold text-xl py-8 shadow-xl"
          onPress={handleSaveContent}
          isDisabled={!formData.title.trim() || !editor.getHTML().trim()}
        >
          Save Post
        </Button>
      </div>
    </section>
  );
}
