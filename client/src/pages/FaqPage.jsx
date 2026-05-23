import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: 'How can I report a civic issue?',
    answer:
      'Login to your account, open the dashboard, select the complaint category, upload issue images, add location details, and submit the report for municipal review.',
    icon: '📍',
  },
  {
    question: 'How long does issue resolution take?',
    answer:
      'Resolution time depends on complaint severity and municipal workload. Emergency civic hazards receive priority attention while normal complaints follow standard workflows.',
    icon: '⏳',
  },
  {
    question: 'Can I edit or update my complaint?',
    answer:
      'Yes. Citizens can edit complaint details before the issue is resolved. Authorities can also update progress, status, and resolution notes.',
    icon: '✏️',
  },
  {
    question: 'How does complaint tracking work?',
    answer:
      'Each complaint moves through stages like Pending, In Progress, and Resolved. Users receive real-time updates and notifications throughout the lifecycle.',
    icon: '📊',
  },
  {
    question: 'Can I upload images as evidence?',
    answer:
      'Yes. You can upload clear images of the issue area to help authorities verify and prioritize complaints faster.',
    icon: '📷',
  },
  {
    question: 'Who can manage civic complaints?',
    answer:
      'Municipal authorities and platform admins can monitor reports, assign tasks, update statuses, and coordinate issue resolution.',
    icon: '🛠️',
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">

      {/* HERO SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 p-8 md:p-12  text-white"
      >

        <div className="relative z-10">

          <span className="inline-flex items-center rounded-full bg-white/20 px-5 py-2 text-sm font-medium backdrop-blur-md">
            Civic Routes Support
          </span>

          <h1 className="mt-6 text-4xl sm:text-5xl font-bold leading-tight">
            Frequently Asked Questions
          </h1>

          <p className="mt-5 max-w-3xl text-blue-100 text-lg leading-8">
            Quick answers and guidance for citizens,
            municipal authorities, and platform users.
          </p>

        </div>

      </motion.section>

      {/* FAQ SECTION */}
      <section className="space-y-5">

        {faqs.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <motion.article
              key={item.question}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-[2rem] border border-gray-200 bg-white  overflow-hidden hover: transition"
            >

              {/* BUTTON */}
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="w-full text-left px-7 py-6 flex items-center justify-between gap-5"
              >

                <div className="flex items-center gap-5">

                  {/* ICON */}
                  <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl">
                    {item.icon}
                  </div>

                  {/* QUESTION */}
                  <div>

                    <h2 className="text-xl font-bold text-gray-900">
                      {item.question}
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Click to view answer
                    </p>

                  </div>

                </div>

                {/* TOGGLE */}
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center text-2xl font-bold transition ${
                    isOpen
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {isOpen ? '−' : '+'}
                </div>

              </button>

              {/* ANSWER */}
              <AnimatePresence>

                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >

                    <div className="px-7 pb-7">

                      <div className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50 to-white p-6">

                        <p className="text-gray-700 leading-8 text-base">
                          {item.answer}
                        </p>

                      </div>

                    </div>

                  </motion.div>
                )}

              </AnimatePresence>

            </motion.article>
          );
        })}

      </section>

      {/* EXTRA SUPPORT SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-[2rem] border border-gray-200 bg-white p-8 "
      >

        <div className="grid md:grid-cols-3 gap-6">

          {/* SUPPORT */}
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-6">

            <div className="text-4xl">📧</div>

            <h3 className="mt-4 text-xl font-bold text-gray-900">
              Email Support
            </h3>

            <p className="mt-3 text-gray-600 leading-7 text-sm">
              Reach out to our support team for technical help,
              account issues, or complaint assistance.
            </p>

            <div className="mt-4 text-blue-700 font-semibold">
              support@civicroutes.com
            </div>

          </div>

          {/* EMERGENCY */}
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6">

            <div className="text-4xl">🚨</div>

            <h3 className="mt-4 text-xl font-bold text-gray-900">
              Emergency Help
            </h3>

            <p className="mt-3 text-gray-600 leading-7 text-sm">
              Use emergency support for dangerous road damage,
              water leakage, or urgent civic hazards.
            </p>

            <div className="mt-4 text-red-700 font-semibold">
              +91 1800 123 911
            </div>

          </div>

          {/* HELP CENTER */}
          <div className="rounded-3xl border border-green-200 bg-green-50 p-6">

            <div className="text-4xl">📚</div>

            <h3 className="mt-4 text-xl font-bold text-gray-900">
              Help Center
            </h3>

            <p className="mt-3 text-gray-600 leading-7 text-sm">
              Explore tutorials, reporting guides,
              and category explanations for better complaint reporting.
            </p>

            <div className="mt-4 text-green-700 font-semibold">
              Open Help Center
            </div>

          </div>

        </div>

      </motion.section>

    </div>
  );
}