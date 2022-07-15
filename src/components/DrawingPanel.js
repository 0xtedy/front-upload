// @ts-ignore

import React, { useRef } from "react";
import Row from "./Row";
var htmlToImage = require('html-to-image');
const axios = require('axios');



export default function DrawingPanel(props) {
  const { width, height, selectedColor } = props;

  const panelRef = useRef();

  let rows = [];

  for (let i = 0; i < height; i++) {
    rows.push(<Row key={i} width={width} selectedColor={selectedColor} />);
  }


  const uploadData = async (file) => {
      try {
        console.log(typeof(file))
        const response = await axios.post('http://localhost:3026', {data: file.toString()});
        console.log(response);
      } catch (error) {
        console.error(error);
      }
  }




  const uploadImage = async (file) => {
    try {
        console.log("Upload Image", file);
        const formData = new FormData();
        formData.append("filename", file);
        formData.append("destination", "images");
        const config = {
          headers: {
            "content-type": "multipart/form-data"
          }
        };
        const API = "group_util_uploadImage";
        const HOST = "https://us-central1-wisy-dev.cloudfunctions.net";
        let url = `${HOST}/${API}`;
        /* TEST */
        url = 'http://localhost:3026';
    
        const result = await axios.post(url, formData, config);
        console.log("Result: ", result);
      } catch (error) {
        console.error(error);
      }
}  

  const exportCompAsPNG = () => {
    const _comp = "pixels";
    const comp = document.getElementById(_comp);
    console.log(comp);
    htmlToImage.toPng(comp)
  .then(function (dataUrl) {
    console.log(dataUrl)
    var img = new Image();
    img.src = dataUrl;
    uploadData(img.src);
  })
  .catch(function (error) {
    console.error('oops, something went wrong!', error);
  });
  }

  return (
    <div id="drawingPanel">
      <div id="pixels" ref={panelRef}>
        {rows}
      </div>
      <button onClick={() => exportCompAsPNG()} className="button">
        Export as PNG
      </button>
    </div>
  );
}
