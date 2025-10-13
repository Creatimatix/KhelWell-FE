import { Box } from "@mui/material";

const Footer = () => {
    return <>
        <Box sx={{ bgcolor: "#111", color: "white", py: 3, textAlign: "center" }}>
        © {new Date().getFullYear()} KhelWell. Your Game. Your Journey. All in
        One Place.
      </Box>
    </>
}

export default Footer;