// components/Contact/Contact.tsx (Fixed Version)
"use client";

import React, { useRef } from "react"; // ← THIS WAS MISSING! This fixes the ref error
import { motion } from "framer-motion";
import Link from "next/link";
import emailjs from "@emailjs/browser";
import { useCMS } from "@/contexts/CMSContext";
import { EditableText, EditableImage } from "@/components/CMS/EditableField";
import SectionHeader from "@/components/Common/SectionHeader";
import { Input, Textarea, Button } from "@heroui/react";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  const { content, isEditMode } = useCMS();
  const contact = content || {};

  const form = useRef<HTMLFormElement>(null);

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.current) {
      emailjs.sendForm(
        "service_pjm5ras",
        "template_baie8kk",
        form.current,
        "C172Rx3PPVX0Izb1g",
      );
      form.current.reset();
    }
  };

  return (
    <section className="mb-4">
      {/* Hero Image */}
      <div className="relative mb-4">
        <EditableImage
          section="hero"
          field="image"
          value={contact.hero?.image || ""}
          className="w-screen h-[300px] object-cover"
          maxWidth={1920}
          maxHeight={600}
          aspectRatio="21:9"
          helpText="Hero banner image for the Contact page"
        />
      </div>

      {/* Header */}
      {isEditMode ? (
        <div className="mx-auto relative text-center px-4">
          <EditableText
            section="hero"
            field="subtitle"
            value={contact.hero?.subtitle || ""}
            as="h2"
            className="text-2xl md:text-4xl font-semibold text-[#000] mb-6"
          />
          <div className="absolute bottom-[50px] left-1/2 transform -translate-x-1/2 h-2 bg-[#f8cf2c]  w-40"></div>
          <EditableText
            section="hero"
            field="description"
            value={contact.hero?.description || ""}
            as="p"
            className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
            multiline
          />
        </div>
      ) : (
        <div className="text-center">
          <SectionHeader
            headerInfo={{
              title: contact.hero?.title || "",
              subtitle: contact.hero?.subtitle || "",
              description: contact.hero?.description || "",
            }}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="relative mx-auto px-7.5 pt-10">
        <div className="flex flex-wrap">
          {/* Form Side */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 1, delay: 0.1 }}
            viewport={{ once: true }}
            {...({
              className:
                "w-full md:w-[65%] rounded-lg bg-white p-7.5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black",
            } as any)}
          >
            <EditableText
              section="form"
              field="title"
              value={contact.form?.title || ""}
              as="h2"
              className="mb-12 text-3xl font-semibold text-[#252827] dark:text-white xl:text-sectiontitle2"
            />

            <form ref={form} onSubmit={sendEmail}>
              <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
                <Input
                  type="text"
                  name="name"
                  placeholder="Full name"
                  required
                  variant="underlined"
                  size="lg"
                />
                <Input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  required
                  variant="underlined"
                  size="lg"
                />
                <Input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  variant="underlined"
                  size="lg"
                />
                <Input
                  type="text"
                  name="phonenumber"
                  placeholder="Phone number"
                  required
                  variant="underlined"
                  size="lg"
                />
              </div>

              <Textarea
                name="message"
                placeholder="Message"
                rows={6}
                required
                variant="underlined"
                size="lg"
                className="mb-12"
              />

              <Button
                type="submit"
                size="lg"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#f8cf2c] px-8 py-4 font-medium text-white duration-300 ease-in-out hover:bg-[#e6c028]"
              >
                {contact.form?.submitButton || "Send Message"}
                <svg
                  className="fill-white"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z" />
                </svg>
              </Button>
            </form>
          </motion.div>

          {/* Contact Info Side */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 2, delay: 0.1 }}
            viewport={{ once: true }}
            className="w-full md:w-[35%] md:pt-4 md:pl-10"
          >
            <EditableText
              section="contactInfo"
              field="title"
              value={contact.contactInfo?.title || ""}
              as="h2"
              className="mb-12  text-3xl font-semibold text-[#252827] dark:text-white xl:text-sectiontitle2"
            />

            <div className="mb-10">
              <EditableText
                section="contactInfo.location"
                field="title"
                value={contact.contactInfo?.location?.title || ""}
                as="h3"
                className="mb-4 text-lg font-medium text-[#252827] dark:text-white"
              />
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#f8cf2c]" />
                <EditableText
                  section="contactInfo.location"
                  field="address"
                  value={contact.contactInfo?.location?.address || ""}
                  as="p"
                  className="text-base text-gray-600 dark:text-gray-400"
                />
              </div>
            </div>

            <div className="mb-10">
              <EditableText
                section="contactInfo.email"
                field="title"
                value={contact.contactInfo?.email?.title || ""}
                as="h3"
                className="mb-4 text-lg font-medium text-[#252827] dark:text-white"
              />
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#f8cf2c]" />
                <Link
                  href={`mailto:${contact.contactInfo?.email?.address || ""}`}
                  className="text-base text-gray-600 dark:text-gray-400 hover:text-[#f8cf2c]"
                >
                  <EditableText
                    section="contactInfo.email"
                    field="address"
                    value={contact.contactInfo?.email?.address || ""}
                    as="span"
                  />
                </Link>
              </div>
            </div>

            <div>
              <EditableText
                section="contactInfo.phone"
                field="title"
                value={contact.contactInfo?.phone?.title || ""}
                as="h3"
                className="mb-4 text-lg font-medium text-[#252827] dark:text-white"
              />
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#f8cf2c]" />
                <Link
                  href={contact.contactInfo?.phone?.whatsappLink || ""}
                  className="text-base text-gray-600 dark:text-gray-400 hover:text-[#f8cf2c]"
                >
                  <EditableText
                    section="contactInfo.phone"
                    field="number"
                    value={contact.contactInfo?.phone?.number || ""}
                    as="span"
                  />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
