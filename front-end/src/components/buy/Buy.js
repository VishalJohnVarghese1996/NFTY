import React, { useState, useEffect } from 'react';

import './App.css';
import Axios from 'axios';
// import Web3 from 'web3';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import { useHistory } from "react-router-dom";



import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
// import Header from './Token'
import Homepage from './Homepage'

import Web3 from 'web3'
import { TODO_LIST_ABI, TODO_LIST_ADDRESS } from '../../config'

const web3 = new Web3(Web3.givenProvider);
const NftContract = new web3.eth.Contract(TODO_LIST_ABI, TODO_LIST_ADDRESS);


const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 140,
    },
});


function ItemsPage() {
    const [value, setValue] = useState(null)
    const [componentToRender, setComponentToRender] = useState(null)
    const [movieReviewList, setReviewList] = useState([])

    const handleEvent = (button, imagVal) => {
        setValue(button);
        setComponentToRender(value, imagVal);
        sessionStorage.setItem('userImage', imagVal);
    };


    useEffect(() => {

        Axios.get(`http://localhost:3001/api/buy${sessionStorage.getItem("Address")}`).then((response) => {
            setReviewList(response.data);
        })
    }, [])


    const buyToken = async (e) => {
        e.preventDefault()

        const accounts = await window.ethereum.enable();
        const account = accounts[0];

        // const gas = await HelloContract.methods.sendBal('0x9c9e37934CC8Dd832E8C2406324Dd04D5CdE715f').estimateGas();

        const gas = 7000000;

        // call backend api and get owner or seller address of this token id
        const formData = new FormData();
        formData.append('token_id', e.target.value);

        var owner;
        var price;

        Axios.post("http://localhost:3001/api/getBuyDetails", formData).then(async (response) => {
            // setReviewList(response.data);
            owner = response.data.address;
            price = response.data.price;

            const result = await NftContract.methods
                .buyNft(owner, e.target.value)
                .send({ from: account, gas, value: web3.utils.toWei(price.toString(), "ether") });


            const formData = new FormData();
            formData.append('newOwner', account);
            formData.append('action', "bought");
            formData.append('txHash', result.transactionHash);

            Axios.post(`http://localhost:3001/api/transferToken${e.target.value}`, formData).then(res => {
                //Now do what you want with the response;
            })
        })
    }

    const renderComponent = () => {
        switch (componentToRender) {
            case 1:
                return <Homepage />;
            default://replaced 'else' with 'default'
                return (<div>
                    <h1>Welcome to Items Page</h1>


                    {movieReviewList.map((val) => {

                        return (
                            <div class="card">
                                <div class="card-image">
                                    <img src={'http://localhost:3001/imgBuy/' + val.token_id} alt="hey" id="img" onClick={() => handleEvent(1, val.token_id)}>
                                    </img>
                                </div>
                                <div class="card-text">
                                    <span class="date">Got on {val.date}</span>
                                    <h2>Title : {val.title}</h2>
                                    <h2>Price : {val.price}eth</h2>
                                    <h2>Token ID: {val.token_id}</h2>
                                </div>
                                <div class="card-stat">
                                    <button class="buybtn" value={val.token_id} onClick={e => buyToken(e, "value")}>BUY</button>

                                </div>
                            </div>


                        )


                    })}
                </div>);
        }
    }

    return (

        <div>
            <div>

            </div>
            {renderComponent()}
        </div>


    )
}

export default ItemsPage;