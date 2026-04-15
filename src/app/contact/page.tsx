"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Send, Loader2, Mail, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { publicApi, ApiError } from "@/lib/api/client";

const INFO = [
  { icon: Mail, title: "Email", desc: "For general enquiries or support", value: "hello@revuera.com.au" },
  { icon: MapPin, title: "Location", desc: "2 Valerie Ave, Baulkham Hills\nSydney, Australia\nABN 23 308 272 266", value: "" },
  { icon: Clock, title: "Response Time", desc: "We aim to respond within 2–4 hours during business hours.", value: "" },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError("");
    if (!name || !email || !message) { setError("Please fill in all fields."); return; }
    setLoading(true);
    try { await publicApi.contact({ name, email, message }); setSent(true); }
    catch (err) { setError(err instanceof ApiError ? err.message : "Failed to send. Try again."); }
    finally { setLoading(false); }
  }

  return (
    <>
      <Header />
      <main className="py-20 md:py-28 bg-cream">
        <div className="section-container">
          <div className="text-center mb-14">
            <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-display-md md:text-display-lg text-stone-900">Get in touch</motion.h1>
          </div>
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-14">
            {/* Left — contact info */}
            <div className="space-y-6">
              {INFO.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center shrink-0">
                    <item.icon className="h-5 w-5 text-brand-600" />
                  </div>
                  <div>
                    <h4 className="text-heading-sm text-stone-900">{item.title}</h4>
                    <p className="text-body-sm text-stone-500 whitespace-pre-line">{item.desc}</p>
                    {item.value && <a href={`mailto:${item.value}`} className="text-body-sm text-brand-600 font-medium hover:underline">{item.value}</a>}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right — form */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              {sent ? (
                <div className="bg-white rounded-3xl border border-stone-200 shadow-card p-10 text-center">
                  <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-4"><CheckCircle2 className="h-7 w-7 text-brand-600" /></div>
                  <h2 className="text-display-sm text-stone-900">Message sent!</h2>
                  <p className="mt-2 text-body-sm text-stone-500">We&apos;ll get back to you within 2–4 hours.</p>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-stone-200 shadow-card p-8">
                  <h3 className="text-heading-lg text-stone-900 mb-6">Send us a message</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div><label className="block text-body-sm font-medium text-stone-700 mb-1.5">Name</label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="h-11" required /></div>
                    <div><label className="block text-body-sm font-medium text-stone-700 mb-1.5">Email</label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="h-11" required /></div>
                    <div><label className="block text-body-sm font-medium text-stone-700 mb-1.5">Message</label><Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help?" rows={5} required /></div>
                    {error && <p className="text-body-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
                    <Button type="submit" disabled={loading} className="w-full h-11 bg-brand-600 hover:bg-brand-700 text-base font-semibold">
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4 mr-2" />Send Message</>}
                    </Button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
