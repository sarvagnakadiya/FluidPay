import React, { useState, useEffect } from "react";
import "../styles/browse.scss";
import { QRCodeCanvas } from "qrcode.react";
import qr1 from "../assets/wap.png";
import { useParams } from "react-router-dom";

function Browse() {
  const [url, setUrl] = useState("");
  const { id } = useParams();

  const downloadQRCode = (e) => {
    e.preventDefault();
    setUrl("");
  };

  const qrCodeEncoder = (e) => {
    setUrl(e.target.value);
  };

  const qrcode = (
    <QRCodeCanvas
      id="qrCode"
      value={url}
      size={300}
      bgColor={"#fff"}
      level={"H"}
    />
  );

  useEffect(() => {
    setUrl(window.location);
  }, []);

  return (
    <>
      <div className="browse-main">
        <h2 className="browse-header">Platform Registered</h2>
        <div className="browse-platform-name">Platform Name</div>
        <div className="browse-platform-details">Platform Details</div>
        <div className="browse-qr-main">
          <div className="browse-qr-start">
            <h3 className="browse-qr-header">Start Stream</h3>
            <div className="qrcode__container">
              <div className="browse-qr-img">{qrcode}</div>
              <div className="input__group">
                <form onSubmit={downloadQRCode}>
                  {/* <label>URL</label>
                  <input
                    type="text"
                    value={url}
                    onChange={qrCodeEncoder}
                    placeholder="https://qr.com"
                  /> */}
                  {/* <button type="submit" disabled={!url}>
                    Download QR code
                  </button> */}
                </form>
              </div>
            </div>
          </div>
          <div className="browse-qr-end">
            <h3 className="browse-qr-header">End Stream</h3>
            <div className="qrcode__container">
              <div className="browse-qr-img">{qrcode}</div>
              <div className="input__group">
                <form onSubmit={downloadQRCode}>
                  {/* <label>URL</label>
                  <input
                    type="text"
                    value={url}
                    onChange={qrCodeEncoder}
                    placeholder="https://qr.com"
                  /> */}
                  {/* <button type="submit" disabled={!url}>
                    Download QR code
                  </button> */}
                </form>
              </div>
            </div>
          </div>
        </div>
        <button className="browse-btn">Download QR Code</button>
      </div>
    </>
  );
}

export default Browse;
