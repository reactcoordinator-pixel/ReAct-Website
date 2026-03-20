"use client";

import { useState } from "react";
import { Card, CardBody } from "@heroui/react";
import { ChevronDown, Plus } from "lucide-react";

const faqData = [
  {
    id: 1,
    quest: "What is ReAct?",
    ans: "ReAct is a refugee-led advocacy group in Malaysia that works to advocate for the rights of refugees, specifically in the areas of education, healthcare, and employment.",
  },
  {
    id: 2,
    quest: "When was ReAct established?",
    ans: "ReAct was established in June 2019.",
  },
  {
    id: 3,
    quest: "What is the mission of ReAct?",
    ans: "The mission of ReAct is to advocate for the realization of refugee rights in Malaysia, focusing on the right to work, right to education, and right to healthcare.",
  },
  {
    id: 4,
    quest: "What is the vision of ReAct?",
    ans: "The vision of ReAct is the legal recognition of all refugees in Malaysia and their right to employment, accessible education, and affordable and quality healthcare, regardless of their age, gender, nationality, ethnicity, and religion.",
  },
  {
    id: 5,
    quest: "What are the objectives of ReAct?",
    ans: "The objectives of ReAct include leadership empowerment, strategic initiatives, collaborative support, policy advocacy, rights advocacy, and public support.",
  },
  {
    id: 6,
    quest: "How does ReAct empower refugee leaders?",
    ans: "ReAct empowers refugee leaders through capacity-building training and awareness activities, providing them with the necessary skills and knowledge to advocate for refugee rights.",
  },
  {
    id: 7,
    quest: "Is ReAct a government organization?",
    ans: "No, ReAct is not a government organization. It is a refugee-led advocacy group that works independently to advocate for refugee rights.",
  },
  {
    id: 8,
    quest: "What partnerships does ReAct have?",
    ans: "ReAct partners with various communities and community-based organizations (CBOs) to foster meaningful participation and advance their advocacy for refugee rights.",
  },
  {
    id: 9,
    quest: "How does ReAct engage with diverse communities?",
    ans: "ReAct engages with diverse communities by participating in events and activities, collaborating with community members, and gaining insights to better understand community needs.",
  },
  {
    id: 10,
    quest: "What role does youth play in ReAct's work?",
    ans: "ReAct values the voices of refugee youth and recognizes their unique experiences. Their insights provide valuable perspectives on the demands, aspirations, and challenges faced by young refugees.",
  },
  {
    id: 11,
    quest: "How did ReAct overcome past challenges?",
    ans: "ReAct overcame past challenges by undergoing capacity-building training, improving coordination, and securing renewed funding. These steps helped strengthen the organization and its effectiveness.",
  },
  {
    id: 12,
    quest: "What are the specific rights that ReAct advocates for?",
    ans: "ReAct advocates for the right to work, right to education, and right to healthcare for refugees in Malaysia.",
  },
  {
    id: 13,
    quest: "How can individuals support ReAct's mission?",
    ans: "Individuals can support ReAct by participating in their advocacy efforts, spreading awareness about refugee rights, and contributing to their fundraising initiatives.",
  },
  {
    id: 14,
    quest: "Does ReAct work with the Malaysian government?",
    ans: "ReAct engages with government officials from relevant ministries, such as Health and Human Resource Ministries, to raise awareness about refugee rights and advocate for policy changes.",
  },
  {
    id: 15,
    quest: "How can refugees get involved with ReAct?",
    ans: "Refugees can get involved with ReAct by becoming members, participating in capacity-building training, and joining advocacy initiatives.",
  },
  {
    id: 16,
    quest: "Does ReAct provide direct services to refugees?",
    ans: "ReAct primarily focuses on advocacy and empowerment rather than providing direct services. However, they may collaborate with other organizations that offer direct services to refugees.",
  },
  {
    id: 17,
    quest: "How can media organizations engage with ReAct?",
    ans: "Media organizations can engage with ReAct by covering their activities, sharing their advocacy messages, and amplifying the voices of refugee leaders.",
  },
  {
    id: 18,
    quest: "What are the working groups within ReAct?",
    ans: "ReAct organizes into different working groups to pursue its advocacy objectives. These groups focus on different areas such as education, healthcare, employment, and policy advocacy.",
  },
  {
    id: 19,
    quest: "Does ReAct work with international organizations?",
    ans: "ReAct may collaborate with international organizations that share similar goals and objectives in advocating for refugee rights.",
  },
  {
    id: 20,
    quest: "Can individuals from any nationality or ethnicity join ReAct?",
    ans: "Yes, individuals from any nationality or ethnicity can join ReAct and contribute to their advocacy efforts. ReAct values diversity and inclusivity within its membership.",
  },
];

const FAQItem = ({ faqData, isActive, onToggle }) => {
  const { id, quest, ans } = faqData;

  return (
    <Card className="mb-4 shadow-md hover:shadow-lg transition-shadow">
      <CardBody className="p-0">
        <button
          onClick={onToggle}
          className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <span className="text-base font-semibold text-gray-900 dark:text-white pr-4">
            {id}. {quest}
          </span>
          <div
            className={`flex-shrink-0 w-7 h-7 rounded-full bg-yellow-500 flex items-center justify-center transition-transform ${
              isActive ? "rotate-45" : ""
            }`}
          >
            <Plus className="w-4 h-4 text-white" />
          </div>
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isActive ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 pb-5 pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {ans}
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export function FaqWithBg() {
  const [activeId, setActiveId] = useState(null);

  const handleToggle = (id) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Everything you need to know about ReAct and our mission
          </p>
        </div>

        <div>
          {faqData.map((faq) => (
            <FAQItem
              key={faq.id}
              faqData={faq}
              isActive={activeId === faq.id}
              onToggle={() => handleToggle(faq.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FaqWithBg;
