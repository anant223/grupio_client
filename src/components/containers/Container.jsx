import React from "react";

const WrapperContainer = ({ as: Tag = "div", children, className = "" }) => (
  <Tag className={`max-w-7xl mx-auto px-4 sm:px-6 ${className}`}>
    {children}
  </Tag>
);

const BodyContainer = ({ as: Tag = "div", children, className = "" }) => (
  <Tag
    className={`max-w-5xl mx-auto px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-10 ${className}`}
  >
    {children}
  </Tag>
);

const MinContainer  = ({ as: Tag = "div", children, className = "" }) => (
  <Tag className={`max-w-2xl mx-auto px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-10 ${className}`}>
    {children}
  </Tag>
);

export { WrapperContainer, BodyContainer, MinContainer};
