import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../AuthContext";
import { Box, TextField, Button, Typography, Avatar, Grid, Paper, MenuItem, IconButton, Badge } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { updateAdmin } from "../utils/api";

const positions = ["Head", "Associate Head", "Associate"];
const teamNames = [
    "Secretary General",
    "Finance",
    "Cultural",
    "Event",
    "Resource Information",
    "Travel & Logistics",
    "Sponsorship",
    "Publication",
    "Publicity",
    "Stage Decoration",
    "Business & Alumni Meet",
    "Competition and Seminars",
    "Web Development",
    "Refreshments",
    "Volunteers",
    "Photography",
    "Joint Secretary",
    "Fixed Signatory",
    "BECA Magazine",
    "Event Coordinator",
];

const Admin = () => {
    const { user, showAlert } = useAuth();
    console.log("Admin page editing user:");
    console.log(user);
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        team: "",
        position: "",
        phone: "",
        dept: "",
        tagLine: "",
    });

    const [imageFile, setImageFile] = useState(null); // To store the actual file
    const [previewUrl, setPreviewUrl] = useState(""); // To store the temporary preview

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                team: user.team || "",
                position: user.position || "",
                phone: user.phone || "",
                dept: user.dept || "",
                tagLine: user.tagLine || "",
            });
            setPreviewUrl(user.image || ""); // Set initial image from DB/Google
        }
    }, [user]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            // Create a temporary local URL for the preview
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // IMPORTANT: Because we have a file, we MUST use FormData
        const data = new FormData();
        data.append("id", user?._id); // Include the admin ID for identification
        data.append("name", formData.name);
        data.append("team", formData.team);
        data.append("position", formData.position);
        data.append("phone", formData.phone);
        data.append("dept", formData.dept);
        data.append("tagLine", formData.tagLine);

        if (imageFile) {
            data.append("image", imageFile); // The actual file object
        }
    
        // API Call would be
        try {
            const res = await updateAdmin(data);
            console.log("Update successful:", res.data);
            showAlert("Profile updated successfully!", "success");
        } catch (error) {
            console.log("Error updating profile:", error.response.data.message);
            showAlert(error.response.data.message || "Failed to update profile.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Paper elevation={3} sx={{ p: 2, width: "100%" }}>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    {/* PHOTO UPLOAD SECTION - Always full width (xs={12}) */}
                    <Grid xs={12} display="flex" justifyContent="center">
                        <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                            badgeContent={
                                <IconButton
                                    onClick={() => fileInputRef.current.click()}
                                    sx={{
                                        bgcolor: "primary.main",
                                        color: "white",
                                        "&:hover": { bgcolor: "primary.dark" },
                                    }}
                                >
                                    <PhotoCameraIcon />
                                </IconButton>
                            }
                        >
                            <Avatar
                                src={previewUrl}
                                sx={{ width: 220, height: 220, border: "4px solid var(--theme)", boxShadow: 3 }}
                            />
                        </Badge>
                        <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleFileChange} />
                    </Grid>

                    {/* FORM FIELDS - 1 col under 600px (xs=12), 2 cols above 600px (sm=6) */}
                    <Grid pt={2} xs={12} sm={6} >
                        <TextField
                            fullWidth
                            label="Full Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </Grid>

                    <Grid pt={2} xs={12} sm={6}>
                        <TextField fullWidth label="Email" value={formData.email} disabled />
                    </Grid>

                    <Grid pt={2} xs={12} sm={6}>
                        <TextField
                            select
                            fullWidth
                            label="Position"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            required
                        >
                            {positions.map((pos) => (
                                <MenuItem key={pos} value={pos}>
                                    {pos}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid pt={2} xs={12} sm={6}>
                        <TextField
                            select
                            fullWidth
                            label="Team"
                            name="team"
                            value={formData.team}
                            onChange={handleChange}
                            required
                        >
                            {teamNames.map((team) => (
                                <MenuItem key={team} value={team}>
                                    {team}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid pt={2} xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Department"
                            name="dept"
                            value={formData.dept}
                            onChange={handleChange}
                            required
                        />
                    </Grid>

                    <Grid pt={2} xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </Grid>

                    {/* Tagline - Usually looks better full-width even on desktop, but set to sm={6} if you want it in the grid */}
                    <Grid pt={2} xs={12}>
                        <TextField
                            fullWidth
                            label="Tagline (8-10 words long, not too long please)"
                            name="tagLine"
                            value={formData.tagLine}
                            onChange={handleChange}
                            multiline
                            rows={3}
                        />
                    </Grid>

                    {/* SUBMIT BUTTON - Always full width (xs={12}) */}
                    <Grid pt={2} xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<SaveIcon />}
                            size="large"
                            fullWidth // Makes the button fill the Grid container
                            sx={{ mt: 2, py: 1.5 }}
                            isloading={loading ? 1 : 0}
                        >
                            Save Profile
                        </Button>
                    </Grid>
                </Box>
            </Paper>
        </Box>
    );
};

export default Admin;
