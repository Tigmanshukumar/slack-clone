import React from "react";

const Button = () => {
  return (
    <button className="relative flex items-center gap-1 bg-white px-8 py-3 bg-inherit rounded-xl font-semibold text-[#6c47ff] cursor-pointer overflow-hidden transition-all duration-700 ease-custom border-2 border-transparent hover:text-white hover:rounded-3xl hover:border-white group hover:duration-700">
      <svg
        viewBox="0 0 24 24"
        className="absolute w-6 fill-[#6c47ff] z-[9] transition-all duration-700 ease-custom -left-1/4 group-hover:left-4 group-hover:fill-white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
      </svg>
      <span className="relative z-[1] transition-all duration-700 ease-custom -translate-x-3 group-hover:translate-x-3">
        Open Chat
      </span>
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-[#7f5aff] rounded-full opacity-0 transition-all duration-700 ease-custom group-hover:w-[220px] group-hover:h-[220px] group-hover:opacity-100" />
      <svg
        viewBox="0 0 24 24"
        className="absolute w-6 fill-[#6c47ff] z-[9] transition-all duration-700 ease-custom right-4 group-hover:-right-1/4 group-hover:fill-white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
      </svg>
    </button>
  );
};

export default Button;