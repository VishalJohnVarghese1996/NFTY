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
		.tokenURI(1)
		.call({ from: account, gas });

		setTokenUri(result);



		Axios.get(`http://localhost:3001/api/oneItem${sessionStorage.getItem("userImage")}`).then((response) => {
			setReviewList(response.data);
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
								<p id="tokenName"><u>Name: {val.user_name}</u></p>
								<p>Price : {val.price}ETH</p>
								<p>498 of 500 available</p>
								<p>Creator : Shahid&nbsp;  &nbsp; &nbsp; &nbsp;<a href="https://etherscan.io/tx/0x454d70395bd6898c33f6a34eac4b17a4a5d30d46355144711d2b784d70bff1e1">Transaction id</a></p>
								<p> Created on : 29:05:2021 </p>
								<p>10% of sales will go to creator</p>
								<hr></hr>
								<p id="description">Description : Lorem Ipsum is simply dummy text of the printing and typesetting industry.
								Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
								when an unknown printer took a galley of type and scrambled it to make a type
								specimen book. It has survived not only five centuries, but also the leap into
								electronic typesetting, remaining essentially unchanged. It was popularised in
								the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
								and more recently with desktop publishing software like Aldus PageMaker
							including versions of Lorem Ipsum.</p>
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

							{console.log(tokenUri.split(',')[0].split(':')[1])}
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