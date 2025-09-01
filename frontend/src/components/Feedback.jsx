import { useEffect, useState } from "react";
import axios from "axios";

const Feedback = ({ dId }) => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [newFeedback, setNewFeedback] = useState({
    rating: 0,
    text: "",
  });
  const [form, setForm] = useState(false);
  const [error, setError] = useState("");

  
  const getReviews = async () => {
    try {
      const res = await axios.get(`/api/reviews/${dId}`, {
        withCredentials: true,
      });
      setFeedbackList(res.data);
    } catch (error) {
      console.error("Error fetching reviews:", error.message);
    }
  };

  useEffect(() => {
    getReviews();
  }, [dId]);

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFeedback((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value,
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newFeedback.rating === 0) {
      setError("Please select a rating");
      return;
    }
    if (!newFeedback.text.trim()) {
      setError("Please enter your feedback text");
      return;
    }

    try {
      const res = await axios.post(
        "/api/reviews",
        {
          doctorId: dId,
          rating: newFeedback.rating,
          review: newFeedback.text,
        },
        { withCredentials: true }
      );

     
      setFeedbackList((prev) => [res.data, ...prev]);
      setNewFeedback({ rating: 0, text: "" });
      setForm(false);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error submitting feedback");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Patient Feedback</h2>

        {!form && (
          <button
            className="bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg px-5 py-2.5 transition-all duration-200 transform hover:scale-105 shadow-md"
            onClick={() => setForm(true)}
          >
            Give Feedback
          </button>
        )}
      </div>

      {/* Feedback List */}
      <div className="space-y-4 mb-8">
        {feedbackList.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
            <p className="text-gray-500 italic">
              No feedback yet. Be the first to share!
            </p>
          </div>
        ) : (
          feedbackList.map((feed) => (
            <div
              key={feed._id}
              className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <div className="rating rating-sm">
                    {[...Array(5)].map((_, i) => (
                      <input
                        key={i}
                        type="radio"
                        name={`rating-${feed._id}`}
                        className="mask mask-star-2 bg-orange-400"
                        readOnly
                        checked={feed.rating === i + 1}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400">
                    {new Date(feed.createdAt).toLocaleDateString()}
                  </span>
                  {feed.patientId?.name && (
                    <p className="text-xs text-gray-500 mt-1">
                      - {feed.patientId.name}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-gray-700 mb-1 whitespace-pre-line">
                {feed.review}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Feedback Form */}
      {form && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Share Your Feedback
          </h3>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Rating
            </label>
            <div className="rating rating-md">
              {[...Array(5)].map((_, i) => (
                <input
                  key={i}
                  type="radio"
                  name="rating"
                  value={i + 1}
                  onChange={handleInputChange}
                  checked={newFeedback.rating === i + 1}
                  className="mask mask-star-2 bg-orange-400 hover:bg-orange-500"
                />
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Your Feedback
            </label>
            <textarea
              name="text"
              placeholder="Share your experience..."
              required
              value={newFeedback.text}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              rows="5"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
              onClick={() => {
                setForm(false);
                setError("");
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-all transform hover:scale-105 shadow-md"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Feedback;
