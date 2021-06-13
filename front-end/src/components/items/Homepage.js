import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import TransferItem from './TransferItem'

import Web3 from 'web3'
import { TODO_LIST_ABI, TODO_LIST_ADDRESS } from '../../config'

const web3 = new Web3(Web3.givenProvider);
const NftContract = new web3.eth.Contract(TODO_LIST_ABI, TODO_LIST_ADDRESS);

const Homepage = () => {

	const [movieReviewList, setReviewList] = useState([])
	const [tokenUri, setTokenUri] = useState("");

	useEffect(async () => {

		const accounts = await window.ethereum.enable();
		const account = accounts[0];
		const gas = 7000000;
	
		const result = await NftContract.methods
		.tokenURI(sessionStorage.getItem("userImage"))
		.call({ from: account, gas });

		setTokenUri(result);

		const result2 = await NftContract.methods
		.getTokenDetails(sessionStorage.getItem("userImage"))
		.call({ from: account, gas });

		Axios.get(`http://localhost:3001/api/oneItem${sessionStorage.getItem("userImage")}`).then((response) => {
			setReviewList(response.data);
		})

		Axios.get(`http://localhost:3001/api/getCreator${result2[0]}`).then((response) => {
			// setReviewList(response.data);
			console.log("ehy")
		})

	}, [])

	const [value, setValue] = useState(null)
    const [componentToRender, setComponentToRender] = useState(null)


	const handleEvent = (button, imagVal) => {
        setValue(button);
        setComponentToRender(value);
        sessionStorage.setItem('userImage', imagVal);
    };


	
    const renderComponent = () => {
        switch (componentToRender) {
            case 1:
                return <TransferItem />
            default://replaced 'else' with 'default'
                
	return (
		<div>
			{movieReviewList.map((val) => {

				return (

					<div>
						
						<div id='parent_div_1'>
							<img src={'http://localhost:3001/imgMy/' + val.token_id} alt="hey" id="imgItem"></img>
						</div>

						<div id='parent_div_2'>
							<div>
								
								<p id="tokenName"><u>Name:  {tokenUri.split(',')[0].split(':')[1]}</u></p>
								<p>Price : {tokenUri.split(',')[2].split(':')[1]}ETH</p>
								<p>Creator : Shahid&nbsp;  &nbsp; &nbsp; &nbsp;<a href="https://etherscan.io/tx/0x454d70395bd6898c33f6a34eac4b17a4a5d30d46355144711d2b784d70bff1e1">Transaction id</a></p>
								<p> Created on : {val.date} </p>
								<p>{tokenUri.split(',')[4].split(':')[1].replace('}', '')}% of sales will go to creator</p>
								<hr></hr>
								<p id="description">Description : {tokenUri.split(',')[1].split(':')[1]}</p>
							</div>
							
							<hr></hr>

							<p><u>Owner Chain</u></p>
							<p>Vishal&nbsp; &nbsp; &nbsp;<a href="https://etherscan.io/tx/0x454d70395bd6898c33f6a34eac4b17a4a5d30d46355144711d2b784d70bff1e1">Transaction id</a>
								<br />
								Amit&nbsp; &nbsp; &nbsp;<a href="https://etherscan.io/tx/0x454d70395bd6898c33f6a34eac4b17a4a5d30d46355144711d2b784d70bff1e1">Transaction id</a>
								<br />
								Ashutosh&nbsp; &nbsp; &nbsp;<a href="https://etherscan.io/tx/0x454d70395bd6898c33f6a34eac4b17a4a5d30d46355144711d2b784d70bff1e1">Transaction id</a>
							</p>
							<hr></hr>
							<button class="transferbtn" onClick={() => handleEvent(1, val.token_id)}>Transfer</button>

							{/* {console.log(tokenUri.split(','))} */}
						</div>
					</div>
				)
			})}

		</div>
	);
        }
    }

    return (

        <div>
            {renderComponent()}
        </div>

    )	
};

export default Homepage