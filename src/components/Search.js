import React, { useState } from "react";
import { TextField, Typography, Button, CircularProgress, Paper, Divider, Box } from "@mui/material";

const Search = () => {
    const [query, setQuery] = useState(""); // Input query
    const [results, setResults] = useState(null); // Search results
    const [loading, setLoading] = useState(false); // Loading state

    const handleSearch = async () => {
        if (!query.trim()) return; // Avoid empty searches
        setLoading(true); // Set loading state
        try {
            const response = await fetch(`http://127.0.0.1:5000/search?query=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error("Failed to fetch search results");
            const data = await response.json();
            setResults(data); // Store results
        } catch (error) {
            console.error("Search error:", error);
            setResults(null); // Clear results on error
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <Box style={{ padding: "20px", textAlign: "center" }}>
            {/* Search Bar */}
            <TextField
                label="Buscar"
                variant="outlined"
                fullWidth
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                style={{ marginBottom: "10px", width: "60%" }}
            />

            {/* Search Button */}
            <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
                disabled={loading || !query.trim()}
                style={{ marginBottom: "20px", marginLeft: "10px" }}
            >
                {loading ? <CircularProgress size={20} color="inherit" /> : "Search"}
            </Button>

            {/* Loading Indicator */}
            {loading && (
                <Box style={{ marginTop: "20px" }}>
                    <CircularProgress />
                </Box>
            )}

            {/* Results Section */}
            {results && (
                <Paper style={{ padding: "20px", marginTop: "20px", textAlign: "left" }}>
                    {/* SQL Results */}
                    <Typography variant="h6" gutterBottom>SQL Results</Typography>
                    <pre>
                        {results.sql_results && results.sql_results.length > 0
                            ? JSON.stringify(results.sql_results, null, 2)
                            : "No SQL results found."}
                    </pre>

                    <Divider style={{ margin: "20px 0" }} />

                    {/* XML Results */}
                    <Typography variant="h6" gutterBottom>XML Results</Typography>
                    <pre>
                        {results.xml_results && results.xml_results.length > 0
                            ? JSON.stringify(results.xml_results, null, 2)
                            : "No XML results found."}
                    </pre>
                </Paper>
            )}
        </Box>
    );
};

export default Search;
