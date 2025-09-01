import React from "react";

const Star = ({ filled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${filled ? 'text-teal-500' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.035a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.035a1 1 0 00-1.175 0l-2.802 2.035c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const Stars = ({ rating = 0 }) => (
  <div className="flex items-center gap-1">
    {[1,2,3,4,5].map(n => <Star key={n} filled={n <= Math.round(rating)} />)}
  </div>
);

const ReviewCard = ({ review }) => {
  const doctorName = review?.doctorId?.name || review?.doctor?.name || "Doctor";
  const doctorDept = review?.doctorId?.department || review?.doctor?.department || "";
  const doctorImg = review?.doctorId?.imgUrl || review?.doctor?.imgUrl || "https://via.placeholder.com/64";
  const patientName = review?.patientId?.name || review?.patient?.name || "Patient";
  const rating = review?.rating || 0;
  const text = review?.review || review?.text || "";
  const date = review?.createdAt ? new Date(review.createdAt).toLocaleDateString() : "";

  return (
    <div className="relative rounded-xl bg-white border border-gray-200 shadow-sm p-5 transition-all hover:shadow-md">
    
      <div className="flex items-center gap-3">
        <img src={doctorImg} alt={doctorName} className="w-12 h-12 rounded-full object-cover ring-2 ring-teal-200" />
        <div>
          <div className="font-semibold text-gray-900">Dr. {doctorName}</div>
          {doctorDept && <div className="text-xs text-gray-500">{doctorDept}</div>}
        </div>
        <div className="ml-auto text-xs text-gray-400">{date}</div>
      </div>
      <div className="flex items-center justify-between mt-2">
        <Stars rating={rating} />
        <div className="text-xs text-gray-500">by {patientName}</div>
      </div>
      <p className="text-sm text-gray-700 mt-3 line-clamp-4">{text}</p>
    </div>
  );
};

export default ReviewCard;


