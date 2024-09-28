import React from 'react';

const Loader: React.FC = () => (
  <div
    style={{
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundColor: '#000', // Solid black background
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000,
    }}
  >
    <div className="loading-window">
      <div className="car">
        <div className="strike"></div>
        <div className="strike strike2"></div>
        <div className="strike strike3"></div>
        <div className="strike strike4"></div>
        <div className="strike strike5"></div>
        <div className="car-detail spoiler"></div>
        <div className="car-detail back"></div>
        <div className="car-detail center"></div>
        <div className="car-detail center1"></div>
        <div className="car-detail front"></div>
        <div className="car-detail wheel"></div>
        <div className="car-detail wheel wheel2"></div>
      </div>
      <div className="text">
        <span>Loading</span><span className="dots">...</span>
      </div>
    </div>

    <style>
      {`
        @keyframes spin {
          0% { transform: translate(2px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -3px) rotate(36deg); }
          20% { transform: translate(-2px, 0px) rotate(72deg); }
          30% { transform: translate(1px, 2px) rotate(108deg); }
          40% { transform: translate(1px, -1px) rotate(144deg); }
          50% { transform: translate(-1px, 3px) rotate(180deg); }
          60% { transform: translate(-1px, 1px) rotate(216deg); }
          70% { transform: translate(3px, 1px) rotate(252deg); }
          80% { transform: translate(-2px, -1px) rotate(288deg); }
          90% { transform: translate(2px, 1px) rotate(324deg); }
          100% { transform: translate(1px, -2px) rotate(360deg); }
        }

        @keyframes speed {
          0% { transform: translate(2px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -3px) rotate(-1deg); }
          20% { transform: translate(-2px, 0px) rotate(1deg); }
          30% { transform: translate(1px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 3px) rotate(-1deg); }
          60% { transform: translate(-1px, 1px) rotate(0deg); }
          70% { transform: translate(3px, 1px) rotate(-1deg); }
          80% { transform: translate(-2px, -1px) rotate(1deg); }
          90% { transform: translate(2px, 1px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }

        @keyframes strikes {
          from { left: 25px; }
          to { left: -80px; opacity: 0; }
        }

        @keyframes dots {
          from { width: 0px; }
          to { width: 15px; }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .fadeIn {
          animation: fadeIn 0.4s both;
        }

        .loading-window {
          background: #000; /* Black background */
          border-radius: 6px;
          border: 3px solid #fff; /* Border color */
          color: #fff; /* Text color */
          height: 200px;
          width: 300px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          position: relative;
          box-shadow: 0 0 20px 5px #7cd2e1; /* Dark slate gray shadow */
        }

        .text {
          font-size: 28px;
          position: absolute;
          bottom: 20px;
        }

        .dots {
          display: inline-block;
          width: 5px;
          overflow: hidden;
          vertical-align: bottom;
          animation: dots 1.5s linear infinite;
        }

        .car {
          position: relative;
          width: 117px;
          height: 42px;
        }

        .strike {
          position: absolute;
          width: 11px;
          height: 1px;
          background: #fff;
          animation: strikes 0.2s linear infinite;
        }

        .strike2 { top: 11px; animation-delay: 0.05s; }
        .strike3 { top: 22px; animation-delay: 0.1s; }
        .strike4 { top: 33px; animation-delay: 0.15s; }
        .strike5 { top: 44px; animation-delay: 0.2s; }

        .car-detail {
          position: absolute;
          display: block;
          background: #fff; /* White car color */
          animation: speed 0.5s linear infinite;
        }

        .spoiler {
          width: 0;
          height: 0;
          top: 7px;
          background: none;
          border: 20px solid transparent;
          border-bottom: 8px solid #fff;
          border-left: 20px solid #fff;
        }

        .back {
          height: 20px;
          width: 92px;
          top: 15px;
          left: 0px;
        }

        .center {
          height: 35px;
          width: 75px;
          left: 12px;
          border-top-left-radius: 30px;
          border-top-right-radius: 45px 40px;
          border: 4px solid #fff;
          background: none;
          box-sizing: border-box;
        }

        .center1 {
          height: 35px;
          width: 35px;
          left: 12px;
          border-top-left-radius: 30px;
        }

        .front {
          height: 20px;
          width: 50px;
          top: 15px;
          left: 67px;
          border-top-right-radius: 50px 40px;
          border-bottom-right-radius: 10px;
        }

        .wheel {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          top: 20px;
          left: 12px;
          border: 3px solid #333;
          background: linear-gradient(45deg, transparent 45%, #fff 46%, #fff 54%, transparent 55%), linear-gradient(-45deg, transparent 45%, #fff 46%, #fff 54%, transparent 55%), linear-gradient(90deg, transparent 45%, #fff 46%, #fff 54%, transparent 55%), linear-gradient(0deg, transparent 45%, #fff 46%, #fff 54%, transparent 55%), radial-gradient(#fff 29%, transparent 30%, transparent 50%, #fff 51%), #333;
          animation: spin 1s linear infinite;
        }

        .wheel2 {
          left: 82px;
        }
      `}
    </style>
  </div>
);

export default Loader;
