import React , {useState} from 'react';
const axios = require('axios');

// installed using npm install buffer --save
window.Buffer = window.Buffer || require("buffer").Buffer;

// a React functional component, used to create a simple upload input and button

const Upload = () => {

    const [selectedFile, setSelectedFile] = useState(null);

    async function getUser() {
        try {
          const response = await axios.post('http://localhost:3026', {username: "test"});
          console.log(response);
        } catch (error) {
          console.error(error);
        }
      }

    const uploadImage = async file => {
                try {
                    console.log("Upload Image", file);
                    console.log(handleFileInput);
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
    
    const handleFileInput = (e) => {
        setSelectedFile(e.target.files[0]);
    }

    return ( 
    <div>
        <div>React S3 File Upload</div>
        <input type="file" onChange={handleFileInput} />
        <br></br>
        <button onClick={() => getUser()}>Request</button>
        <button onClick={() => uploadImage(selectedFile)}> Upload to S3</button>
    </div>
    );
}

export default Upload;