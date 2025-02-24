import React, { useState } from 'react'
import QrReader from "react-qr-scanner";
import base45 from 'base45'
import pako from 'pako'
import cbor from 'cbor'
import './index.css'
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/styles.css'
import Button from 'react-bootstrap/Button';


window.Buffer = window.Buffer || require("buffer").Buffer; 

const App = () => {

const [showScanner, setShowScanner] = useState(false);
const [scanData, setScanData] = useState("Scan your Green Pass and your raw data will appear here")
const [decodedScanData, setDecodedScanData] = useState("Scan your Green Pass and decoded data will appear here")
const [name, setName] = useState("")
const [firstName, setFirstName] = useState("")
const [doses, setDoses] = useState("")
const [ministry, setMinistry] = useState("")
const [date, setDate] = useState()
const [dob, setDob] = useState("")
const [country, setCountry] = useState("")

const handleScan = (data) => {
  if (data) {
    setScanData(data.text);

    //Take off HC1: from string and then decode from Base45 into compressed Bytes
    const greenpassBody = data.text.substr(4);
    const decodedData = base45.decode(greenpassBody);
    setDecodedScanData(decodedData);

    //Decompress into CBOR bytes
    const decompressedData = pako.inflate(decodedData)
   
   
    //COSE to CBOR to JSON
    const cbordata = cbor.decodeAllSync(decompressedData)
    const [headers1, headers2, cbor_data, signature] = cbordata[0].value;
    const greenpassData = cbor.decodeAllSync(cbor_data)
    const finalDataObject = greenpassData[0].get(-260).get(1)
    setName(finalDataObject.nam.fn)
    setFirstName(finalDataObject.nam.gn)
    setDoses(finalDataObject.v[0].dn)
    setMinistry(finalDataObject.v[0].is)
    setDate(finalDataObject.v[0].dt)
    setDob(finalDataObject.dob)
    setCountry(finalDataObject.v[0].co)
    console.log(finalDataObject)
  }
}

return (
  <div>
  <nav class="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-900 sticky top-0 z-50 text-left items-start content-start">
  <div class="flex items-start text-left content-start">
    <a href="https://webforprofessionals.com/" className="flex items-start text-left float-left content-start">
        <img src="https://i0.wp.com/webforprofessionals.com/wp-content/uploads/2020/09/cropped-facebooklogo.jpg?resize=202%2C99&ssl=1" class="mr-3 h-6 sm:h-9" alt="Web For Professionals Logo" />
        <span class="self-center text-xl font-semibold whitespace-nowrap text-blue-900 hover:bg-white float-left text-left items-start content-start">Web For Professionals</span>
    </a>
    <button data-collapse-toggle="navbar-default" type="button" class="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
      <span class="sr-only">Open main menu</span>
      <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
    </button>
    <div class="hidden w-full md:block md:w-auto" id="navbar-default">
    </div>
  </div>
</nav>

  <div className="container mx-auto text-center min-w-full px-0 bg-pic01 bg-no-repeat bg-cover bg-center">
   <div className="flex justify-center items-center h-screen">
    <div className="textcenter">
    <h1 className="text-8xl text-white">Green Pass Information Verification App</h1>
    <p className="text-2xl text-white">Check the information stored on your Green Pass / Vaccine Passport by scanning your QR code below</p>
</div>
</div>
  <div style={{paddingTop: '1.3rem'}}>
    <div className="flex justify-center items-center">
      {showScanner ? (
        <div>
          <QrReader className="text-center"
            delay={300}
            onError={(e) => console.log(e)}
                  onScan={(data) => handleScan(data)}
          />

          <br />
            <Button variant="danger" size="lg"
            onClick={() => {
              setShowScanner(false);
            }}
          >
            <strong>Click to close QR Code Scanner</strong>
          </Button>
        </div>
      ) : (
        <div>
          <Button className=" transition ease-in-out delay-850 hover:scale-125 hover:bg-indigo-500 duration-300 hover:-translate-y-1" variant="danger" size="lg"
            onClick={() => {
              setShowScanner(true);
            }}
          >
            <strong>Click to open QR Code Scanner</strong>
          </Button>
          <br />
        </div>
      )}
      </div>
      <br />
      <div className="flex justify-center items-center bg-white py-10 px-10">
    <div className="text-center text-blue-800 break-all">
      <h2>Here is the raw version of what your Green Pass looks like before decompression and decoding</h2>
      <br />
      {scanData}
      <br />
      <h2>Here is your decompressed Green Pass Data looks like in bytes</h2>
      <br />
      {decodedScanData}
    <br />
    
      <br />
      </div>
</div>
</div>
   

<div className="flex justify-center items-center bg-blue-900 bg-cover bg-no-repeat bg-bottom">
    <div className="text-center text-white py-10">
    <h2 className="text-4xl">Here are the full details encoded in your Green Pass</h2>
    <div className="flex justify-center text-center py-10">
    <table class="table-auto text-center border-separate border-spacing-2 border border-slate-400">
 
      <tbody className="text-2xl">
        <tr>
          <td class="border border-slate-300 px-4">1</td>
          <td class="border border-slate-300 px-4"><strong>Last Name</strong></td>
          <td class="border border-slate-300 px-4">{name}</td>
          
        </tr>
        <tr>
          <td class="border border-slate-300 px-4">2</td>
          <td class="border border-slate-300 px-4"><strong>First Name</strong></td>
          <td class="border border-slate-300 px-4">{firstName}</td>
        </tr>
        <tr>
          <td class="border border-slate-300 px-4">3</td>
          <td class="border border-slate-300 px-4"><strong>Date Of Birth</strong></td>
          <td class="border border-slate-300 px-4">{dob}</td>
        </tr>
        <tr>
          <td class="border border-slate-300 px-4">4</td>
          <td class="border border-slate-300 px-4"><strong>Nationality</strong></td>
          <td class="border border-slate-300 px-4">{country}</td>
        </tr>
        <tr>
          <td class="border border-slate-300 px-4">5</td>
          <td class="border border-slate-300 px-4"><strong>Number of Doses</strong></td>
          <td class="border border-slate-300 px-4">{doses}</td>
        </tr>
        <tr>
          <td class="border border-slate-300 px-4">6</td>
          <td class="border border-slate-300 px-4"><strong>Origin of Vaccination Certificate</strong></td>
          <td class="border border-slate-300 px-4">{ministry}</td>
        </tr>
        <tr>
          <td class="border border-slate-300 px-4">7</td>
          <td class="border border-slate-300 px-4"><strong>Date of Most Recent Vaccination</strong></td>
          <td class="border border-slate-300 px-4">{date}</td>
        </tr>
   
      </tbody>
    </table>
</div>
    </div>
</div>
   
    </div>
    <footer class="p-4 bg-white rounded-lg shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800">
    <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2022 <a href="https://webforprofessionals.com" class="text-black no-underline">Web For Professionals™</a>. All Rights Reserved.
    </span>
</footer></div>
)
}

export default App