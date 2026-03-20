// pages/admin/management/social.tsx
"use client";
import { useState, useEffect } from "react";
import {
  Button,
  Input,
  Switch,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
  Chip,
  Spinner,
} from "@heroui/react";
import {
  Plus,
  Trash2,
  GripVertical,
  Save,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import RootLayout from "@/components/RootLayout";
import { useSocialLinks, SocialLink } from "@/hooks/useSocialLinks";
import { getAvailableIcons, iconMap, IconType } from "@/components/SocialIcons";

export default function SocialLinksAdmin() {
  const { data, isLoading, updateSocialLinks } = useSocialLinks();
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [email, setEmail] = useState({ address: "", showInHeader: true });
  const [isSaving, setIsSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // New link form
  const [newLink, setNewLink] = useState<Partial<SocialLink>>({
    name: "",
    url: "",
    icon: "facebook",
    showInHeader: true,
    showInFooter: true,
  });

  useEffect(() => {
    if (data) {
      setLinks(data.links);
      setEmail(data.email);
    }
  }, [data]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(links);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    setLinks(updatedItems);
    setHasChanges(true);
  };

  const handleAddLink = () => {
    if (!newLink.name || !newLink.url) return;

    const link: SocialLink = {
      id: Date.now().toString(),
      name: newLink.name,
      url: newLink.url,
      icon: newLink.icon || "other",
      showInHeader: newLink.showInHeader ?? true,
      showInFooter: newLink.showInFooter ?? true,
      order: links.length + 1,
    };

    setLinks([...links, link]);
    setNewLink({
      name: "",
      url: "",
      icon: "facebook",
      showInHeader: true,
      showInFooter: true,
    });
    setShowAddModal(false);
    setHasChanges(true);
  };

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter((l) => l.id !== id));
    setHasChanges(true);
  };

  const handleUpdateLink = (id: string, updates: Partial<SocialLink>) => {
    setLinks(links.map((l) => (l.id === id ? { ...l, ...updates } : l)));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const success = await updateSocialLinks({ links, email });
    if (success) {
      setHasChanges(false);
    }
    setIsSaving(false);
  };

  const availableIcons = getAvailableIcons();

  if (isLoading) {
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Social Links Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your social media links for header and footer
            </p>
          </div>

          {/* Save Alert */}
          {hasChanges && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span className="text-yellow-800 font-medium">
                  You have unsaved changes
                </span>
              </div>
              <Button
                color="warning"
                onClick={handleSave}
                isLoading={isSaving}
                startContent={<Save className="w-4 h-4" />}
              >
                Save Changes
              </Button>
            </div>
          )}

          {/* Email Settings */}
          <Card className="mb-6 shadow-lg">
            <CardHeader className="border-b">
              <h2 className="text-xl font-semibold">Contact Email</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Email Address"
                  value={email.address}
                  onChange={(e) => {
                    setEmail({ ...email, address: e.target.value });
                    setHasChanges(true);
                  }}
                  placeholder="info@example.com"
                />
                <div className="flex items-center h-full pt-6">
                  <Switch
                    isSelected={email.showInHeader}
                    onValueChange={(checked) => {
                      setEmail({ ...email, showInHeader: checked });
                      setHasChanges(true);
                    }}
                  >
                    Show in Header
                  </Switch>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Social Links List */}
          <Card className="shadow-lg">
            <CardHeader className="border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Social Media Links</h2>
              <Button
                color="primary"
                onClick={() => setShowAddModal(true)}
                startContent={<Plus className="w-4 h-4" />}
                className="bg-yellow-400 text-black"
              >
                Add New Link
              </Button>
            </CardHeader>
            <CardBody>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="social-links">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-3"
                    >
                      {links.map((link, index) => (
                        <Draggable
                          key={link.id}
                          draggableId={link.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`bg-white border rounded-xl p-4 transition-all ${
                                snapshot.isDragging
                                  ? "shadow-xl ring-2 ring-yellow-400"
                                  : "shadow-sm"
                              }`}
                            >
                              <div className="flex items-start gap-4">
                                {/* Drag Handle */}
                                <div
                                  {...provided.dragHandleProps}
                                  className="mt-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
                                >
                                  <GripVertical className="w-5 h-5" />
                                </div>

                                {/* Icon Preview */}
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                                  {iconMap[link.icon as IconType]?.FA ? (
                                    <span>
                                      {(
                                        iconMap[link.icon as IconType].FA as any
                                      )({ size: 24 })}
                                    </span>
                                  ) : (
                                    <span>🔗</span>
                                  )}
                                </div>

                                {/* Link Details */}
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <Input
                                    size="sm"
                                    label="Platform Name"
                                    value={link.name}
                                    onChange={(e) =>
                                      handleUpdateLink(link.id, {
                                        name: e.target.value,
                                      })
                                    }
                                  />
                                  <Input
                                    size="sm"
                                    label="URL"
                                    value={link.url}
                                    onChange={(e) =>
                                      handleUpdateLink(link.id, {
                                        url: e.target.value,
                                      })
                                    }
                                    endContent={
                                      <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <ExternalLink className="w-4 h-4 text-gray-400" />
                                      </a>
                                    }
                                  />
                                </div>

                                {/* Visibility Toggles */}
                                <div className="flex flex-col gap-2 min-w-[120px]">
                                  <Switch
                                    size="sm"
                                    isSelected={link.showInHeader}
                                    onValueChange={(checked) =>
                                      handleUpdateLink(link.id, {
                                        showInHeader: checked,
                                      })
                                    }
                                  >
                                    Header
                                  </Switch>
                                  <Switch
                                    size="sm"
                                    isSelected={link.showInFooter}
                                    onValueChange={(checked) =>
                                      handleUpdateLink(link.id, {
                                        showInFooter: checked,
                                      })
                                    }
                                  >
                                    Footer
                                  </Switch>
                                </div>

                                {/* Delete Button */}
                                <Button
                                  isIconOnly
                                  size="sm"
                                  color="danger"
                                  variant="light"
                                  onClick={() => handleDeleteLink(link.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              {links.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p>No social links added yet.</p>
                  <Button
                    color="primary"
                    variant="light"
                    onClick={() => setShowAddModal(true)}
                    className="mt-4"
                  >
                    Add your first link
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Save Button (bottom) */}
          <div className="mt-8 flex justify-end">
            <Button
              size="lg"
              color="success"
              onClick={handleSave}
              isLoading={isSaving}
              isDisabled={!hasChanges}
              startContent={<Save className="w-5 h-5" />}
            >
              Save All Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Add New Link Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        size="lg"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Add New Social Link</ModalHeader>
              <ModalBody className="space-y-4">
                <Input
                  label="Platform Name"
                  placeholder="e.g., Twitter, YouTube"
                  value={newLink.name}
                  onChange={(e) =>
                    setNewLink({ ...newLink, name: e.target.value })
                  }
                />

                <Input
                  label="URL"
                  placeholder="https://..."
                  value={newLink.url}
                  onChange={(e) =>
                    setNewLink({ ...newLink, url: e.target.value })
                  }
                />

                <Select
                  label="Icon"
                  selectedKeys={[newLink.icon || "other"]}
                  onChange={(e) =>
                    setNewLink({ ...newLink, icon: e.target.value })
                  }
                >
                  {availableIcons.map((icon) => (
                    <SelectItem
                      key={icon.id}
                      value={icon.id}
                      startContent={
                        <span className="text-lg">
                          {/* Render icon preview */}
                          {icon.id === "facebook" && "🔵"}
                          {icon.id === "instagram" && "📷"}
                          {icon.id === "linkedin" && "💼"}
                          {icon.id === "twitter" && "🐦"}
                          {icon.id === "youtube" && "📺"}
                          {icon.id === "tiktok" && "🎵"}
                          {icon.id === "github" && "💻"}
                          {icon.id === "discord" && "💬"}
                          {icon.id === "telegram" && "✈️"}
                          {icon.id === "whatsapp" && "💚"}
                          {icon.id === "email" && "✉️"}
                          {icon.id === "website" && "🌐"}
                          {icon.id === "other" && "🔗"}
                        </span>
                      }
                    >
                      {icon.label}
                    </SelectItem>
                  ))}
                </Select>

                <div className="flex gap-4">
                  <Switch
                    isSelected={newLink.showInHeader}
                    onValueChange={(checked) =>
                      setNewLink({ ...newLink, showInHeader: checked })
                    }
                  >
                    Show in Header
                  </Switch>
                  <Switch
                    isSelected={newLink.showInFooter}
                    onValueChange={(checked) =>
                      setNewLink({ ...newLink, showInFooter: checked })
                    }
                  >
                    Show in Footer
                  </Switch>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleAddLink}
                  isDisabled={!newLink.name || !newLink.url}
                  className="bg-yellow-400 text-black"
                >
                  Add Link
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </RootLayout>
  );
}
