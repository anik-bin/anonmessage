import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            AnonMessage
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Share anonymous messages with your friends and colleagues. 
            Discover what others really think in a safe, fun environment.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/sign-in">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Create New Message
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="outline">
                Check Messages
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose AnonMessage?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-blue-600 text-2xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">100% Anonymous</h3>
              <p className="text-gray-600">
                Share your thoughts without revealing your identity. Your messages are completely private.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-blue-600 text-2xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Quick & Easy</h3>
              <p className="text-gray-600">
                Create and share messages in seconds. No sign-up required to receive messages.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-blue-600 text-2xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Perfect for Any Occasion</h3>
              <p className="text-gray-600">
                Whether it's feedback, compliments, or fun messages, Mystery Message is the perfect platform.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-4">1</div>
            <h3 className="text-xl font-semibold mb-2">Create a Message</h3>
            <p className="text-gray-600">
              Write your anonymous message and get a unique link to share.
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-4">2</div>
            <h3 className="text-xl font-semibold mb-2">Share the Link</h3>
            <p className="text-gray-600">
              Send the link to your friends, colleagues, or anyone you want to hear from.
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-4">3</div>
            <h3 className="text-xl font-semibold mb-2">Receive Messages</h3>
            <p className="text-gray-600">
              Check your messages anytime using your unique link.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Create your first anonymous message now and discover what others have to say.
          </p>
          <Link href="/sign-in">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 