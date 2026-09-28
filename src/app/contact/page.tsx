'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Zap } from 'lucide-react';
import { StoreHeader } from '@/components/layout/StoreHeader';
import { StoreFooter } from '@/components/layout/StoreFooter';
import { useToast } from '@/context/ToastContext';

export default function ContactPage() {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      toast('Please fill all required fields.', 'error');
      return;
    }
    setSubmitted(true);
    toast('Inquiry submitted! Our Guwahati desk will contact you shortly.', 'success');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <StoreHeader />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>Guwahati Operations Hub</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
              CONTACT US
            </h1>
            <p className="text-xs sm:text-base text-slate-600 mt-2 leading-relaxed">
              Have questions about CCTV coverage, inverter sizing, or delivery timelines to your locality in Guwahati? Our local team is here to assist.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Contact Information Cards */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Fulfillment Center</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      NC Electro Distribution Hub<br />
                      GS Road (Near Christian Basti)<br />
                      Guwahati, Assam 781005
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pt-4 border-t border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Direct Phone Helpline</h3>
                    <p className="text-xs text-slate-600 mt-1 font-mono font-bold">
                      +91 98640 12345<br />
                      0361 2450099
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pt-4 border-t border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Email Inquiries</h3>
                    <p className="text-xs text-slate-600 mt-1 font-mono">
                      contact@ncelectro.in<br />
                      support@ncelectro.in
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pt-4 border-t border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Working Hours</h3>
                    <p className="text-xs text-slate-600 mt-1">
                      Monday to Saturday: 8:00 AM – 8:00 PM<br />
                      Sunday: 9:00 AM – 2:00 PM (Emergency Dispatch Only)
                    </p>
                  </div>
                </div>
              </div>

              {/* Local Guwahati Coverage Box */}
              <div className="p-6 rounded-3xl bg-slate-950 text-white space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-400">Rapid Response Fleet</div>
                <h4 className="font-black text-lg">Kamrup Metro Same-Day Coverage</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Our delivery vans operate continuous loops between Paltan Bazar, Zoo Road, Ganeshguri, Beltola, and Jalukbari for fast order fulfillment.
                </p>
              </div>

            </div>

            {/* Inquiries Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight mb-2">
                Send an Inquiry or Installation Request
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Tell us about your requirements and a local technical executive will call you back within 2 business hours.
              </p>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="font-bold text-base text-slate-900">Inquiry Received</h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Thank you, {name}. A technician coordinator from our GS Road hub will contact you at {phone}.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setMessage('');
                    }}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 pt-2"
                  >
                    Submit another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Mridul Bora"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Mobile Phone (Assam) *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="10-digit number"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Address (Optional)</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">How can we help? *</label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Tell us about the products you need or the installation site in Guwahati (e.g. 4-camera CCTV setup for apartment, 150Ah battery for clinic)..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-medium leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry to Guwahati Hub</span>
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
