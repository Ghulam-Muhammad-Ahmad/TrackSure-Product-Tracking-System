import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-muted p-6 md:p-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">TrackSure — Terms of Service</CardTitle>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="mb-4">
                Welcome to TrackSure ("TrackSure", "we", "us", "our"). TrackSure is a multi-tenant SaaS platform for product authenticity verification and lifecycle tracking using QR codes, AI-based insights, and role-based workflows across the supply chain.
              </p>
              <p className="mb-4">
                By creating an account, accessing, or using the TrackSure platform (the "Service"), you agree to these Terms of Service ("Terms").
              </p>
              <p className="mb-4">
                If you do not agree, you may not use the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Eligibility</h2>
              <p className="mb-2">You must:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Be at least 13 years old (or the legal age in your jurisdiction),</li>
                <li>Have the legal authority to enter into these Terms if acting on behalf of an organization,</li>
                <li>Provide accurate account information.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Description of Service</h2>
              <p className="mb-2">TrackSure provides:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>QR-code product tracking</li>
                <li>Role-based workflows: Admin → Manufacturer → Salesman → Shopkeeper → Customer</li>
                <li>Product ownership transfers</li>
                <li>Status history and audit logs</li>
                <li>Document center for product attachments</li>
                <li>Real-time notifications via WebSocket</li>
                <li>Multi-tenant environment for separated organizational data</li>
                <li>TrackBot — AI-powered chat assistant</li>
                <li>Dashboard analytics and insights</li>
              </ul>
              <p className="mb-4">
                TrackSure is provided as a hosted software-as-a-service (SaaS) platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Account Registration & Security</h2>
              <p className="mb-2">You are responsible for:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Maintaining confidentiality of your login credentials</li>
                <li>All actions under your account</li>
                <li>Updating information to keep it accurate</li>
              </ul>
              <p className="mb-4">
                We may suspend accounts that violate these Terms or pose security risks.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. User Roles & Responsibilities</h2>
              <p className="mb-4">
                TrackSure implements strict Role-Based Access Control (RBAC).
              </p>
              <p className="mb-2">Users agree to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Only perform actions allowed by their assigned role</li>
                <li>Not attempt to bypass permissions or access other tenant data</li>
                <li>Ensure uploaded documents and product data are lawful and non-harmful</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Data You Provide (User Content)</h2>
              <p className="mb-2">"User Content" includes:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Product data</li>
                <li>QR scan events</li>
                <li>Ownership records</li>
                <li>Uploaded documents</li>
                <li>Messages to TrackBot</li>
                <li>Activity logs</li>
              </ul>
              <p className="mb-4">
                You retain ownership of your data.
              </p>
              <p className="mb-4">
                You grant TrackSure a license to store, process, and analyze User Content solely for providing the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. AI Services (TrackBot)</h2>
              <p className="mb-4">
                TrackBot may use third-party AI providers (e.g., OpenAI, Anthropic, others) to process messages.
              </p>
              <p className="mb-2">You acknowledge:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>AI responses may not always be accurate</li>
                <li>Do not rely solely on AI outputs for critical decisions</li>
                <li>We may limit or suspend AI usage</li>
                <li>AI messages are processed under your tenant context</li>
                <li>We may use anonymized/aggregated interaction data to improve the AI experience.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Acceptable Use Policy</h2>
              <p className="mb-2">You agree not to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Upload harmful, illegal, or copyrighted content without rights</li>
                <li>Reverse engineer, scrape, or disrupt the Service</li>
                <li>Attempt to access other tenants' data</li>
                <li>Abuse the notification system</li>
                <li>Upload malware or malicious files to Cloudinary</li>
              </ul>
              <p className="mb-4">
                We may suspend or terminate accounts violating this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Payment & Subscriptions (If Applicable)</h2>
              <p className="mb-2">If you upgrade to a paid plan:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>All fees are billed based on your selected subscription</li>
                <li>Fees are non-refundable unless required by law</li>
                <li>Prices may be updated with reasonable notice</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Availability & Service Modifications</h2>
              <p className="mb-2">We may:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Modify features</li>
                <li>Add/remove functionality</li>
                <li>Suspend service for maintenance</li>
              </ul>
              <p className="mb-4">
                We aim to minimize disruptions, but uptime is not guaranteed.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Intellectual Property</h2>
              <p className="mb-2">TrackSure retains all rights to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Software</li>
                <li>Logos, branding, UI</li>
                <li>Backend, API, database architecture</li>
                <li>AI assistant features</li>
                <li>Documentation</li>
              </ul>
              <p className="mb-4">
                Your User Content remains yours.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">12. Termination</h2>
              <p className="mb-2">We may terminate or suspend your access if:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>You violate these Terms</li>
                <li>You misuse the system</li>
                <li>You compromise security or data integrity</li>
              </ul>
              <p className="mb-2">You may stop using TrackSure at any time.</p>
              <p className="mb-2">Upon termination:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Access to your account stops</li>
                <li>We may retain data as required for legal/audit purposes</li>
                <li>You may request data export depending on your plan</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">13. Disclaimers</h2>
              <p className="mb-4">
                TrackSure is provided "AS IS" without warranties of any kind.
              </p>
              <p className="mb-2">We do not guarantee:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Uninterrupted service</li>
                <li>Accuracy of AI responses</li>
                <li>Accuracy of product status or lifecycle data supplied by third parties</li>
                <li>That documents uploaded by users are safe or authentic</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">14. Limitation of Liability</h2>
              <p className="mb-4">
                To the fullest extent permitted by law:
              </p>
              <p className="mb-4">
                TrackSure is not liable for lost profits, data loss, damages from incorrect product information, or indirect damages.
              </p>
              <p className="mb-4">
                Our total liability in any claim is limited to the amount you paid in the last 12 months (or $100 if on a free plan).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">15. Governing Law</h2>
              <p className="mb-4">
                These Terms are governed by the laws of:
              </p>
              <p className="mb-4 italic text-muted-foreground">
                [Insert Country + Province/State]
              </p>
              <p className="mb-4">
                Any disputes will be handled in the courts of that jurisdiction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">16. Changes to Terms</h2>
              <p className="mb-4">
                We may update these Terms at any time. Continued use of the Service means you accept the updated Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">17. Contact</h2>
              <p className="mb-4">
                For questions about these Terms:
              </p>
              <p className="mb-4 italic text-muted-foreground">
               gulammuhammadahmad216@gmail.com
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

