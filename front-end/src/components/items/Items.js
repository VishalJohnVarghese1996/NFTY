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
import Header from './Token'
import Homepage from './Homepage'

import TransferItem from './TransferItem'


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
        setComponentToRender(value);
        sessionStorage.setItem('userImage', imagVal);
    };

    useEffect(() => {

        Axios.get(`http://localhost:3001/api/get${sessionStorage.getItem("UserId")}`).then((response) => {
            setReviewList(response.data);
        })
    }, [])


    function transfer(){
        var receiverAddress = prompt("Enter public address of reciver.");
        
    }

    const renderComponent = () => {
        switch (componentToRender) {
            case 1:
                return <Homepage />;
            case 2:
                return <TransferItem />
            default://replaced 'else' with 'default'
                return (<div>
                    <h1>Welcome to Basic Page</h1>



                    {movieReviewList.map((val) => {

                        return (
                            <div class="card">
                                <div class="card-image">
                                    <img src={'http://localhost:3001/imgMy/' + val.image_id} alt="hey" id="img" onClick={() => handleEvent(1, val.image_id)}>
                                    </img>
                                </div>
                                <div class="card-text">
                                    <span class="date">4 days ago</span>
                                    <h2>Owner : {val.user_name}</h2>
                                    <h2>Price : {val.price} eth</h2>
                                </div>
                                <div class="card-stat">
                                    <button class="transferbtn" onClick={() => handleEvent(2, val.image_id)}>TRANSFER</button>
                                </div>
                            </div>
                        )

                    })}
                </div>);
        }
    }

    return (

        <div>
            {renderComponent()}
        </div>

    )
}

export default ItemsPage;