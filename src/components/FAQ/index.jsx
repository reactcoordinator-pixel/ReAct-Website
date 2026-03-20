// components/FAQ.tsx
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardBody, Button, Spinner } from "@heroui/react";
import { ChevronDown, ArrowRight, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCMS } from "@/contexts/CMSContext";
import { EditableText } from "@/components/CMS/EditableField";

const FAQItem = ({ faqData, isActive, onToggle, section, index }) => {
  const { question, answer } = faqData;

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 lg:px-8 lg:py-6 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <EditableText
          section={section}
          field={`items.${index}.question`}
          value={question}
          as="span"
          className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white pr-4"
        />
        <ChevronDown
          className={`w-5 h-5 text-yellow-500 flex-shrink-0 transition-transform duration-300 ${
            isActive ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isActive ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-5 lg:px-8 lg:pb-6 pt-2">
          <EditableText
            section={section}
            field={`items.${index}.answer`}
            value={answer}
            as="p"
            className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line"
            multiline
          />
        </div>
      </div>
    </div>
  );
};

const FAQ = () => {
  const { content, isLoading, isReady, isEditMode, updateContent } = useCMS();

  if (isLoading || !isReady) {
    return (
      <div className="mb-0 mt-20 w-full h-48 flex items-center justify-center">
        <Spinner size="lg" color="warning" />
      </div>
    );
  }

  const faqContent = content.faq;
  const [activeFaq, setActiveFaq] = useState(1);

  const handleFaqToggle = (id) => {
    setActiveFaq(activeFaq === id ? 0 : id);
  };

  const addNewFAQ = () => {
    const newItem = {
      id: faqContent.items.length + 1,
      question: "New Question",
      answer: "New Answer",
    };
    updateContent("faq", "items", [...faqContent.items, newItem]);
  };

  const deleteFAQ = (index) => {
    const newItems = faqContent.items.filter((_, i) => i !== index);
    updateContent("faq", "items", newItems);
  };

  return (
    <section className="px-10 py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Side - Header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-24"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              <EditableText
                section="faq"
                field="heading"
                value={faqContent.heading}
                as="span"
                className="inline"
              />
              <span className="relative inline-block ml-2">
                <span className="absolute bottom-2 left-0 w-full h-3 bg-yellow-500/20 -z-10"></span>
              </span>
            </h2>

            <EditableText
              section="faq"
              field="description"
              value={faqContent.description}
              as="p"
              className="text-lg text-gray-600 dark:text-gray-400 mb-8"
              multiline
            />

            <Link
              href="/FAQs"
              className="group inline-flex items-center gap-2.5 text-gray-900 dark:text-white hover:text-yellow-500 dark:hover:text-yellow-500 transition-colors font-semibold"
            >
              <span className="duration-300 group-hover:pr-2">Know More</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>

            {isEditMode && (
              <Button
                onClick={addNewFAQ}
                className="mt-4 bg-yellow-400"
                startContent={<Plus className="w-4 h-4" />}
              >
                Add FAQ Item
              </Button>
            )}
          </motion.div>

          {/* Right Side - FAQ Items */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="shadow-lg">
              <CardBody className="p-0">
                {faqContent.items.map((faq, index) => (
                  <div key={faq.id} className="relative group">
                    <FAQItem
                      faqData={faq}
                      isActive={activeFaq === faq.id}
                      onToggle={() => handleFaqToggle(faq.id)}
                      section="faq"
                      index={index}
                    />
                    {isEditMode && faqContent.items.length > 1 && (
                      <button
                        onClick={() => deleteFAQ(index)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
