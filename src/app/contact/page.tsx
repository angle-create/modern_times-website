import { Metadata } from 'next'
import { ContactForm } from '@/components/contact/contact-form'

export const metadata: Metadata = {
  title: 'お問い合わせ - Modern Times',
  description: 'Modern Timesへのお問い合わせはこちらのフォームからお願いいたします。ご質問、ご要望などお気軽にご連絡ください。',
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">お問い合わせ</h1>
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <p className="text-gray-600 mb-8 text-center">
            ご質問、ご要望などございましたら、下記フォームよりお気軽にお問い合わせください。
            <br />
            通常2営業日以内にご返信いたします。
          </p>
          <ContactForm />
        </div>
      </div>
    </div>
  )
} 