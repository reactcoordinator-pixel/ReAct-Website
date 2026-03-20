"use client";
import { useState, useEffect } from "react";
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardBody,
  Switch,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Progress,
} from "@heroui/react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import RootLayout from "@/components/RootLayout";
import { useNavigation, NavLink, NavigationData } from "@/hooks/useNavigation";
import Image from "next/image";
import { AlertCircle, GripVertical, Plus, Save, Trash2 } from "lucide-react";

export default function NavigationAdmin() {
  const { data, isLoading, updateNavigation } = useNavigation();
  const [local, setLocal] = useState<NavigationData | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  // Logo upload modal state
  const [logoModalOpen, setLogoModalOpen] = useState(false);
  const [tempLogo, setTempLogo] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Add link modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addSection, setAddSection] = useState<
    "navigation" | "quick" | "support" | "bottom"
  >("navigation");
  const [newLink, setNewLink] = useState({ label: "", href: "" });

  useEffect(() => {
    if (data) {
      setLocal(data);
      setTempLogo(data.logo);
    }
  }, [data]);

  const handleSave = async () => {
    if (!local) return;
    setSaving(true);
    const success = await updateNavigation(local);
    if (success) setHasChanges(false);
    setSaving(false);
  };

  const updateLocal = (updates: Partial<NavigationData>) => {
    if (!local) return;
    setLocal({ ...local, ...updates });
    setHasChanges(true);
  };

  const updateLinks = (
    section: keyof Pick<
      NavigationData,
      | "navigationLinks"
      | "footerQuickLinks"
      | "footerSupportLinks"
      | "footerBottomLinks"
    >,
    newLinks: NavLink[],
  ) => {
    updateLocal({ [section]: newLinks });
  };

  const addNewLink = () => {
    if (!newLink.label || !newLink.href || !local) return;
    const link: NavLink = {
      label: newLink.label,
      href: newLink.href,
      visible: true,
    };
    let updated: NavLink[];
    switch (addSection) {
      case "navigation":
        updated = [
          ...local.navigationLinks,
          { ...link, order: local.navigationLinks.length + 1 },
        ];
        break;
      case "quick":
        updated = [...local.footerQuickLinks, link];
        break;
      case "support":
        updated = [...local.footerSupportLinks, link];
        break;
      case "bottom":
        updated = [...local.footerBottomLinks, link];
        break;
    }
    updateLinks(
      addSection === "navigation"
        ? "navigationLinks"
        : (`footer${addSection.charAt(0).toUpperCase() + addSection.slice(1)}Links` as any),
      updated,
    );
    setNewLink({ label: "", href: "" });
    setAddModalOpen(false);
  };

  const deleteLink = (
    section: keyof Pick<
      NavigationData,
      | "navigationLinks"
      | "footerQuickLinks"
      | "footerSupportLinks"
      | "footerBottomLinks"
    >,
    index: number,
  ) => {
    const current = local![section] as NavLink[];
    updateLinks(
      section,
      current.filter((_, i) => i !== index),
    );
  };

  const toggleVisible = (
    section: keyof Pick<
      NavigationData,
      | "navigationLinks"
      | "footerQuickLinks"
      | "footerSupportLinks"
      | "footerBottomLinks"
    >,
    index: number,
  ) => {
    const current = local![section] as NavLink[];
    const updated = current.map((l, i) =>
      i === index ? { ...l, visible: !l.visible } : l,
    );
    updateLinks(section, updated);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination || !local) return;
    const items = Array.from(local.navigationLinks);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    const reordered = items.map((item, idx) => ({ ...item, order: idx + 1 }));
    updateLocal({ navigationLinks: reordered });
  };

  // Upload logic (reused from your EditableImage)
  const compressImage = async (file: File): Promise<File> => {
    // Simplified version – you can paste your full smartCompress from EditableImage here
    return file; // Replace with your full compression if desired
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const compressed = await compressImage(file);
      const form = new FormData();
      form.append("image", compressed);
      const res = await fetch(
        "https://www.uploads.reactmalaysia.org/api/upload-image.php",
        {
          method: "POST",
          body: form,
        },
      );
      const json = await res.json();
      if (!res.ok || !json.success)
        throw new Error(json.error || "Upload failed");
      setTempLogo(json.url);
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const saveLogo = () => {
    updateLocal({ logo: tempLogo });
    setLogoModalOpen(false);
  };

  if (isLoading || !local) {
    return (
      <RootLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Spinner size="lg" color="warning" />
        </div>
      </RootLayout>
    );
  }

  return (
    <RootLayout>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">
            Navigation & Footer Management
          </h1>
          <p className="text-gray-600 mb-8">
            Update logo, menu links, footer sections and copyright text.
          </p>

          {hasChanges && (
            <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 mb-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span className="font-medium">Unsaved changes</span>
              </div>
              <Button
                color="warning"
                onClick={handleSave}
                isLoading={saving}
                startContent={<Save className="w-4 h-4" />}
              >
                Save All
              </Button>
            </div>
          )}

          {/* Logo */}
          <Card className="mb-8">
            <CardHeader>Site Logo</CardHeader>
            <CardBody className="flex items-center gap-8">
              <div className="relative w-48 h-32 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={local.logo}
                  alt="Logo preview"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              <Button onClick={() => setLogoModalOpen(true)}>
                Change Logo
              </Button>
            </CardBody>
          </Card>

          {/* Main Navigation */}
          <Card className="mb-8">
            <CardHeader className="flex justify-between">
              <span>Main Navigation (reorderable)</span>
              <Button
                size="sm"
                onClick={() => {
                  setAddSection("navigation");
                  setAddModalOpen(true);
                }}
                startContent={<Plus />}
              >
                Add Link
              </Button>
            </CardHeader>
            <CardBody>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="nav">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {local.navigationLinks.map((link, i) => (
                        <Draggable key={i} draggableId={`nav-${i}`} index={i}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="flex items-center gap-4 mb-3 bg-white p-4 rounded-lg border"
                            >
                              <div {...provided.dragHandleProps}>
                                <GripVertical />
                              </div>
                              <Input
                                size="sm"
                                value={link.label}
                                onChange={(e) => {
                                  const updated = [...local.navigationLinks];
                                  updated[i].label = e.target.value;
                                  updateLocal({ navigationLinks: updated });
                                }}
                              />
                              <Input
                                size="sm"
                                value={link.href}
                                onChange={(e) => {
                                  const updated = [...local.navigationLinks];
                                  updated[i].href = e.target.value;
                                  updateLocal({ navigationLinks: updated });
                                }}
                              />
                              <Switch
                                isSelected={link.visible}
                                onValueChange={() =>
                                  toggleVisible("navigationLinks", i)
                                }
                              />
                              <Button
                                isIconOnly
                                color="danger"
                                size="sm"
                                onClick={() => deleteLink("navigationLinks", i)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </CardBody>
          </Card>

          {/* Footer sections (similar pattern – repeat for quick/support/bottom) */}
          {/* Example for Quick Links – duplicate for others */}
          <Card className="mb-8">
            <CardHeader className="flex justify-between">
              <span>Footer Quick Links</span>
              <Button
                size="sm"
                onClick={() => {
                  setAddSection("quick");
                  setAddModalOpen(true);
                }}
                startContent={<Plus />}
              >
                Add
              </Button>
            </CardHeader>
            <CardBody>
              {local.footerQuickLinks.map((link, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 mb-3 bg-white p-4 rounded-lg border"
                >
                  <Input
                    size="sm"
                    value={link.label}
                    onChange={(e) => {
                      const updated = [...local.footerQuickLinks];
                      updated[i].label = e.target.value;
                      updateLocal({ footerQuickLinks: updated });
                    }}
                  />
                  <Input
                    size="sm"
                    value={link.href}
                    onChange={(e) => {
                      const updated = [...local.footerQuickLinks];
                      updated[i].href = e.target.value;
                      updateLocal({ footerQuickLinks: updated });
                    }}
                  />
                  <Switch
                    isSelected={link.visible}
                    onValueChange={() => toggleVisible("footerQuickLinks", i)}
                  />
                  <Button
                    isIconOnly
                    color="danger"
                    size="sm"
                    onClick={() => deleteLink("footerQuickLinks", i)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
            </CardBody>
          </Card>

          {/* Repeat the above Card for footerSupportLinks and footerBottomLinks */}

          {/* Copyright */}
          <Card className="mb-8">
            <CardHeader>Copyright Text</CardHeader>
            <CardBody>
              <Input
                value={local.copyright}
                onChange={(e) => updateLocal({ copyright: e.target.value })}
              />
            </CardBody>
          </Card>

          <div className="flex justify-end">
            <Button
              size="lg"
              color="success"
              onClick={handleSave}
              isLoading={saving}
              isDisabled={!hasChanges}
            >
              Save All Changes
            </Button>
          </div>
        </div>

        {/* Logo upload modal */}
        <Modal isOpen={logoModalOpen} onClose={() => setLogoModalOpen(false)}>
          <ModalContent>
            <ModalHeader>Upload New Logo</ModalHeader>
            <ModalBody>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={uploading}
              />
              {uploading && <Progress value={uploadProgress} />}
              {uploadError && <div className="text-red-600">{uploadError}</div>}
              {tempLogo && (
                <Image
                  src={tempLogo}
                  alt="preview"
                  width={300}
                  height={150}
                  className="mt-4"
                />
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={() => setLogoModalOpen(false)}>
                Cancel
              </Button>
              <Button
                color="success"
                onPress={saveLogo}
                disabled={uploading || tempLogo === local.logo}
              >
                Use This Logo
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Add link modal */}
        <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)}>
          <ModalContent>
            <ModalHeader>Add New Link</ModalHeader>
            <ModalBody>
              <Input
                label="Label"
                value={newLink.label}
                onChange={(e) =>
                  setNewLink({ ...newLink, label: e.target.value })
                }
              />
              <Input
                label="URL (href)"
                value={newLink.href}
                onChange={(e) =>
                  setNewLink({ ...newLink, href: e.target.value })
                }
                className="mt-4"
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={() => setAddModalOpen(false)}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={addNewLink}
                disabled={!newLink.label || !newLink.href}
              >
                Add
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </RootLayout>
  );
}
