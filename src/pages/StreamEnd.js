import { useParams } from "react-router-dom";
import fluidPay_api from "../artifacts/fluidPay.json";
import { CONTRACT_ADDRESS } from "../config";
import { useContract, useProvider, useSigner } from "wagmi";
import React, { useEffect, useRef, useState } from "react";
import { Framework } from "@superfluid-finance/sdk-core";

function StreamEnd() {
  const provider = useProvider();
  const { data: signer } = useSigner();
  const dataFetchedRef = useRef(false);
  //   const platform_address = "0xcc920c851327AF767b4bf770e3b2C2ea50B90fde";
  const { id } = useParams();
  console.log(id);
  const connectedContract = useContract({
    address: CONTRACT_ADDRESS,
    abi: fluidPay_api,
    signerOrProvider: provider,
  });
  const [duration, setDuration] = useState("");
  let metadata = [];

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    //function to fetch data
    const fetch = async () => {
      console.log("inside fetch");

      let metadata_tx = await connectedContract.getPlatformData(id);
      metadata.push(metadata_tx);
      console.log(metadata[0].platformAddress);
      console.log(parseInt(metadata_tx[5]));
      console.log(metadata_tx);
      console.log("Platforms's metadata");
    };

    // fetch();
    deleteStream();
    return () => {
      dataFetchedRef.current = true;
    };
  }, []);
  const deleteStream = async () => {
    console.log(signer);
    console.log(provider);
    const userAddress = await signer.getAddress();
    console.log(userAddress);
    const sf = await Framework.create({
      chainId: 5,
      provider: provider,
    });
    try {
      const ethx = await sf.loadSuperToken("ETHx");
      console.log("token address");
      console.log(ethx.address);

      //call to get stream start date
      const start = await sf.cfaV1.getFlow({
        superToken: ethx.address,
        sender: await signer.getAddress(),
        receiver: id,
        providerOrSigner: signer,
      });
      console.log(start);
      console.log("starttime:" + Date.parse(start.timestamp));
      // setStartTime(Date.parse(start.timestamp));
      const startTime = Date.parse(start.timestamp);

      if (start) {
        //to delete stream
        const deleteFlowOperation = sf.cfaV1.deleteFlow({
          flowRate: "10000",
          sender: await signer.getAddress(),
          receiver: id,
          superToken: ethx.address,
          // userData?: string
        });

        console.log("Deleting your stream...");

        const result = await deleteFlowOperation.exec(signer);
        const receipt = await result.wait();
        console.log("transaction completed" + receipt);

        console.log(
          `Congrats - you've just deleted your money stream!
           Network: Kovan
           Super Token: DAIx
           Sender: 0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721
           Receiver: 0xbFc4A28D8F1003Bec33f4Fdb7024ad6ad1605AA8
        `
        );
        if (receipt) {
          let end = await sf.cfaV1.getAccountFlowInfo({
            superToken: "0x5943F705aBb6834Cad767e6E4bB258Bc48D9C947",
            account: await signer.getAddress(),
            providerOrSigner: signer,
          });
          console.log(end);
          // console.log("end time:" + Date.parse(end.timestamp));
          // setEndTime(Date.parse(end.timestamp));
          const endTime = Date.parse(end.timestamp);
          console.log("startTime: " + startTime);
          console.log("endtime: " + endTime);
          const totalDuration = (endTime - startTime) / 1000;

          console.log("---------------------------------");
          console.log(totalDuration);
          setDuration(totalDuration);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      Stream End
      <button onClick={() => deleteStream()}>End Stream</button>
      <h1>Stream duration: {duration}</h1>
      <h1>Tokens transferred: {duration * 1000}</h1>
    </div>
  );
}

export default StreamEnd;
