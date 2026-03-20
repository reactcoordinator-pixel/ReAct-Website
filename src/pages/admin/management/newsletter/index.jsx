"use client";
import { useState, useEffect } from "react";
import { getEmails } from "../../../api/functions/get";
import {
  collection,
  doc,
  deleteDoc,
  updateDoc,
  getFirestore,
} from "firebase/firestore";
import { app } from "../../../api/FirebaseConfig";
import emailjs from "emailjs-com";
import SectionHeader from "@/components/Common/SectionHeader";
import {
  Button,
  Textarea,
  Spinner,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
  Tooltip,
} from "@heroui/react";
import { Trash2, Edit, Mail, Users } from "lucide-react";
import RootLayout from "@/components/RootLayout";

const db = getFirestore(app);

export default function AdminPage() {
  const [formData, setFormData] = useState({
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [subscribers, setSubscribers] = useState([]);
  const [loadingSubscribers, setLoadingSubscribers] = useState(true);
  const [editingEmail, setEditingEmail] = useState(null);
  const [newEmail, setNewEmail] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoadingSubscribers(true);
    try {
      const emailsData = await getEmails();
      if (Array.isArray(emailsData)) {
        setSubscribers(emailsData);
      }
    } catch (error) {
      console.error("Error fetching subscribers:", error);
    } finally {
      setLoadingSubscribers(false);
    }
  };

  const sendEmailsToAll = async () => {
    if (!formData.message.trim()) {
      alert("Please enter a message before sending");
      return;
    }

    setLoading(true);
    const emailsData = await getEmails();

    if (Array.isArray(emailsData)) {
      const emails = emailsData.map((obj) => obj.email);
      let successCount = 0;
      let failCount = 0;

      for (const email of emails) {
        try {
          const templateParams = {
            to_email: email,
            message: formData.message,
          };

          await emailjs.send(
            "service_1s935as",
            "template_fp4yner",
            templateParams,
            "Yw_Sl-LEwJcEf7Oef",
          );
          successCount++;
        } catch (error) {
          console.error(`Error sending email to ${email}:`, error);
          failCount++;
        }
      }

      alert(`Emails sent successfully: ${successCount}\nFailed: ${failCount}`);
      setFormData({ message: "" });
    } else {
      console.error("Emails data is not in the expected format.");
      alert("Failed to fetch subscriber emails");
    }

    setLoading(false);
  };

  const handleDeleteSubscriber = async (subscriberId) => {
    if (!window.confirm("Are you sure you want to delete this subscriber?")) {
      return;
    }

    setDeletingId(subscriberId);
    try {
      await deleteDoc(doc(db, "emails", subscriberId));
      setSubscribers(subscribers.filter((sub) => sub.id !== subscriberId));
      alert("Subscriber deleted successfully");
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      alert("Failed to delete subscriber");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditClick = (subscriber) => {
    setEditingEmail(subscriber);
    setNewEmail(subscriber.email);
    onOpen();
  };

  const handleUpdateEmail = async () => {
    if (!newEmail.trim() || !editingEmail) {
      alert("Please enter a valid email");
      return;
    }

    try {
      const docRef = doc(db, "emails", editingEmail.id);
      await updateDoc(docRef, {
        email: newEmail,
      });

      setSubscribers(
        subscribers.map((sub) =>
          sub.id === editingEmail.id ? { ...sub, email: newEmail } : sub,
        ),
      );

      alert("Email updated successfully");
      onClose();
      setEditingEmail(null);
      setNewEmail("");
    } catch (error) {
      console.error("Error updating email:", error);
      alert("Failed to update email");
    }
  };

  return (
    <RootLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <SectionHeader
          headerInfo={{
            title: "",
            subtitle: "Newsletter Admin Panel",
            description:
              "Send emails to your subscribers and manage your subscriber list",
          }}
        />

        {/* Newsletter Composition Section */}
        <div className="mb-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold">Compose Newsletter</h2>
          </div>

          <Textarea
            label="Message"
            placeholder="Write your newsletter message here..."
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            minRows={6}
            className="mb-4"
            variant="bordered"
          />

          <Button
            color="warning"
            size="lg"
            className="w-full font-semibold"
            onClick={sendEmailsToAll}
            disabled={loading || !formData.message.trim()}
            startContent={
              loading ? (
                <Spinner size="sm" color="white" />
              ) : (
                <Mail className="w-5 h-5" />
              )
            }
          >
            {loading
              ? "Sending..."
              : `Send to ${subscribers.length} Subscribers`}
          </Button>
        </div>

        {/* Subscribers Table Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold">Subscribers</h2>
              <Chip color="warning" variant="flat">
                {subscribers.length}
              </Chip>
            </div>
            <Button
              color="default"
              variant="flat"
              onClick={fetchSubscribers}
              startContent={<span className="text-lg">↻</span>}
            >
              Refresh
            </Button>
          </div>

          {loadingSubscribers ? (
            <div className="flex justify-center items-center py-12">
              <Spinner size="lg" color="warning" />
            </div>
          ) : subscribers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No subscribers yet</p>
            </div>
          ) : (
            <Table aria-label="Subscribers table" className="min-h-[400px]">
              <TableHeader>
                <TableColumn>EMAIL</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {subscribers.map((subscriber, index) => (
                  <TableRow key={subscriber.id || index}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{subscriber.email}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-2">
                        <Tooltip content="Edit email">
                          <Button
                            isIconOnly
                            size="sm"
                            color="primary"
                            variant="flat"
                            onClick={() => handleEditClick(subscriber)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Delete subscriber" color="danger">
                          <Button
                            isIconOnly
                            size="sm"
                            color="danger"
                            variant="flat"
                            onClick={() =>
                              handleDeleteSubscriber(subscriber.id)
                            }
                            disabled={deletingId === subscriber.id}
                          >
                            {deletingId === subscriber.id ? (
                              <Spinner size="sm" color="danger" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Edit Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            <ModalHeader>Edit Subscriber Email</ModalHeader>
            <ModalBody>
              <Input
                label="Email Address"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                variant="bordered"
                startContent={<Mail className="w-4 h-4 text-gray-400" />}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="warning" onPress={handleUpdateEmail}>
                Update
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </RootLayout>
  );
}
