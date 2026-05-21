import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setSent(true);

    setForm({
      name: '',
      email: '',
      message: '',
    });

    setTimeout(() => {
      setSent(false);
    }, 4000);
  };

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
            Civic Routes Contact Center
          </span>

          <h1 className="mt-6 text-4xl sm:text-5xl font-bold leading-tight">
            Contact Civic Routes
          </h1>

          <p className="mt-5 max-w-3xl text-blue-100 text-lg leading-8">
            Reach out for civic support, complaint assistance,
            urgent incidents, and municipal coordination services.
          </p>

        </div>

      </motion.section>

      {/* MAIN SECTION */}
      <div className="grid lg:grid-cols-[1fr_0.95fr] gap-6 items-start">

        {/* CONTACT FORM */}
        <motion.form
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-xl"
        >

          <div className="flex items-center justify-between flex-wrap gap-4">

            <div>

              <h2 className="text-3xl font-bold text-gray-900">
                Contact Form
              </h2>

              <p className="mt-3 text-gray-600">
                Send your message and our support team
                will respond quickly.
              </p>

            </div>

            <div className="px-5 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
              24×7 Support
            </div>

          </div>

          {/* FORM */}
          <div className="mt-8 space-y-5">

            {/* Name */}
            <div>

              <label className="text-sm font-semibold text-gray-700">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="mt-2 w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-gray-700 outline-none focus:ring-2 focus:ring-blue-400"
              />

            </div>

            {/* Email */}
            <div>

              <label className="text-sm font-semibold text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                required
                className="mt-2 w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-gray-700 outline-none focus:ring-2 focus:ring-blue-400"
              />

            </div>

            {/* Message */}
            <div>

              <label className="text-sm font-semibold text-gray-700">
                Message
              </label>

              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                rows="6"
                required
                className="mt-2 w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-gray-700 outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />

            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 py-4 text-lg font-semibold text-white hover:shadow-2xl transition transform hover:scale-[1.01]"
            >
              Send Message
            </button>

            {/* Success */}
            {sent && (
              <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-green-700 font-medium">
                ✅ Message sent successfully. Our team will contact you soon.
              </div>
            )}

          </div>

        </motion.form>

        {/* RIGHT SIDE */}
        <motion.aside
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-5"
        >

          {/* EMAIL SUPPORT */}
          <div className="rounded-[2rem] border border-gray-200 bg-white p-7 shadow-xl">

            <div className="flex items-start gap-4">

              <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl">
                📧
              </div>

              <div>

                <div className="text-sm uppercase tracking-[0.25em] text-blue-600 font-semibold">
                  Email Support
                </div>

                <div className="mt-3 text-2xl font-bold text-gray-900">
                  support@civicroutes.com
                </div>

                <p className="mt-3 text-sm text-gray-600 leading-7">
                  Contact us for account help,
                  complaint updates, technical support,
                  or platform assistance.
                </p>

              </div>

            </div>

          </div>

          {/* EMERGENCY */}
          <div className="rounded-[2rem] border border-red-200 bg-gradient-to-r from-red-50 to-rose-50 p-7 shadow-xl">

            <div className="flex items-start gap-4">

              <div className="h-14 w-14 rounded-2xl bg-red-100 flex items-center justify-center text-2xl">
                🚨
              </div>

              <div>

                <div className="text-sm uppercase tracking-[0.25em] text-red-600 font-semibold">
                  Emergency Helpline
                </div>

                <div className="mt-3 text-3xl font-bold text-red-700">
                  +91 1800 123 911
                </div>

                <p className="mt-3 text-sm text-red-600 leading-7">
                  Use for urgent civic hazards such as
                  major water leakage, dangerous road damage,
                  electrical failures, or public safety risks.
                </p>

              </div>

            </div>

          </div>

          {/* OFFICE MAP */}
          <div className="rounded-[2rem] border border-gray-200 bg-white p-7 shadow-xl">

            <div className="flex items-center justify-between">

              <div>

                <div className="text-sm uppercase tracking-[0.25em] text-blue-600 font-semibold">
                  Office Location
                </div>

                <h3 className="mt-3 text-2xl font-bold text-gray-900">
                  Civic Routes Headquarters
                </h3>

              </div>

              <div className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                City Hub
              </div>

            </div>

            {/* REAL MAP */}
            <div className="mt-6 h-[280px] rounded-3xl overflow-hidden border border-blue-200 shadow-lg">

              <iframe
                title="Civic Routes Office"
                src="https://www.openstreetmap.org/export/embed.html?bbox=76.95%2C28.95%2C77.15%2C29.15&layer=mapnik"
                className="w-full h-full border-0"
                loading="lazy"
              />

            </div>

            <div className="mt-5 rounded-2xl bg-blue-50 border border-blue-200 p-5">

              <div className="font-semibold text-gray-900">
                📍 Civic Routes Office
              </div>

              <div className="mt-2 text-sm text-gray-600 leading-7">
                Civic Center, Smart City Hub,
                Sector 9, Urban Development Zone,
                India.
              </div>

            </div>

          </div>

        </motion.aside>

      </div>

    </div>
  );
}