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

        Axios.get(`http://localhost:3001/api/buy${sessionStorage.getItem("UserId")}`).then((response) => {
            setReviewList(response.data);
        })
    }, [])


    const buyToken = async (e) => {
        e.preventDefault()
    
        const accounts = await window.ethereum.enable();
        const account = accounts[0];
    
        // const gas = await HelloContract.methods.sendBal('0x9c9e37934CC8Dd832E8C2406324Dd04D5CdE715f').estimateGas();
    
        const gas = 7000000;
    
    
        const result = await NftContract.methods
        .buyNft("0x64479dD3c90aB60bC3010BCB4b82942A109aBAd6", 2)
        .send({ from: account, gas });
    
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
                                    <img src={'http://localhost:3001/imgBuy/' + val.image_id} alt="hey" id="img" onClick={() => handleEvent(1, val.image_id)}>
                                    </img>
                                </div>
                                <div class="card-text">
                                    <span class="date">4 days ago</span>
                                    <h2>Owner : {val.user_name}</h2>
                                    <h2>Price : {val.price} eth</h2>
                                </div>
                                <div class="card-stat">
                                   <button class="buybtn" onClick={buyToken}>BUY</button>
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