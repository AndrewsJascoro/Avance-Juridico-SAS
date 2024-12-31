import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import Tree from "react-d3-tree";

const DocumentViewer = ({ filePath }) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const transformToTree = useCallback((node) => {
        const children = Array.from(node.childNodes || [])
            .filter((child) => child.nodeType === 1) // Filter for element nodes
            .map(transformToTree);

        return {
            name: node.nodeName,
            attributes: Array.from(node.attributes || []).reduce(
                (acc, attr) => ({ ...acc, [attr.name]: attr.value }),
                {}
            ),
            children: children.length > 0 ? children : undefined,
            content: node.textContent.trim() || undefined,
        };
    }, []);

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/static/xml/${filePath}`);
                if (!response.ok) throw new Error(`Failed to load file: ${filePath}`);
                
                const text = await response.text();
                
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(text, "application/xml");

                // Handle XML parsing errors
                const parserError = xmlDoc.querySelector("parsererror");
                if (parserError) throw new Error("Invalid XML format");

                const treeData = transformToTree(xmlDoc.documentElement);
                setData(treeData);
            } catch (err) {
                console.error("Error fetching document:", err);
                setError(`Error loading file: ${filePath}`);
            }
        };

        fetchDocument();
    }, [filePath, transformToTree]);

    if (error) {
        return <Typography color="error" style={{ margin: "20px", textAlign: "center" }}>{error}</Typography>;
    }

    if (!data) {
        return <Typography style={{ margin: "20px", textAlign: "center" }}>Cargando documento...</Typography>;
    }

    return (
        <Box style={{ height: "100vh", overflow: "auto", padding: "20px", backgroundColor: "#f9f9f9" }}>
            <Tree
                data={data}
                orientation="vertical"
                nodeSize={{ x: 200, y: 200 }}
                translate={{ x: 100, y: 50 }}
                pathFunc="elbow"
            />
        </Box>
    );
};

export default DocumentViewer;
