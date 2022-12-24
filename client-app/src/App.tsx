import React from 'react';
import {ChangeEvent, useRef, useState} from 'react';
import './App.css';
import axios from 'axios';


function App() {
    const [file, setFile] = useState<File>();
    const [fileNames, setFileNames] = useState<string[]>();
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleUploadClick = () => {
        inputRef.current!.click();
    }

    const handleUpload = () => {
        if (file != undefined) {
            console.log(file);
            var formData = new FormData();
            formData.append("file", file);
            axios.post(`http://localhost:8080/fileUpload`, formData, {headers: {'Content-Type': 'multipart/formdata'}})
                .then(res => {
                    console.log(res)
                });
        }
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            return;
        }
        setFile(e.target.files[0]);
    };

    function getAllUploadedNames() {
        let fileNames: string[];
        const promise = axios.get(`http://localhost:8080/getAllUploadedFiles`);
        const dataPromise = promise.then((response) => response.data);
        return dataPromise;
    }


    function refreshListNames() {
        let listNames: string[];
        axios.get(`http://localhost:8080/getAllUploadedFiles`)
            .then((res) => {
                setFileNames(res.data)
            })

    }

    //React.useEffect(getAllUploadedNames().then(res => {setNames(res)}) , []);

    const getAllNames = () => {
        if (fileNames)
            return fileNames.map((namesd) => <li key={namesd}><a href={'http://localhost:8080/getUploadedFile?filename=' + namesd}>{namesd}</a></li>)
            };



    return (
            <div className=" App">
                <header className=" App-header">
                    <div>
                        <a> { file ? `${file.name}` : 'Click to select'} </a>
                        <button onClick={handleUploadClick}>Select file</button>
                    </div>
                        <a> {file ? <button onClick={handleUpload}> Upload </button> : ''}</a>
                    <div>
                        <button onClick={refreshListNames}>Refresh List</button>
                        <a> {fileNames ? <ul>{getAllNames()}</ul>  : ''} </a>
                    </div>
        </header>
                <input
                    type="file"
                    ref={inputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
            </div>
  );
}

export default App;
