import { motion } from 'framer-motion';

const teamMembers = [
  {
    name: 'Ritika Sharma',
    role: 'Product Lead',
    focus: 'Platform strategy and civic UX direction',
  },
  {
    name: 'Aman Verma',
    role: 'Frontend Engineer',
    focus: 'Responsive dashboards and motion-driven UI',
  },
  {
    name: 'Neha Singh',
    role: 'Backend Engineer',
    focus: 'API architecture, auth, and real-time data flow',
  },
  {
    name: 'Karan Patel',
    role: 'Data & Ops Analyst',
    focus: 'Civic trend insights and impact reporting',
  },
];

const roadmap = [
  {
    phase: 'Q1',
    title: 'Map Intelligence',
    detail:
      'Heatmaps, ward-wise clustering, and geo-priority routing.',
  },
  {
    phase: 'Q2',
    title: 'Authority Automation',
    detail:
      'Smart assignment rules and SLA-based escalation alerts.',
  },
  {
    phase: 'Q3',
    title: 'Citizen Experience 2.0',
    detail:
      'Multilingual support, accessibility upgrades, and mobile PWA mode.',
  },
  {
    phase: 'Q4',
    title: 'City Integration Layer',
    detail:
      'Department APIs, analytics exports, and smart city command center sync.',
  },
  {
  phase: 'Q5',
  title: 'AI-Powered Complaint Analysis',
  detail:
    'Artificial intelligence will automatically detect duplicate complaints, identify urgent issues, and recommend faster resolution priorities.',
},
];

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">

      {/* HERO */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 p-8 md:p-12 shadow-2xl text-white"
      >

        <div className="relative z-10">

          <span className="inline-flex items-center rounded-full bg-white/20 px-5 py-2 text-sm font-medium backdrop-blur-md">
            About Civic Routes
          </span>

          <h1 className="mt-6 text-4xl sm:text-5xl font-bold leading-tight max-w-5xl">
            Building transparent civic systems for smarter cities.
          </h1>

          <p className="mt-5 max-w-3xl text-blue-100 text-lg leading-8">
            Civic Routes is a modern civic issue management platform
            created to connect citizens and authorities through
            fast reporting, real-time tracking, and accountable resolution.
          </p>

        </div>

      </motion.section>

      {/* MISSION + VISION */}
      <section className="grid lg:grid-cols-2 gap-6">

        <motion.article
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[2rem] border border-blue-200 bg-white p-8 shadow-lg"
        >

          <div className="text-sm uppercase tracking-[0.3em] text-blue-600 font-semibold">
            Mission
          </div>

          <p className="mt-5 text-gray-700 leading-8">
            To make civic issue reporting simple, transparent,
            and action-oriented by giving citizens and city authorities
            one trusted digital workflow.
          </p>

        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[2rem] border border-blue-200 bg-white p-8 shadow-lg"
        >

          <div className="text-sm uppercase tracking-[0.3em] text-blue-600 font-semibold">
            Vision
          </div>

          <p className="mt-5 text-gray-700 leading-8">
            To power data-driven, citizen-centric urban governance
            where complaints are resolved faster and every neighborhood
            gets visible service outcomes.
          </p>

        </motion.article>

      </section>

      {/* WHY + IMPACT */}
      <section className="grid lg:grid-cols-2 gap-6">

        <motion.article
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-lg"
        >

          <h2 className="text-3xl font-bold text-gray-900">
            Why Civic Routes Exists
          </h2>

          <p className="mt-5 text-gray-600 leading-8">
            Traditional complaint channels are fragmented,
            opaque, and slow. Civic Routes creates a single digital
            bridge where issues are reported with context,
            tracked publicly, and resolved with accountability.
          </p>

        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-lg"
        >

          <h2 className="text-3xl font-bold text-gray-900">
            Impact on Smart Cities
          </h2>

          <p className="mt-5 text-gray-600 leading-8">
            The platform improves response speed, builds citizen trust,
            and helps urban teams prioritize high-impact work using
            live data and community signals.
          </p>

        </motion.article>

      </section>

      {/* TEAM MEMBERS */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-xl"
      >

        <h2 className="text-3xl font-bold text-gray-900">
          Team Members
        </h2>

        <div className="mt-8 grid md:grid-cols-2 xl:grid-cols-4 gap-5">

          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="rounded-3xl border border-blue-200 bg-blue-50 p-6 hover:shadow-xl transition"
            >

              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white flex items-center justify-center text-2xl font-bold">
                {member.name.charAt(0)}
              </div>

              <div className="mt-5 text-xl font-bold text-gray-900">
                {member.name}
              </div>

              <div className="text-blue-600 text-sm mt-1 font-medium">
                {member.role}
              </div>

              <div className="text-gray-600 text-sm mt-4 leading-7">
                {member.focus}
              </div>

            </div>
          ))}

        </div>

      </motion.section>

      {/* CORE PLATFORM FEATURES + ROADMAP */}
      <section className="grid lg:grid-cols-2 gap-6">

        {/* CORE FEATURES */}
        <motion.article
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-xl"
        >

          <div className="flex items-center justify-between flex-wrap gap-4">

            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Core Platform Features
              </h2>

              <p className="mt-3 text-gray-600 leading-7 max-w-2xl">
                Civic Routes provides modern digital tools
                for transparent complaint management,
                citizen participation, and faster issue resolution.
              </p>
            </div>

            <div className="px-5 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
              Smart City Workflow
            </div>

          </div>

          <div className="mt-10 space-y-4">

            {[
              {
                title: 'Smart Civic Reporting',
                text: 'Citizens can submit complaints with images and exact locations.',
                icon: '📍',
              },
              {
                title: 'Live Complaint Tracking',
                text: 'Track complaints from Pending to Resolved in real-time.',
                icon: '📊',
              },
              {
                title: 'Interactive City Mapping',
                text: 'Issue locations are displayed on maps for quicker action.',
                icon: '🗺️',
              },
              {
                title: 'Admin Monitoring Dashboard',
                text: 'Authorities can manage and prioritize all civic complaints.',
                icon: '🛠️',
              },
              {
                title: 'Community Participation',
                text: 'Citizens can upvote issues and add comments for visibility.',
                icon: '👥',
              },
              {
                title: 'Live Notifications',
                text: 'Instant updates whenever complaint status changes.',
                icon: '🔔',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-5 hover:shadow-lg transition"
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
                      {item.text}
                    </p>

                  </div>

                </div>

              </div>
            ))}

          </div>

        </motion.article>

        {/* ROADMAP */}
        <motion.article
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-lg"
        >

          <h2 className="text-3xl font-bold text-gray-900">
            Future Roadmap
          </h2>

          <div className="mt-6 space-y-4">

            {roadmap.map((item) => (
              <div
                key={item.phase}
                className="rounded-2xl border border-blue-200 bg-blue-50 p-5"
              >

                <div className="text-blue-700 text-xs tracking-[0.3em] uppercase font-bold">
                  {item.phase}
                </div>

                <div className="mt-3 text-lg font-bold text-gray-900">
                  {item.title}
                </div>

                <div className="mt-2 text-sm text-gray-600 leading-7">
                  {item.detail}
                </div>

              </div>
            ))}

          </div>

        </motion.article>

      </section>

    </div>
  );
}