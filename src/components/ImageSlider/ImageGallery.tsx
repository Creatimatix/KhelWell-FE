import React, { useState } from "react";
import { Box, Grid, ImageList, ImageListItem, Paper } from "@mui/material";

interface ProductImageGalleryProps {
  images: { image_url: string }[];
}

export default function ImageGallery({ images }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]?.image_url || 'https://turftown.in/_next/image?url=https%3A%2F%2Fturftown.s3.ap-south-1.amazonaws.com%2Fsuper_admin%2Ftt-1726811620216.webp&w=828&q=75');

  return (
    <Grid container justifyContent="center">
      {/* Main Image */}
      <Grid item >
        <Paper
          sx={{
            position: "relative",
            width: "100%",
            borderRadius: 2,
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f9f9f9",
          }}
        >
          <Box
            component="img"
            src={selectedImage}
            alt="Main product"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.3s ease-in-out",
              "&:hover": { transform: "scale(1.05)" },
            }}
          />
        </Paper>

        {/* Thumbnails below */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "left",
            gap: 1,
            mt: 2,
            mb:4,
            overflowX: "auto",
          }}
        >
          {images.map((img, idx) => (
            <Box
              key={idx}
              onClick={() => setSelectedImage(img.image_url)}
              sx={{
                width: 60,
                height: 60,
                borderRadius: 1,
                overflow: "hidden",
                cursor: "pointer",
                border:
                  selectedImage === img.image_url
                    ? "2px solid #1976d2"
                    : "2px solid transparent",
                transition: "border 0.2s ease-in-out",
              }}
            >
              <Box
                component="img"
                src={img.image_url}
                alt={`Thumbnail ${idx + 1}`}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  "&:hover": { opacity: 0.8 },
                }}
              />
            </Box>
          ))}
        </Box>
      </Grid>
    </Grid>
  );
}
