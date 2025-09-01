import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "./constants";
import ReviewCard from "./ReviewCard";

const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTopReviews = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/reviews/top`);
        const list = Array.isArray(res.data) ? res.data : (res.data.reviews || []);
        setReviews(list);
      } catch (e) {
        setError("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };
    fetchTopReviews();
  }, []);

  const desiredCount = 6;
  const safeReviews = Array.isArray(reviews) ? reviews.slice(0, desiredCount) : [];
  const placeholders = Math.max(0, desiredCount - safeReviews.length);

  return (
    <section className="bg-white pt-2 pb-12" id="reviews-section">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10 text-center">
          <h1 className="sm:text-xl text-lg text-teal-600 font-semibold uppercase tracking-wider">Patient Testimonials</h1>
          <h2 className="text-2xl md:text-3xl font-bold text-[#010f26]">What patients are saying</h2>
          <p className="text-gray-600">Words from Those We Care For</p>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {[1,2,3].map(i => <div key={i} className="h-40 bg-white border border-gray-200 rounded-xl animate-pulse" />)}
          </div>
        ) : error ? null : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {safeReviews.map((r) => (
              <ReviewCard key={r._id} review={r} />
            ))}
            {placeholders > 0 && Array.from({ length: placeholders }).map((_, i) => (
              <div key={`placeholder-${i}`} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
                  <div className="flex-1">
                    <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
                  </div>
                  <div className="h-3 w-16 bg-gray-100 rounded animate-pulse ml-auto" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, idx) => (
                      <div key={idx} className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                    ))}
                  </div>
                  <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
                </div>
                <div className="h-16 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;


