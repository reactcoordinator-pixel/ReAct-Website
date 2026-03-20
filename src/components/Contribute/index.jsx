// components/Contribute.tsx
"use client";
import { useState, useRef } from "react";
import {
  Button,
  Input,
  Textarea,
  Card,
  CardBody,
  Spinner,
} from "@heroui/react";
import { Send, Mail, User, Building2, Phone } from "lucide-react";
import emailjs from "@emailjs/browser";
import { useCMS } from "@/contexts/CMSContext";
import { EditableText } from "@/components/CMS/EditableField";

function Contribute() {
  const { content, isLoading, isReady } = useCMS();

  if (isLoading || !isReady) {
    return (
      <div className="mb-0 mt-20 w-full h-48 flex items-center justify-center">
        <Spinner size="lg" color="warning" />
      </div>
    );
  }

  const contributeContent = content.contribute;

  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const form = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await emailjs.sendForm(
        "service_pjm5ras",
        "template_9mca49n",
        form.current,
        "C172Rx3PPVX0Izb1g",
      );

      setShowSuccess(true);
      setFormData({
        name: "",
        organization: "",
        email: "",
        message: "",
      });

      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Contact Info */}
          <div className="space-y-8">
            <Card className="border-none shadow-none">
              <CardBody className="p-8">
                <EditableText
                  section="contribute"
                  field="heading"
                  value={contributeContent.heading}
                  as="h2"
                  className="text-4xl font-bold text-black mb-6"
                />

                <EditableText
                  section="contribute"
                  field="description"
                  value={contributeContent.description}
                  as="p"
                  className="text-black/90 text-lg mb-8"
                  multiline
                />

                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-black">
                    <div className="bg-black/20 p-3 rounded-full backdrop-blur-sm">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-black/80">Call us</p>
                      <EditableText
                        section="contribute"
                        field="phone"
                        value={contributeContent.phone}
                        as="p"
                        className="text-lg font-semibold"
                      />
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Right Side - Form */}
          <Card>
            <CardBody className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Send us a message</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Fill out the form below and we'll get back to you shortly
                </p>
              </div>

              {showSuccess && (
                <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <p className="font-medium">
                      Message sent successfully! We'll be in touch soon.
                    </p>
                  </div>
                </div>
              )}

              <div ref={form} className="space-y-6">
                <Input
                  type="text"
                  name="name"
                  label="Full Name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  size="sm"
                  isRequired
                  startContent={<User className="w-4 h-4 text-gray-400" />}
                />

                <Input
                  type="text"
                  name="organization"
                  label="Organization"
                  placeholder="Your Company Name"
                  value={formData.organization}
                  onChange={(e) =>
                    setFormData({ ...formData, organization: e.target.value })
                  }
                  size="sm"
                  startContent={<Building2 className="w-4 h-4 text-gray-400" />}
                />

                <Input
                  type="email"
                  name="email"
                  label="Email Address"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  size="sm"
                  isRequired
                  startContent={<Mail className="w-4 h-4 text-gray-400" />}
                />

                <Textarea
                  name="message"
                  label="Message"
                  placeholder="Tell us about your project or inquiry..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  size="sm"
                  minRows={6}
                  isRequired
                />

                <Button
                  className="w-full bg-[#f8cf2c] font-semibold text-md shadow-lg hover:shadow-xl transition-all"
                  isLoading={isSubmitting}
                  startContent={!isSubmitting && <Send className="w-5 h-5" />}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Contribute;
