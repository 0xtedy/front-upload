import React, { useState } from "react";
import "../styles/editor.scss";
import { TwitterPicker } from "react-color";
import DrawingPanel from "./DrawingPanel";
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import Web3 from "web3";
import WalletConnect from '@walletconnect/web3-provider'
const axios = require('axios');


export default function Editor() {

  const [hideOptions, setHideOptions] = useState(false);
  const [hideDrawingPanel, setHideDrawingPanel] = useState(true);
  const [buttonText, setButtonText] = useState("start drawing");
  const [selectedColor, setColor] = useState("#f44336");
  const [account, setAccount] = useState('')
  const [connection, setConnection] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)

  const verifyAddress = async (_address) => {
    try {
      const response = await axios.post('http://localhost:3026/checkwl', {address: _address});
      console.log(response.data);
      if (!response.data) {
      
        alert("sorry you are not whitelisted")
      } 
    } catch (error) {
      console.error(error);
    }
  }

  async function getWeb3Modal() {
    const web3Modal = new Web3Modal({
      disableInjectedProvider: false,
      cacheProvider: false,
      providerOptions: { walletconnect: 
        {
        display: {
            name: "Mobile",
            description: "Scan qrcode with your mobile wallet"
          },
        package: WalletConnect,
        options: {
          infuraId: "ff5464378a8e4ad9aea0993437a85eaf" 
        }
      }
    }
    })
    return web3Modal
  }

  async function connect() {
    try {
    const web3Modal = await getWeb3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const accounts = await provider.listAccounts()
    setConnection(connection)
    setAccount(accounts[0])
    verifyAddress(accounts[0].toLowerCase()) 
    initializeDrawingPanel()
    } catch (err) {
      console.log(err)
    }
  }

  async function signIn() {
    const authData = await fetch(`/api/authenticate?address=${account}`)
    const user = await authData.json()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const signature = await signer.signMessage(user.nonce.toString())
    const response = await fetch(`/api/verify?address=${account}&signature=${signature}`)
    const data = await response.json()
    setLoggedIn(data.authenticated)
  }

  function initializeDrawingPanel() {
    setHideOptions(!hideOptions);
    setHideDrawingPanel(!hideDrawingPanel);

    buttonText === "start drawing"
      ? setButtonText("reset")
      : setButtonText("start drawing");
  }

  function changeColor(color) {
    setColor(color.hex);
  }

  return (
    <div id="editor">
      <h1>Pixel Editor</h1>
      {
        !connection && <button onClick={connect}> Connect Wallet</button>
      }
      {
        connection && (<button onClick={initializeDrawingPanel} className="button"> {buttonText} </button>)
      }

      {hideOptions && (
        <TwitterPicker color={selectedColor} onChangeComplete={changeColor} />
      )}

      {hideOptions && (
        <DrawingPanel
          width="32"
          height="32"
          selectedColor={selectedColor}
        />
      )}
    </div>
  );
}




