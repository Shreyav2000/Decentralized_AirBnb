import "../assets/css/AddRental.css";
import "bootstrap/dist/css/bootstrap.css";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ethers, utils } from "ethers";
import { Form } from "react-bootstrap";
import { Button, CircularProgress } from "@mui/material";
import Connect from "../components/Connect";

import logo from "../assets/images/airbnbRed.png";
import bg from "../assets/images/add-image.jpg";

import DecentralAirbnb from "../artifacts/contracts/DecentralAirbnb.sol/DecentralAirbnb.json";
import { contractAddress, networkDeployedTo } from "../utils/contracts-config";
import networksMap from "../utils/networksMap.json";

import { StoreContent } from "../utils/StoreContent";


/*
import { useState, useEffect } from 'react'
import React from 'react'
import ViewTableData from './ViewTableData';
import './Sell.css'



// To get values stored in the local storage
const getItemsFromLocalStorage =() =>{
    const data = localStorage.getItem('items');
    if(data){
        return JSON.parse(data);
    } else {
        return []
    }
}
function Sell() {

  const [items, setItems] = useState(getItemsFromLocalStorage());

  const [itemName, setItemName] = useState('');
  const [product, setProduct] = useState('');
  const [sellerName, setSellerName] = useState('');

  const handleSubmittedItems = (e)=>{
    e.preventDefault();
    let item = {
        itemName,
        product,
        sellerName
    }
    setItems([...items, item]); 
    setItemName('');
    setProduct('');
    setSellerName('');
  }
  //delete item
  const deleteItem = (itemName) =>{
    const filterItems = items.filter((element, index)=>{
        return element.itemName !== itemName
    })
    setItems(filterItems);
  }

  useEffect(()=>  {
    localStorage.setItem('items', JSON.stringify(items));
  },[items])

  export const ViewTableData = ({items, deleteItem}) => {
    return items.map(item=>(
          <tr key={item.itemName}>
              <td>{item.itemName}</td>
              <td>{item.product}</td>
              <td>{item.sellerName}</td>
              <td><button onClick={()=>deleteItem(item.itemName)}>Delete</button></td>
          </tr>
    ))
  }


*/





const Rentals = () => {
  let navigate = useNavigate();

  const data = useSelector((state) => state.blockchain.value);
  const [loading, setLoading] = useState(false);

  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [formInput, setFormInput] = useState({
    name: "",
    city: "",
    latitude: "",
    longitude: "",
    description: "",
    numberGuests: 0,
    pricePerDay: 0,
  });

  const getImage = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];

    setImage(file);
    setImageName(file.name);
  };

  const addRental = async () => {
    if (data.network == networksMap[networkDeployedTo]) {
      if (image !== undefined && window.ethereum !== undefined) {
        try {
          setLoading(true);
          const provider = new ethers.providers.Web3Provider(
            window.ethereum,
            "any"
          );
          const signer = provider.getSigner();
          const AirbnbContract = new ethers.Contract(
            contractAddress,
            DecentralAirbnb.abi,
            signer
          );

          const listingFee = AirbnbContract.callStatic.listingFee();

          const cid = await StoreContent(image);
          const imageURI = `ipfs://${cid}/${imageName}`;

          const add_tx = await AirbnbContract.addRental(
            formInput.name,
            formInput.city,
            formInput.latitude,
            formInput.longitude,
            formInput.description,
            imageURI,
            formInput.numberGuests,
            utils.parseEther(formInput.pricePerDay, "ether"),
            { value: listingFee }
          );
          await add_tx.wait();

          setImage(null);
          setLoading(false);

          navigate("/dashboard");
        } catch (err) {
          window.alert("An error has occured");
          setLoading(false);
          console.log(err);
        }
      } else {
        window.alert("Please Install Metamask");
      }
    }/* else {
      window.alert(
        `Please Switch to the ${networksMap[networkDeployedTo]} network`
      );
    }*/
  };

  return (
    <>
      <div className="topBanner">
        <div>
          <Link to="/">
            <img className="logo" src={logo} alt="logo"></img>
          </Link>
        </div>
        <div className="lrContainers">
          <Connect />
        </div>
      </div>

      <hr className="line" />
      <br />
      <br />
      <div className="addRentalContent">
        <div className="addRentalContent-box" style={{ alignItems: "center" }}>
          <h2 style={{ textAlign: "center" }}>Add your Rental</h2>
          <br />
          <Form.Group className="mb-3">
            <Form.Label>Property name:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter rental title"
              onChange={(e) => {
                setFormInput({ ...formInput, name: e.target.value });
              }}
              required={true}
            />
          </Form.Group>

          <br />
          <div>
            <label>Property City: </label>
            <Form.Control
              type="text"
              maxLength={30}
              placeholder="Enter your property city"
              onChange={(e) => {
                setFormInput({ ...formInput, city: e.target.value });
              }}
              required
            />
          </div>
          <br />
          <div>
            <label>Property Latitude: </label>
            <Form.Control
              type="text"
              maxLength={30}
              placeholder="Enter latitude"
              onChange={(e) => {
                setFormInput({ ...formInput, latitude: e.target.value });
              }}
            />
          </div>
          <br />
          <div>
            <label>Property Longitude: </label>
            <Form.Control
              type="text"
              maxLength={30}
              placeholder="Enter longitude"
              onChange={(e) => {
                setFormInput({ ...formInput, longitude: e.target.value });
              }}
            />
          </div>
          <br />
          <div>
            <label>Property Description: </label>
            <Form.Control
              as="textarea"
              rows={5}
              maxLength={200}
              placeholder="Enter a description of the place"
              onChange={(e) => {
                setFormInput({ ...formInput, description: e.target.value });
              }}
            />
          </div>
          <br />
          <div>
            <label>Max number of guests: </label>
            <Form.Control
              type="number"
              min={1}
              placeholder="Enter maximu number of guests"
              onChange={(e) =>
                setFormInput({
                  ...formInput,
                  numberGuests: Number(e.target.value),
                })
              }
            />
          </div>
          <br />
          <div>
            <label>Price per day: </label>
            <Form.Control
              type="number"
              min={0}
              placeholder="Enter rent price per day in $"
              onChange={(e) =>
                setFormInput({ ...formInput, pricePerDay: e.target.value })
              }
            />
          </div>
          <br />
          <div>
            <Form.Control
              type="file"
              name="file"
              onChange={(e) => {
                getImage(e);
              }}
            />
            <br />
            {image && (
              <div style={{ textAlign: "center" }}>
                <img
                  className="rounded mt-4"
                  width="350"
                  src={URL.createObjectURL(image)}
                />
              </div>
            )}
          </div>
          <br />
          <div style={{ textAlign: "center" }}>
            <Button
              type="submit"
              variant="contained"
              color="error"
              onClick={addRental}
            >
              {loading ? <CircularProgress color="inherit" /> : "Add"}
            </Button>
          </div>
          <br />
        </div>
        <div className="addRentalContent-image">
          <img src={bg} className="add-img" alt="logo"></img>
        </div>
      </div>
    </>
  );
};

export default Rentals;
