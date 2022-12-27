import React, { useEffect, useRef, useState } from "react";
import "../styles/browse.scss";
import {
  useProvider,
  useSigner,
  useAccount,
  useNetwork,
  useContract,
} from "wagmi";
import { CONTRACT_ADDRESS } from "../config";
import fluidPay_api from "../artifacts/fluidPay.json";
import { useLocation } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import qr1 from "../assets/wap.png";
import { useParams } from "react-router-dom";

function Browse() {
  const [url, setUrl] = useState("");
  const [endUrl, setEndUrl] = useState("");
  const { chain } = useNetwork();
  const location = useLocation();
  const provider = useProvider();
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const dataFetchedRef = useRef(false);
  const connectedContract = useContract({
    address: CONTRACT_ADDRESS,
    abi: fluidPay_api,
    signerOrProvider: provider,
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

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
  const endQrcode = (
    <QRCodeCanvas
      id="qrCode"
      value={endUrl}
      size={300}
      bgColor={"#fff"}
      level={"H"}
    />
  );
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    //function to fetch data
    const fetch = async () => {
      console.log("inside fetch");
      //   platformsAddresses_array =
      //     await connectedContract.getAllPlatformsAddress();
      //   console.log("platfroms addresses");
      //   console.log(platformsAddresses_array);
      console.log(location.state.address);
      let metadata_tx = await connectedContract.getPlatformData(
        location.state.address
      );

      console.log(metadata_tx);
      if (!data.length > 0)
        data.push({
          address: metadata_tx[0],
          name: metadata_tx[1],
          image: metadata_tx[2],
          description: metadata_tx[3],
          ph_address: metadata_tx[4],
          charges: parseInt(metadata_tx[5]),
        });
      setLoading(false);
      // setData(data);

      console.log(parseInt(metadata_tx[5]));
      console.log(data);

      //   console.log(metadata_tx);

      console.log("Platforms's metadata");
      //   console.log(metadata);
      console.log(`http://localhost:3000/organization/${metadata_tx[0]}`);
      setUrl(`http://localhost:3000/organization/${metadata_tx[0]}`);
      setEndUrl(
        `http://localhost:3000/organization/stream-and/${metadata_tx[0]}`
      );
    };
    fetch();
    return () => {
      setData(data);
    };
  }, []);

  // const fetchFromAddress = async () => {
  //   console.log("inside fetch");
  //   //   platformsAddresses_array =
  //   //     await connectedContract.getAllPlatformsAddress();
  //   //   console.log("platfroms addresses");
  //   //   console.log(platformsAddresses_array);
  //   // console.log(location.state.address);
  //   let metadata_tx = await connectedContract.getPlatformData(address);

  //   console.log(metadata_tx);
  //   if (!data.length > 0)
  //     data.push({
  //       address: metadata_tx[0],
  //       name: metadata_tx[1],
  //       image: metadata_tx[2],
  //       description: metadata_tx[3],
  //       ph_address: metadata_tx[4],
  //       charges: parseInt(metadata_tx[5]),
  //     });
  //   setLoading(false);
  //   // setData(data);

  //   console.log(parseInt(metadata_tx[5]));
  //   console.log(data);

  //   //   console.log(metadata_tx);

  //   console.log("Platforms's metadata");
  //   //   console.log(metadata);
  // };

  if (loading) return <div>loading...</div>;
  return (
    <>
      <div className="browse-main">
        <h2 className="browse-header">Platform Registered</h2>
        <div className="browse-platform-name">{data[0].name}</div>
        <div className="browse-platform-details">{data[0].description}</div>
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
              <div className="browse-qr-img">{endQrcode}</div>
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
