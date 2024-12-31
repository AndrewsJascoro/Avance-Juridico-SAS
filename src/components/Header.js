import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const Header = () => {
    return (
        <AppBar position="static" style={{ backgroundColor: "#004d40" }}>
            <Toolbar style={{ justifyContent: "space-between" }}>
                {/* Logo */}
                <Typography
                    variant="h6"
                    style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                    onClick={() => (window.location.href = "/")}
                >
                    <img
                        src={require("../assets/android-chrome-512x512.png")}
                        alt="Avance Jurídico SAS."
                        style={{ height: "40px", marginRight: "10px" }}
                    />
                    Avance Jurídico SAS.
                </Typography>

                {/* Navigation Menu */}
                <Box style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <Button
                        color="inherit"
                        startIcon={<WhatsAppIcon />}
                        href="https://wa.me/571234567" // Replace with actual WhatsApp link
                        target="_blank"
                        style={{
                            textTransform: "none",
                            fontWeight: "bold",
                        }}
                    >
                        CONTACTANOS
                    </Button>
                    <Button color="inherit" href="#advantages" style={{ textTransform: "none" }}>
                        Ventajas
                    </Button>
                    <Button color="inherit" href="#features" style={{ textTransform: "none" }}>
                        Cómo funciona
                    </Button>
                    <Button color="inherit" href="#testimonials" style={{ textTransform: "none" }}>
                        Opiniones
                    </Button>
                    <Button color="inherit" href="#planes" style={{ textTransform: "none" }}>
                        Planes
                    </Button>
                </Box>

                {/* Login/Registration */}
                <Box style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <Button
                        href="https://accounts.google.com/signin"
                        target="_blank"
                        style={{
                            color: "#fff",
                            textTransform: "none",
                            position: "relative",
                            fontWeight: "bold",
                        }}
                        onMouseEnter={(e) => addUnderlineEffect(e)}
                        onMouseLeave={(e) => removeUnderlineEffect(e)}
                    >
                        INGRESAR    
                    </Button>
                    <Button
                        href="https://accounts.google.com/signup"
                        target="_blank"
                        style={{
                            color: "#fff",
                            textTransform: "none",
                            position: "relative",
                            fontWeight: "bold",
                        }}
                        onMouseEnter={(e) => addUnderlineEffect(e)}
                        onMouseLeave={(e) => removeUnderlineEffect(e)}
                    >
                        REGISTRARSE
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

// Add underline effect dynamically
const addUnderlineEffect = (e) => {
    e.target.style.borderBottom = "2px solid #fff";
};

const removeUnderlineEffect = (e) => {
    e.target.style.borderBottom = "none";
};

export default Header;
