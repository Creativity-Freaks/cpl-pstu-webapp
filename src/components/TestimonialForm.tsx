import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { Star, User, Mail, Briefcase, MessageSquare, Image } from "lucide-react";

const TestimonialForm = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [avatar, setAvatar] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching testimonials:", error);
      } else {
        setTestimonials(data);
      }
    };

    fetchTestimonials();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let avatarUrl = null;

      if (avatar) {
        const { data, error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(`public/${Date.now()}_${avatar.name}`, avatar);

        if (uploadError) throw new Error(`Avatar upload failed: ${uploadError.message}`);
        avatarUrl = data.path;
      }

      const { error: insertError } = await supabase.from("testimonials").insert({
        name,
        role,
        email,
        message,
        rating,
        avatar_url: avatarUrl,
        approved: false,
      });

      if (insertError) throw new Error(`Database insertion failed: ${insertError.message}`);

      alert("Testimonial submitted successfully!");
      setName("");
      setRole("");
      setEmail("");
      setMessage("");
      setRating(0);
      setAvatar(null);

      // Refresh testimonials
      const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
      setTestimonials(data);
    } catch (err) {
      console.error("Error submitting testimonial:", err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 text-gray-800">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <h1 className="text-5xl font-bold text-center mb-6 text-gray-900">Share Your Experience</h1>
        <p className="text-center text-gray-600 mb-8">We value your feedback and appreciate your support!</p>
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 bg-white p-8 rounded-lg shadow-xl">
          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-700" />
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
              </div>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border rounded p-2 bg-gray-100 text-gray-700"
              />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5 text-gray-700" />
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role / Company</label>
              </div>
              <input
                type="text"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., Player, Organizer"
                className="w-full border rounded p-2 bg-gray-100 text-gray-700"
              />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-gray-700" />
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email (optional)</label>
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border rounded p-2 bg-gray-100 text-gray-700"
              />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <Image className="h-5 w-5 text-gray-700" />
                <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">Profile Image</label>
              </div>
              <input
                type="file"
                id="avatar"
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files[0])}
                className="w-full border rounded p-2 bg-gray-100 text-gray-700"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-gray-700" />
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Testimonial</label>
          </div>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            placeholder="Describe your experience..."
            className="w-full border rounded p-2 bg-gray-100 text-gray-700"
          />

          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-gray-700" />
            <label className="block text-sm font-medium text-gray-700">Rating</label>
          </div>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                className={`w-10 h-10 rounded-full ${rating >= star ? "bg-gray-700 text-white" : "bg-gray-300 text-gray-700"}`}
              >
                ⭐
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 w-full hover:bg-gray-800"
          >
            {isSubmitting ? "Submitting..." : "Submit Testimonial"}
          </button>
        </form>

        <section className="mt-12">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((testimonial) => (
              <div key={testimonial.id} className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
                <blockquote className="text-lg italic">"{testimonial.message}"</blockquote>
                <div className="flex items-center mt-4">
                  {testimonial.avatar_url ? (
                    <img
                      src={testimonial.avatar_url}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center mr-4">
                      <User className="text-white h-6 w-6" />
                    </div>
                  )}
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TestimonialForm;