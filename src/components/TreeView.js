import React, { useState, useEffect, useCallback } from "react";
import Tree from "react-d3-tree";
import { Grid, Box, TextField, Card, CardContent, Typography } from "@mui/material";

const TreeView = () => {
    const [data, setData] = useState(null); // Original data from backend
    const [filteredData, setFilteredData] = useState(null); // Filtered data for display
    const [selectedNode, setSelectedNode] = useState(null); // Currently selected node
    const [query, setQuery] = useState(""); // Search query

    // Transform backend data into a format suitable for react-d3-tree
    const transformToD3 = useCallback(
        (node) => ({
            name: node.tag || "Root",
            attributes: node.attributes || {},
            children: node.children ? node.children.map(transformToD3) : [],
            content: node.text || "",
        }),
        []
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/data");
                if (!response.ok) throw new Error("Failed to fetch main data");

                const jsonData = await response.json();
                const treeData = transformToD3(jsonData);

                setData(treeData);
                setFilteredData(treeData);

                // Fetch additional files (e.g., LOXML.xdb)
                await fetchAdditionalFiles();
            } catch (error) {
                console.error("Error fetching data:", error);
                setData({ name: "Error loading data", children: [] }); // Fallback tree
            }
        };

        const fetchAdditionalFiles = async () => {
            try {
                const etResponse = await fetch("http://127.0.0.1:5000/static/xml/et.xml");
                if (etResponse.ok) console.log("Fetched et.xml content:", await etResponse.text());

                const loxmlResponse = await fetch("http://127.0.0.1:5000/static/xml/LOXML.xdb");
                if (loxmlResponse.ok) console.log("Fetched LOXML.xdb content:", await loxmlResponse.text());
            } catch (error) {
                console.error("Error fetching additional files:", error);
            }
        };

        fetchData();
    }, [transformToD3]);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setQuery(value);

        if (!data) return;

        if (!value) {
            setFilteredData(data);
            return;
        }

        const filterTree = (node) => {
            const isMatch = node.name.toLowerCase().includes(value);
            const filteredChildren = node.children
                ? node.children.map(filterTree).filter(Boolean)
                : [];

            return isMatch || filteredChildren.length > 0 ? { ...node, children: filteredChildren } : null;
        };

        const filteredTree = filterTree(data);
        setFilteredData(filteredTree ? [filteredTree] : []);
    };

    const handleNodeClick = (node) => {
        setSelectedNode(node.data || node);
    };

    if (data === null) return <div>Cargando data...</div>;

    return (
        <Grid container spacing={2} className="tree-view-container">
            <Grid item xs={12} md={4} className="tree-navigation">
                <TextField
                    label="Buscar"
                    variant="outlined"
                    value={query}
                    onChange={handleSearch}
                    className="search-bar"
                />
                <Box className="tree-container">
                    {filteredData && filteredData.length > 0 ? (
                        <Tree
                            data={filteredData}
                            collapsible
                            orientation="vertical"
                            onClick={handleNodeClick}
                        />
                    ) : (
                        <Typography>No se encontraron resultados.</Typography>
                    )}
                </Box>
            </Grid>
            <Grid item xs={12} md={8} className="content-viewer">
                <Card>
                    <CardContent>
                        {selectedNode ? (
                            <>
                                <Typography variant="h5">{selectedNode.name}</Typography>
                                <Typography variant="body1">{selectedNode.content || "Sin contenido disponible."}</Typography>
                                <Typography variant="body2">
                                    Atributos: {JSON.stringify(selectedNode.attributes, null, 2)}
                                </Typography>
                            </>
                        ) : (
                            <Typography>Seleccione un nodo para detalles</Typography>
                        )}
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default TreeView;
