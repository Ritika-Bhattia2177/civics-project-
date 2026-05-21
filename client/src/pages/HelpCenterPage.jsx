import { motion } from 'framer-motion';

const tutorials = [
  {
    title: 'Create Your Account',
    detail:
      'Register securely and set up your citizen profile to start reporting civic issues.',
    icon: '👤',
  },
  {
    title: 'Report Civic Complaints',
    detail:
      'Submit issues with category selection, images, and exact locations for faster action.',
    icon: '📍',
  },
  {
    title: 'Track Complaint Status',
    detail:
      'Monitor every complaint from Pending to Resolved with live updates.',
    icon: '📊',
  },
  {
    title: 'Community Participation',
    detail:
      'Use comments and upvotes to highlight urgent issues in your area.',
    icon: '👥',
  },
];

const categories = [
  {
    name: 'Potholes',
    detail:
      'Road surface cracks, deep pits, and unsafe lane damage affecting vehicles and safety.',
    icon: '🛣️',
  },
  {
    name: 'Garbage',
    detail:
      'Overflowing bins, uncollected waste, and sanitation-related civic problems.',
    icon: '🗑️',
  },
  {
    name: 'Water Leakage',
    detail:
      'Pipeline bursts, continuous leakage, and water wastage across city areas.',
    icon: '💧',
  },
  {
    name: 'Broken Streetlights',
    detail:
      'Faulty poles, dark streets, and unsafe night-time public lighting zones.',
    icon: '💡',
  },
  {
    name: 'Road Damage',
    detail:
      'Divider breaks, collapsed roads, and damaged public road infrastructure.',
    icon: '🚧',
  },
  {
    name: 'Drainage Issues',
    detail:
      'Blocked drains, waterlogging, and sewage overflow causing public inconvenience.',
    icon: '🌊',
  },
];

export default function HelpCenterPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">

      {/* HERO SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 p-8 md:p-12 shadow-2xl text-white"
      >

        <div className="relative z-10">

          <span className="inline-flex items-center rounded-full bg-white/20 px-5 py-2 text-sm font-medium backdrop-blur-md">
            Civic Routes Help Center
          </span>

          <h1 className="mt-6 text-4xl sm:text-5xl font-bold leading-tight">
            Help Center
          </h1>

          <p className="mt-5 max-w-3xl text-blue-100 text-lg leading-8">
            Step-by-step support for complaint reporting,
            image uploads, real-time tracking,
            and understanding civic issue categories.
          </p>

        </div>

      </motion.section>

      {/* TUTORIALS + REPORTING GUIDE */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Tutorials */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-xl"
        >

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Tutorials
              </h2>

              <p className="mt-3 text-gray-600">
                Learn how to use Civic Routes efficiently.
              </p>
            </div>

            <div className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
              Step-by-Step
            </div>

          </div>

          <div className="mt-8 space-y-4">

            {tutorials.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50 to-white p-5 hover:shadow-xl transition"
              >

                <div className="flex items-start gap-4">

                  <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl">
                    {item.icon}
                  </div>

                  <div>

                    <h3 className="text-lg font-bold text-gray-900">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm text-gray-600 leading-7">
                      {item.detail}
                    </p>

                  </div>

                </div>

              </div>
            ))}

          </div>

        </motion.section>

        {/* Reporting Guide */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-xl"
        >

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Reporting Guide
              </h2>

              <p className="mt-3 text-gray-600">
                Best practices for accurate complaint submissions.
              </p>
            </div>

            <div className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
              Smart Reporting
            </div>

          </div>

          <ol className="mt-8 space-y-4">

            {[
              'Select the most accurate complaint category.',
              'Write a clear title and complete issue description.',
              'Add exact location details or map coordinates.',
              'Upload clear images for verification.',
              'Track complaint progress in real-time dashboard.',
            ].map((step, index) => (
              <li
                key={step}
                className="flex gap-4 rounded-2xl border border-blue-200 bg-blue-50 p-4"
              >

                <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  {index + 1}
                </div>

                <div className="text-gray-700 font-medium pt-2">
                  {step}
                </div>

              </li>
            ))}

          </ol>

          {/* Image Upload Guide */}
          <div className="mt-8 rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50 to-white p-6">

            <div className="flex items-start gap-4">

              <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl">
                📷
              </div>

              <div>

                <h3 className="text-xl font-bold text-gray-900">
                  Image Upload Guide
                </h3>

                <p className="mt-3 text-sm text-gray-600 leading-7">
                  Use clear daytime photos, avoid blurry images,
                  and capture the complete issue area.
                  Add one close image and one wider context image
                  for better municipal verification.
                </p>

              </div>

            </div>

          </div>

        </motion.section>

      </div>

      {/* COMPLAINT CATEGORIES */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-xl"
      >

        <div className="flex items-center justify-between flex-wrap gap-4">

          <div>

            <h2 className="text-3xl font-bold text-gray-900">
              Complaint Categories
            </h2>

            <p className="mt-3 text-gray-600">
              Understand different civic issue types before reporting.
            </p>

          </div>

          <div className="px-5 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
            Civic Categories
          </div>

        </div>

        <div className="mt-8 grid md:grid-cols-2 xl:grid-cols-3 gap-5">

          {categories.map((item) => (
            <div
              key={item.name}
              className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6 hover:shadow-xl transition"
            >

              <div className="flex items-start gap-4">

                <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl">
                  {item.icon}
                </div>

                <div>

                  <h3 className="text-xl font-bold text-gray-900">
                    {item.name}
                  </h3>

                  <p className="mt-3 text-sm text-gray-600 leading-7">
                    {item.detail}
                  </p>

                </div>

              </div>

            </div>
          ))}

        </div>

      </motion.section>

    </div>
  );
}