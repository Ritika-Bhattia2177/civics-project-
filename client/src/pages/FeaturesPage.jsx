import { motion } from 'framer-motion';

const coreFeatures = [
  {
    title: 'Smart Civic Reporting',
    text: 'Citizens can raise complaints with category, description, image proof, and exact location details in a guided flow.',
  },
  {
    title: 'Live Status Tracking',
    text: 'Every complaint moves through Pending, In Progress, and Resolved states with real-time dashboard visibility.',
  },
  {
    title: 'Authority Command Center',
    text: 'Admins can monitor all issues, update statuses, prioritize reports, and coordinate action from one place.',
  },
  {
    title: 'Community Participation',
    text: 'Residents upvote important issues and add comments to highlight urgency and neighborhood impact.',
  },
  {
    title: 'Trend and Hotspot Insights',
    text: 'Category-level trends help municipal teams identify recurring problems and allocate resources faster.',
  },
  {
    title: 'Production-Ready UX',
    text: 'A premium responsive interface with smooth transitions makes the platform demo-ready and company-grade.',
  },
];

const processFlow = [
  {
    step: '01',
    title: 'Capture',
    text: 'Citizen reports an issue with context and location.',
  },
  {
    step: '02',
    title: 'Validate',
    text: 'Authority reviews, classifies, and assigns resolution workflow.',
  },
  {
    step: '03',
    title: 'Resolve',
    text: 'Status and updates are pushed live to all stakeholders.',
  },
  {
    step: '04',
    title: 'Close Loop',
    text: 'Resolved outcomes remain visible for trust and transparency.',
  },
];

export default function FeaturesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 p-8 md:p-12  text-white"
      >
        <div className="relative z-10">

          <span className="inline-flex items-center rounded-full bg-white/20 px-5 py-2 text-sm font-medium backdrop-blur-md">
            Civic Routes Features
          </span>

          <h1 className="mt-6 text-4xl sm:text-5xl font-bold leading-tight max-w-4xl">
            Everything needed for a professional civic issue platform.
          </h1>

          <p className="mt-5 max-w-3xl text-blue-100 text-lg leading-8">
            This module combines citizen reporting, authority operations,
            and transparent tracking into one modern, scalable city-service workflow.
          </p>

        </div>
      </motion.section>

      {/* Feature Cards */}
      <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {coreFeatures.map((feature, index) => (
          <motion.article
            key={feature.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
            className="bg-white rounded-3xl border border-gray-200 p-7  hover: hover:-translate-y-1 transition duration-300"
          >

            <div className="text-xs uppercase tracking-[0.28em] text-blue-500 font-semibold">
              Feature
            </div>

            <h2 className="mt-4 text-2xl font-bold text-gray-800">
              {feature.title}
            </h2>

            <p className="mt-4 text-gray-600 text-sm leading-7">
              {feature.text}
            </p>

          </motion.article>
        ))}
      </section>

      {/* Workflow Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-[2rem] border border-gray-200 p-8 md:p-10 "
      >

        <div className="flex items-center justify-between gap-4 flex-wrap">

          <div>
            <div className="text-sm uppercase tracking-[0.3em] text-blue-500 font-semibold">
              Operational Flow
            </div>

            <h2 className="mt-3 text-3xl font-bold text-gray-800">
              How Civic Routes Works
            </h2>
          </div>

          <span className="px-5 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
            Citizen + Admin Lifecycle
          </span>

        </div>

        {/* Flow Cards */}
        <div className="mt-10 grid md:grid-cols-2 xl:grid-cols-4 gap-5">

          {processFlow.map((item) => (
            <div
              key={item.step}
              className="bg-gradient-to-br from-blue-50 to-white rounded-3xl border border-blue-100 p-6  hover: transition"
            >

              <div className="text-blue-600 text-sm font-bold tracking-[0.28em]">
                {item.step}
              </div>

              <div className="mt-3 text-xl font-bold text-gray-800">
                {item.title}
              </div>

              <div className="mt-3 text-sm text-gray-600 leading-6">
                {item.text}
              </div>

            </div>
          ))}

        </div>
      </motion.section>

    </div>
  );
}