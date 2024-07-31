import { Box, Button, ButtonGroup, Typography } from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { Roboto_Mono } from "@next/font/google";

// Import font
const roboto_mono = Roboto_Mono({
	display: "swap",
	subsets: ["latin"]
})

export default function Home() {
	return (
		<main className={roboto_mono.className}>
			<Box width="100%" display="flex" justifyContent="center" alignItems="center" bgcolor="#ffa000">
				<Typography variant="h4" color="#000" sx={{ fontFamily: roboto_mono.style.fontFamily }}>
					Pantry
				</Typography>
			</Box>

			<Box display="flex" justifyContent="center" padding="20px">

					<Button variant="contained" sx={{ bgcolor: "#ffa000", "&:hover": { bgcolor: "#ff8c00" }, mx: "10px" }}>
						<Typography color="#000" sx={{ fontFamily: roboto_mono.style.fontFamily }}>
							Add Items
						</Typography>
					</Button>

					<Button variant="contained" sx={{ bgcolor: "#ffa000", "&:hover": { bgcolor: "#ff8c00" }, mx: "10px" }}>
						<Typography color="#000" sx={{ fontFamily: roboto_mono.style.fontFamily }}>
							Search Items
						</Typography>
					</Button>
			</Box>

		</main>
	)
}
