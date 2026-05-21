import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'Real-Time Tracking',
    text: 'Follow each complaint from submission to closure with live status visibility.',
  },
  {
    title: 'Image Upload',
    text: 'Attach photo evidence so authorities can verify and act faster.',
  },
  {
    title: 'Live Notifications',
    text: 'Get instant updates whenever issue status changes in the system.',
  },
  {
    title: 'Geo Location',
    text: 'Pin exact complaint locations for quicker assignment and field response.',
  },
];

const steps = ['Report', 'Verification', 'Assigned', 'Resolved'];

const testimonials = [
  {
    quote:
      'I reported a broken streetlight with a photo and location. It was resolved in two days and I got live updates throughout.',
    name: 'Aarav Sharma',
    role: 'Citizen Reporter',
  },
  {
    quote:
      'The platform is clear and transparent. We can finally track what is pending and what is resolved in one dashboard.',
    name: 'Nisha Patel',
    role: 'Community Volunteer',
  },
  {
    quote:
      'Civic Routes gives municipal teams structured data and helps us prioritize high-impact complaints quickly.',
    name: 'Rohan Mehta',
    role: 'City Operations Officer',
  },
];

export default function HomePage({ issues }) {
  const recentComplaints = (issues?.length ? issues : demoIssues).slice(0, 5);

  return (
    <div className="overflow-hidden bg-slate-50">

      {/* HERO SECTION */}
      <section className="relative border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* LEFT CONTENT */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
            >

              <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-sm font-medium">
                Smart Civic Issue Reporting Platform
              </span>

              <h1 className="mt-6 text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
                Report Civic Issues Faster
              </h1>

              <p className="mt-6 text-lg text-gray-600 leading-8 max-w-xl">
                Civic Routes helps citizens and authorities collaborate
                through transparent issue reporting, live tracking,
                and faster city-level resolution.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">

                <Link
                  to="/signup"
                  className="px-7 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 font-semibold text-white hover:shadow-xl transition transform hover:scale-105"
                >
                  Report Issue
                </Link>

                <Link
                  to="/dashboard"
                  className="px-7 py-3 rounded-2xl border-2 border-blue-500 text-blue-700 font-semibold hover:bg-blue-50 transition"
                >
                  Track Complaint
                </Link>

              </div>

            </motion.div>

            {/* STATS */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-[2rem] border border-blue-200 bg-white p-8 shadow-xl"
            >

              <div className="text-sm uppercase tracking-[0.3em] text-blue-600 font-semibold">
                Platform Statistics
              </div>

              <div className="mt-6 grid sm:grid-cols-3 gap-4">

                <AnimatedStat
                  target={1250}
                  suffix="+"
                  label="Issues Resolved"
                />

                <AnimatedStat
                  target={9600}
                  suffix="+"
                  label="Active Citizens"
                />

                <AnimatedStat
                  target={42}
                  suffix="+"
                  label="Cities Connected"
                />

              </div>

            </motion.div>

          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >

          <h2 className="text-4xl font-bold text-gray-900">
            Features
          </h2>

          <p className="mt-3 text-gray-600">
            Everything needed for a modern and reliable civic issue platform.
          </p>

        </motion.div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">

          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="rounded-3xl border border-gray-200 bg-white p-7 shadow-md hover:shadow-2xl transition"
            >

              <div className="text-xs uppercase tracking-[0.25em] text-blue-600 font-semibold">
                Core Feature
              </div>

              <h3 className="mt-4 text-xl font-bold text-gray-900">
                {feature.title}
              </h3>

              <p className="mt-4 text-sm text-gray-600 leading-7">
                {feature.text}
              </p>

            </motion.div>
          ))}

        </div>

      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[2rem] border border-blue-200 bg-white p-8 shadow-xl"
        >

          <h2 className="text-3xl font-bold text-gray-900">
            How It Works
          </h2>

          <p className="mt-3 text-gray-600">
            Report → Verification → Assigned → Resolved
          </p>

          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {steps.map((step, index) => (
              <div
                key={step}
                className="rounded-3xl border border-blue-200 bg-blue-50 p-6"
              >

                <div className="text-blue-700 text-sm font-bold tracking-[0.25em]">
                  0{index + 1}
                </div>

                <div className="mt-3 text-xl font-bold text-gray-900">
                  {step}
                </div>

              </div>
            ))}

          </div>

        </motion.div>

      </section>

      {/* MAP + RECENT COMPLAINTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 items-start">

          {/* MAP */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[2rem] border border-blue-200 bg-white p-8 shadow-xl"
          >

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Interactive Map Preview
                </h2>

                <p className="mt-3 text-gray-600">
                  View live civic complaints across city locations.
                </p>
              </div>

              <div className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                Live Tracking
              </div>

            </div>

            {/* REAL MAP */}
            <div className="mt-6 h-[420px] rounded-3xl overflow-hidden border border-blue-200 shadow-lg">

              <iframe
                title="Civic Routes Map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=76.95%2C28.95%2C77.15%2C29.15&layer=mapnik"
                className="w-full h-full border-0"
                loading="lazy"
              />

            </div>

          </motion.div>

          {/* RECENT COMPLAINTS */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[2rem] border border-blue-200 bg-white p-8 shadow-xl"
          >

            <h3 className="text-2xl font-bold text-gray-900">
              Recent Complaints
            </h3>

            <div className="mt-6 space-y-4">

              {recentComplaints.map((item) => (
                <div
                  key={item._id || item.title}
                  className="rounded-2xl border border-blue-200 bg-blue-50 p-5 hover:shadow-md transition"
                >

                  <div className="flex items-center justify-between gap-3">

                    <div>

                      <div className="font-semibold text-gray-900">
                        {item.title}
                      </div>

                      <div className="text-xs text-gray-600 mt-2">
                        {item.location?.address || 'Location Pending'} • {item.category}
                      </div>

                    </div>

                    <span className="text-xs px-4 py-2 rounded-full bg-blue-100 border border-blue-200 text-blue-700 font-medium">
                      {item.status}
                    </span>

                  </div>

                </div>
              ))}

            </div>

          </motion.div>

        </div>

      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >

          <h2 className="text-4xl font-bold text-gray-900">
            Testimonials
          </h2>

          <p className="mt-3 text-gray-600">
            Citizen feedback
          </p>

        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">

          {testimonials.map((item, index) => (
            <motion.article
              key={item.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="rounded-3xl border border-gray-200 bg-white p-7 shadow-md hover:shadow-2xl transition"
            >

              <p className="text-gray-700 leading-8">
                “{item.quote}”
              </p>

              <div className="mt-6">

                <div className="font-bold text-gray-900">
                  {item.name}
                </div>

                <div className="text-sm text-gray-500 mt-1">
                  {item.role}
                </div>

              </div>

            </motion.article>
          ))}

        </div>

      </section>

    </div>
  );
}

function AnimatedStat({ target, suffix = '', label }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = 0;

    const duration = 900;
    const frame = 16;

    const increment = Math.max(
      1,
      Math.ceil(target / (duration / frame))
    );

    const timer = setInterval(() => {
      start += increment;

      if (start >= target) {
        setValue(target);
        clearInterval(timer);
      } else {
        setValue(start);
      }
    }, frame);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className="rounded-3xl border border-blue-200 bg-blue-50 p-6 text-center shadow-sm">

      <div className="text-4xl font-bold text-blue-700">
        {value}
        {suffix}
      </div>

      <div className="mt-2 text-sm text-gray-600">
        {label}
      </div>

    </div>
  );
}

const demoIssues = [
  {
    title: 'Water leakage near market road',
    category: 'Water Leakage',
    status: 'In Progress',
    location: { address: 'Ward 12, Market Road' },
  },
  {
    title: 'Streetlight not working',
    category: 'Broken Streetlights',
    status: 'Pending',
    location: { address: 'Central Avenue' },
  },
  {
    title: 'Garbage overflow at park gate',
    category: 'Garbage',
    status: 'Resolved',
    location: { address: 'City Park Gate' },
  },
  {
    title: 'Pothole near metro exit',
    category: 'Potholes',
    status: 'In Progress',
    location: { address: 'Metro Exit Road' },
  },
  {
    title: 'Damaged road divider',
    category: 'Road Damage',
    status: 'Pending',
    location: { address: 'Ring Road Sector 9' },
  },
];