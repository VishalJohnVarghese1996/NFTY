import React, { useState, useEffect } from 'react';
import Axios from 'axios';

import Web3 from 'web3'
import { TODO_LIST_ABI, TODO_LIST_ADDRESS } from '../../config'

const web3 = new Web3(Web3.givenProvider);
const NftContract = new web3.eth.Contract(TODO_LIST_ABI, TODO_LIST_ADDRESS);

const Homepage = () => {

	const [movieReviewList, setReviewList] = useState([])
	const [txList, setTxList] = useState([])
	const [tokenUri, setTokenUri] = useState("");
	const [creator, setCreator] = useState("");

	useEffect(() => {

		(async () => {

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

			Axios.get(`http://localhost:3001/api/oneItem${sessionStorage.getItem("userImage")}`).then(async (response) => {
				//get tx's
				await Axios.get(`http://localhost:3001/api/getTx${sessionStorage.getItem("userImage")}`).then((response) => {
					setTxList(response.data);
					// console.log(response.data[0].tx_hash);
				})

				setReviewList(response.data);
			})

			Axios.get(`http://localhost:3001/api/getCreator${result2[0]}`).then((response) => {
				// setReviewList(response.data);
				setCreator(response.data);
				// console.log(response.data);
			})





		})()

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


	return (
		<div>
			{movieReviewList.map((val) => {

				return (

					<div>
						<div id='parent_div_1'>
							<img src={'http://localhost:3001/imgBuy/' + val.token_id} alt="hey" id="imgItem"></img>
						</div>

						<div id='parent_div_2'>

							<div>
								<p id="tokenName"><u>Name:  {tokenUri.split(',')[0].split(':')[1]}</u></p>
								<p>Price : {tokenUri.split(',')[2].split(':')[1]}ETH</p>
								<p>Creator : {creator}&nbsp;  &nbsp; &nbsp; &nbsp;<a href={"https://ropsten.etherscan.io/tx/" + txList[0].tx_hash}>Transaction id</a></p>
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
							<button class="buybtn" value={val.token_id} onClick={e => buyToken(e, "value")}>BUY</button>

						</div>


					</div>

				)


			})}

		</div>
	)
};


export default Homepage