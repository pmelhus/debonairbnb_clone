import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
import { Route, Redirect, useParams, useHistory, Switch } from "react-router-dom";
import "./estatePage.css";
import { getCheckinDate, getCheckoutDate, getNightStay } from "./utils";
import { addDays } from 'date-fns';
import {useSelector, useDispatch} from "react-redux"

const CharterForm = ( {estate, stateVars, setCharterPayload} ) => {
	const params = useParams();
	const estateId = parseInt(params.id)
	const history = useHistory()
	const dispatch = useDispatch()
	// const [checkinDate, setCheckinDate] = useState(getCheckinDate());
	// const [checkoutDate, setCheckoutDate] = useState(getCheckoutDate());
	// const [nightStay, setNightStay] = useState(getNightStay());

    //cleaning rate, can set up fancy randomizer, or just leave it as 15% of one night's stay
    const cleanRate = 0.15;

	// const user = useSelector((state) => state.session.user);

	let {
		checkinDate,
		setCheckinDate,
		checkoutDate,
		setCheckoutDate,
		nightStay,
		setNightStay,
	} = stateVars;

const [guestNum, setGuestNum] = useState(0)
const sessionUserId = useSelector(state => state.session.user?.id)


	useEffect(() => {
		console.log('------=-=-=-=-=--=USE EFFECT-=-=-=-=-=-=-=-')
		console.log('check in date', checkinDate)
		console.log("check in date type", typeof checkinDate);
		console.log("------=-=-=-=-=--=USE EFFECT-=-=-=-=-=-=-=-");
		// console.log("check out date", checkoutDate);
		// console.log("check out date type", typeof checkoutDate);
		setNightStay(getNightStay(checkinDate, checkoutDate))
	}, [checkinDate, checkoutDate, nightStay]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const startDate = dateParser(checkinDate)
		const endDate = dateParser(checkoutDate)

		const payload = {
			sessionUserId, estateId, guestNum, startDate, endDate
		}

		setCharterPayload(payload)
		return history.push('/charters')
		// dispatch(addOneCharter(payload))
	};


	const setCheckinFunc = async (e) => {
		let strDate = e.target.value;
		// console.log('-*/-*/-*/-*/-*/-*/-CHECKIN FUNC*/-*/-*/-*/-*/-*/-*/-*/-*/-*/');
		// console.log("strDate", strDate);
		let newDate = new Date(strDate);
		// console.log("newDate", newDate);

		let setDate = addDays(newDate, 1);
		setCheckinDate(setDate);
		// console.log('CHECKIN DATE', checkinDate);
		// console.log("-*/-*/-*/-*/-*/-*/-*CHECKINFUNC/-*/-*/-*/-*/-*/-*/-*/-*/-*/");
		// setCheckinDate(e.target.value)
		// setNightStay(getNightStay(checkinDate, checkoutDate));
	}

	const setCheckoutFunc = async (e) => {
		let strDate = e.target.value;

		let newDate = new Date(strDate);
		let setDate = addDays(newDate, 1);
		setCheckoutDate(setDate);
	};

	const errors = [];

	// const { address, owner_id, title, estate?.nightly_rate, type_id, description } =
	// 	estate;


	const handleGuestNum = (e) => {
		setGuestNum(e.target.value)
	}

    const baseCost = nightStay * estate?.nightly_rate;
    const cleanCost = estate?.nightly_rate * cleanRate;
    const servCost = 0;
    const totalCost = baseCost + cleanCost + servCost;


	const dateParser = (dateobj) => {
		let year = dateobj.getFullYear();
		let month = dateobj.getMonth() + 1;
		let day = dateobj.getDate();

		if (month < 10) {
			month = `0${month.toString()}`;
		}
		if (day < 10) {
			day = `0${day.toString()}`;
		}

		return `${year}-${month.toString()}-${day.toString()}`;
	}

	return (
		<>

		<div id="charter-form">
			<form id="charter-reserve-form" onSubmit={handleSubmit}>
				<ul className="form-errors">
					{errors.map((error, idx) => (
						<li key={idx}>{error}</li>
					))}
				</ul>
				<p>${estate?.nightly_rate} / night</p>
				<div className="checkdates">
					<label>Check-in</label>
					<input
						type="date"
						// value={checkinDate}
						value={dateParser(checkinDate)}
						required
						onChange={setCheckinFunc}
					/>
				</div>
				<div className="checkdates">
					<label>Check-out</label>
					<input
						type="date"
						value={dateParser(checkoutDate)}
						required
						onChange={setCheckoutFunc}
					/>
				</div>
				<div>
					<label>Number of guests</label>
					<input
					type="number"
					value={guestNum}
					required
					onChange={handleGuestNum}
					/>
				</div>

				<button className="btn" id="reserve-btn" type="submit">
					Reserve
				</button>
			</form>
			<p id="no-charge-yet">You won't be charged yet</p>
			<div id="charter-invoice">
				<div className="invoice-row" id="base-cost">
					<p className="invoice-left">
						${estate?.nightly_rate} x {nightStay} nights
					</p>
					<p className="invoice-right">${baseCost}</p>
				</div>
				<div className="invoice-row" id="clean-cost">
					<p className="invoice-left">Cleaning fee</p>
					<p className="invoice-right">${cleanCost}</p>
				</div>
				<div className="invoice-row" id="service-cost">
					<p className="invoice-left">Service Fee</p>
					<p className="invoice-right">${servCost}</p>
				</div>
				<div className="invoice-row" id="total-cost">
					<p className="invoice-left">
						${estate?.nightly_rate} x {nightStay} nights
					</p>
					<p className="invoice-right">${totalCost}</p>
				</div>
			</div>
		</div>
		<div>

		</div>
		</>
	);
};

export default CharterForm;
