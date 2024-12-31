import React from "react";
import { Routes, Route } from "react-router-dom"; // Import Routes and Route
import Header from "./components/Header";
import Search from "./components/Search";
import TreeView from "./components/TreeView";
import Footer from "./components/Footer";
import DocumentViewer from "./components/DocumentViewer"; // Import DocumentViewer
import "./App.css";
import { Button, Container } from "@mui/material"; // Corrected "Button" import

function App() {
    const openEtXml = () => {
        window.open("/static/xml/et.xml", "_blank"); // Opens the XML file in a new tab
    };

    return (
        <ErrorBoundary>
            <div className="main-content">
                <Header />
                <Container>
                    <h1 style={{ marginTop: "20px", marginBottom: "20px", textAlign: "center" }}>
                        XML - Interacción - Visualización - Avance Jurídico SAS.
                    </h1>
                    {/* Button to open XML */}
                    <div style={{ textAlign: "center", marginBottom: "20px" }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={openEtXml}
                        >
                            Abrir XML File
                        </Button>
                    </div>
                    {/* Routes for navigation */}
                    <Routes>
                        <Route path="/" element={<TreeView />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/document/:filePath" element={<DocumentViewer />} />
                    </Routes>
                </Container>
                <Search />
                <Footer />
            </div>
        </ErrorBoundary>
    );
}

// ErrorBoundary component for catching errors in child components
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: "20px", textAlign: "center" }}>
                    <h2>Oops! Something went wrong.</h2>
                    <p>{this.state.error?.message || "An unexpected error occurred."}</p>
                    <p>Please refresh the page or contact support.</p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default App;
