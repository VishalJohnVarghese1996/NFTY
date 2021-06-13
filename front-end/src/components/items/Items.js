import React, { useState, useEffect } from 'react';
import './App.css';
import Axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Homepage from './Homepage'

import TransferItem from './TransferItem'

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
    const [tokenUri, setTokenUri] = useState("");

    const handleEvent = (button, imagVal) => {
        setValue(button);
        setComponentToRender(value);
        sessionStorage.setItem('userImage', imagVal);
    };

    useEffect(() => {

        Axios.get(`http://localhost:3001/api/get${sessionStorage.getItem("Address")}`).then((response) => {
            setReviewList(response.data);
        })

    }, [])


    function transfer() {
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
                                    <img src={'http://localhost:3001/imgMy/' + val.token_id} alt="hey" id="img" onClick={() => handleEvent(1, val.token_id)}>
                                    </img>
                                </div>
                                <div class="card-text">
                                    <span class="date">Got on {val.date}</span>
                                    <h2>Title : {val.title}</h2>
                                    <h2>Price : {val.price}eth</h2>
                                    <h2>Token ID: {val.token_id}</h2>
                                </div>
                                <div class="card-stat">
                                    <button class="transferbtn" onClick={() => handleEvent(2, val.token_id)}>TRANSFER</button>
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