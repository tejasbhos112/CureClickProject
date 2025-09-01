import React from "react";

const SectionHeader = ({ eyebrow, title, subtitle, align = "center" }) => {
  const alignment = align === "left" ? "text-left" : align === "right" ? "text-right" : "text-center";
  return (
    <div className={`mb-6 ${alignment}`}>
      {eyebrow && (
        <h1 className="sm:text-xl text-lg text-teal-600 font-semibold uppercase tracking-wider mb-2">{eyebrow}</h1>
      )}
      {title && (
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold" style={{ color: "#010f26" }}>
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="text-gray-600 max-w-3xl mx-auto mt-1">{subtitle}</p>
      )}
    </div>
  );
};

export default SectionHeader;


