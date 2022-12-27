import { useEffect, useRef } from "react";
import React from "react";
import "../styles/landing.scss";
import HomeImg1 from "../assets/1.png";
import HomeImg2 from "../assets/2.1.png";
import { useNavigate } from "react-router-dom";
import {
  useProvider,
  useSigner,
  useAccount,
  useNetwork,
  useContract,
} from "wagmi";

// import Btn from "../assets/Asset2.svg";

export let metadata = [];

function Landing() {
  const navigate = useNavigate();

  return (
    <>
      <div className="home-main">
        <div className="home-main-top">
          <div className="home-main-top1">Money Flows</div>
          <div className="home-main-top2">Like Water</div>
        </div>
        <img className="home-main-img1" alt="bank" src={HomeImg1} />
        <img className="home-main-img2" alt="cryptoimg" src={HomeImg2} />
        <div className="home-main-mid">
          {/* <div className="home-main-mid1">Hello</div> */}
          <div className="home-main-mid2">
            Scan the QR-code and Pay in stream instead of directly sending it
          </div>

          <button className="home-mid-btn" onClick={() => navigate("/explore")}>
            Let's Go!
          </button>
          {/* <button onClick={() => navigate("/fetch-data")}>
            Route another page
          </button> */}
        </div>
      </div>
    </>
  );
}

export default Landing;
