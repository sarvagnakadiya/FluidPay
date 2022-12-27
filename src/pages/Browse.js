import React, { useEffect, useRef, useState } from "react";
import "../styles/browse.scss";
import qr1 from "../assets/wap.png";
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

function Browse() {
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
    };
    fetch();
    return () => {
      setData(data);
    };
  }, []);

  const fetchFromAddress = async () => {
    console.log("inside fetch");
    //   platformsAddresses_array =
    //     await connectedContract.getAllPlatformsAddress();
    //   console.log("platfroms addresses");
    //   console.log(platformsAddresses_array);
    // console.log(location.state.address);
    let metadata_tx = await connectedContract.getPlatformData(address);

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
  };

  if (loading)
    return (
      <div>
        <button className="browse-btn" onClick={() => fetchFromAddress()}>
          Download QR Code
        </button>
      </div>
    );
  return (
    <>
      <div className="browse-main">
        <h2 className="browse-header">Platform Registered</h2>
        <div className="browse-platform-name">{data[0].name}</div>
        <div className="browse-platform-details">{data[0].description}</div>
        <div className="browse-qr-main">
          <div className="browse-qr-start">
            <h3 className="browse-qr-header">Start Stream</h3>
            <img className="browse-qr-img" src={qr1} />
          </div>
          <div className="browse-qr-end">
            <h3 className="browse-qr-header">End Stream</h3>
            <img className="browse-qr-img" src={qr1} />
          </div>
        </div>
        <button className="browse-btn">Download QR Code</button>
      </div>
    </>
  );
}

export default Browse;
