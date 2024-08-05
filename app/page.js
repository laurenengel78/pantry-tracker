"use client"

import { useState, useEffect } from "react";
import { Box, Button, ButtonGroup, Modal, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TextField, ThemeProvider, Typography } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { db } from "./firebase";
import { collection, doc, getDocs, query, addDoc, setDoc, deleteDoc, getDoc, where } from "firebase/firestore";
import { Roboto_Mono } from "next/font/google";

// Import font
const roboto_mono = Roboto_Mono({
	display: "swap",
	subsets: ["latin"]
})

// Theme
const theme = createTheme({
	palette: {
		primary: {
			main: "#ffa000"
		}
	},
	typography: {
		fontFamily: roboto_mono.style.fontFamily
	}
})

// Style for "Add items" modal
const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "white",
        border: '2px solid #ffa000',
	boxShadow: 24,
	p: 4,
	display: "flex",
	flexDirection: "column",
	gap: 3,
}

// Sortable table (ascending or descending) by item name, quantity, or expiration date
// Includes table buttons to delete each item
const Sort_Table = ({inventory, delete_function }) => {
	const [order, set_order] = useState("asc");
	const [order_by, set_order_by] = useState("name");

	// Sort items by ascending or descending data values
	const handle_sort = (data) => {
		const is_asc = order_by === data && order === "asc"
		set_order(is_asc ? "desc" : "asc")
		set_order_by(data)
	}

	// Sort the inventory accordingly
	const sort_inventory = [...inventory].sort((a, b) => {
		if (a[order_by] < b[order_by])
			return order === "asc" ? -1 : 1
		if (a[order_by] > b[order_by])
			return order === "asc" ? 1 : -1
		return 0
	})
	return (
		<TableContainer component={Paper} sx= {{ width: "85%" }}>
			<Table stickyHeader aria-label="table">
				<TableHead>
					<TableRow>
						<TableCell align="right">
							<TableSortLabel active={order_by === "name"} direction={order_by === "name" ? order : "asc"} onClick={() => handle_sort("name")}>
								Name
							</TableSortLabel>
						</TableCell>
						<TableCell align="right">
							<TableSortLabel active={order_by === "quantity"} direction={order_by === "quantity" ? order : "asc"} onClick={() => handle_sort("quantity")}>
								Quantity
							</TableSortLabel>
						</TableCell>
						<TableCell align="right">
							<TableSortLabel active={order_by === "date"} direction={order_by === "date" ? order : "asc"} onClick={() => handle_sort("date")}>
								Exp. Date
							</TableSortLabel>
						</TableCell>
						<TableCell align="right">
							Delete
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{sort_inventory.map((row) => (
						<TableRow key={name}>
							<TableCell align="right" component="th" scope="row"> {row.name} </TableCell>
							<TableCell align="right">{row.quantity}</TableCell>
							<TableCell align="right">{row.date}</TableCell>
							<TableCell align="right">
								<Button variant="contained" onClick={() => delete_function(row.name, row.date)}>
									Delete
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}


export default function Home() {
	const [inventory, set_inventory] = useState([])
	const [open, set_open] = useState(false)
	const [name, set_name] = useState("")
	const [quantity, set_quantity] = useState(null)
	const [date, set_date] = useState(null)

	const handle_open = () => set_open(true)
	const handle_close = () => set_open(false)

	// Pull pantry inventory from database
	const get_inventory = async () => {
        	const snapshot = query(collection(db, "pantry"))
        	const docs = await getDocs(snapshot)
        	const inventory_list = []
    		docs.forEach ((doc) => {
			inventory_list.push({ name: doc.id, ...doc.data() })
        	})
        	set_inventory(inventory_list)
		console.log(inventory_list)
	}

	useEffect(() => {
        	get_inventory()
	}, [])

	// Add items
	const add_item = async (i, q, d) => {

		const item_name = i.charAt(0).toUpperCase() + i.slice(1).toLowerCase()
		const ref = doc(collection(db, "pantry"), `${item_name}_${d}`)
		const snapshot = await getDoc(ref)

        	if (snapshot.exists()) {
			const data = snapshot.data()
			const item_quantity = Number(data.quantity)
			const item_date = data.date
			if (item_date === d) {
                		await setDoc(ref, { quantity: (item_quantity + Number(q)).toString() }, { merge: true })
			} else {
                		await setDoc(ref, { name: item_name, quantity: q.toString(), date: d })
			}
        	} else {
                	await setDoc(ref, {name: item_name, quantity: q.toString(), date: d })
        	}

        	await get_inventory()
	}

	// Delete items
	const delete_item = async (i, d) => {
		const ref = doc(collection(db, "pantry"), `${i}_${d}`)
		const snapshot = await getDoc(ref)

        	if (snapshot.exists()) {
			const data = snapshot.data()
			const item_quantity = Number(data.quantity)
			if (item_quantity > 1) {
				await setDoc(ref, { quantity: (item_quantity - 1).toString() }, { merge: true })
			} else {
                       		await deleteDoc(ref)
			}
        	}

        	await get_inventory()
	}


	return (
		<ThemeProvider theme={theme}>
			<Box width="100%" display="flex" justifyContent="center" alignItems="center" sx={{ bgcolor: "primary.main" }}>
				<Typography variant="h4" color="#000">
					Pantry
				</Typography>
			</Box>

			<Box display="flex" justifyContent="center" padding="20px">
				<Button onClick={handle_open} variant="contained" sx={{ mx: "10px" }}>
					<Typography color="#000">
						Add Items
					</Typography>
				</Button>
			</Box>

			<Modal open={open} onClose={handle_close} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
				<Box sx={style}>
					<TextField label="Item Name" isRequired value={name} variant="standard" onChange={(e) => set_name(e.target.value)} />

					<TextField label="Quantity" inputProps={{ min: 1 }} type="number" isRequired value={quantity} variant="standard" onChange={(e) => set_quantity(e.target.value)} />

					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DatePicker label="Expiration Date" disablePast isRequired value={date ? dayjs(date, "MM-DD-YYYY") : null} onChange={(e) => set_date(dayjs(e).format("MM-DD-YYYY"))} />
    					</LocalizationProvider>

					<Button variant="outlined" onClick={() => {
							console.log(name)
							console.log(quantity)
							console.log(date)
							add_item(name, quantity, date)
							set_name("")
							set_quantity(null)
							set_date(null)
							handle_close()
					}}>
						Submit
					</Button>
				</Box>
			</Modal>

			<Box width="100%" display="flex" justifyContent="center" alignItems="center" padding="20px">
				<Sort_Table inventory={inventory} delete_function={delete_item} />
			</Box>
		</ThemeProvider>
	)
}
