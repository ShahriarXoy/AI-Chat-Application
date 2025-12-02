import React from "react";

const LoadingSkeleton = () => {

  //Styles for the animation
  const skeletonStyle = {
    backgroundColor: "#e0e0e0",
    borderRadius: "4px",
    marginBottom: "10px",
    animation: "shimmer 1.5s infinite linear",
    background: "linear-gradient(to right, #eff1f3 4%, #e2e2e2 25%, #eff1f3 36%)",
    backgroundSize: "1000px 100%",
  };
  // create a style tag for the keyframe since we are using inline styles
  return (
    <div style={{ padding: "10px", border: "1px solid #eee", borderRadius: "8px" }}>
      <style>
        {`
          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }
        `}
      </style>
      <div style={{ ...skeletonStyle, height: "20px", width: "60%" }}></div>
      <div style={{ ...skeletonStyle, height: "15px", width: "90%" }}></div>
      <div style={{ ...skeletonStyle, height: "15px", width: "80%" }}></div>
    </div>
  );
};

export default LoadingSkeleton;