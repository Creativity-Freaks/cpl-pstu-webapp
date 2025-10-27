import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const AdminTestimonials = () => {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from("testimonials")
          .select("id, name, role, message, avatar_url, approved")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setTestimonials(data);
      } catch (err) {
        console.error("Error fetching testimonials:", err);
        setError(err.message);
      }
    };

    fetchTestimonials();
  }, []);

  const handleApprove = async (id) => {
    try {
      const { error } = await supabase
        .from("testimonials")
        .update({ approved: true })
        .eq("id", id);

      if (error) throw error;

      setTestimonials((prev) =>
        prev.map((testimonial) =>
          testimonial.id === id ? { ...testimonial, approved: true } : testimonial
        )
      );
    } catch (err) {
      console.error("Error approving testimonial:", err);
      alert("Failed to approve testimonial. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from("testimonials")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setTestimonials((prev) => prev.filter((testimonial) => testimonial.id !== id));
    } catch (err) {
      console.error("Error deleting testimonial:", err);
      alert("Failed to delete testimonial. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
      >
        Back to Admin Dashboard
      </button>

      <h1 className="text-2xl font-bold mb-6">Admin - Manage Testimonials</h1>
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Role</th>
            <th className="border border-gray-300 px-4 py-2">Message</th>
            <th className="border border-gray-300 px-4 py-2">Avatar</th>
            <th className="border border-gray-300 px-4 py-2">Approved</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {testimonials.map((testimonial) => (
            <tr key={testimonial.id}>
              <td className="border border-gray-300 px-4 py-2">{testimonial.name}</td>
              <td className="border border-gray-300 px-4 py-2">{testimonial.role}</td>
              <td className="border border-gray-300 px-4 py-2">{testimonial.message}</td>
              <td className="border border-gray-300 px-4 py-2">
                {testimonial.avatar_url ? (
                  <img
                    src={`${supabase.storage.from("avatars").getPublicUrl(testimonial.avatar_url).data.publicUrl}`}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  "N/A"
                )}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {testimonial.approved ? "Yes" : "No"}
              </td>
              <td className="border border-gray-300 px-4 py-2 space-x-2">
                {!testimonial.approved && (
                  <button
                    onClick={() => handleApprove(testimonial.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Approve
                  </button>
                )}
                <button
                  onClick={() => handleDelete(testimonial.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTestimonials;