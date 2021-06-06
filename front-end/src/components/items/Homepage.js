import React, { useState, useEffect } from 'react';
import Axios from 'axios';

const Homepage = () => {

	const [movieReviewList, setReviewList] = useState([])

	useEffect(() => {

		Axios.get(`http://localhost:3001/api/oneItem${sessionStorage.getItem("userImage")}`).then((response) => {
			setReviewList(response.data);
		})
	}, [])


	return (
		<div>
			{movieReviewList.map((val) => {

				return (

					<div>
						<div id='parent_div_1'>
							<img src={'http://localhost:3001/img/' + val.image_id} alt="hey" id="imgItem"></img>
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
							<button class="transferbtn">Transfer</button>


						</div>


					</div>

				)


			})}

		</div>
	)
};


export default Homepage