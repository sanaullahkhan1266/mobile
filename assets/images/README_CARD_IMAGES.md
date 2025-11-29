# Card Images Setup

## Required Images

To display your actual card designs, you need to add these image files to this directory:

### 1. Physical Card Image
- **File name**: `physical-card.png`
- **Recommended size**: 320x200 pixels (16:10 aspect ratio)
- **Format**: PNG with transparency support
- **Content**: Your physical card design with chip, brand name, VISA logo, etc.

### 2. Virtual Card Image  
- **File name**: `virtual-card.png`
- **Recommended size**: 320x200 pixels (16:10 aspect ratio)
- **Format**: PNG with transparency support
- **Content**: Your virtual card design

## Image Requirements

- **High quality**: Use high-resolution images for sharp display
- **Proper aspect ratio**: 16:10 ratio works best (like a real credit card)
- **Transparent background**: PNG format with transparency if needed
- **File size**: Keep under 500KB each for optimal performance

## How to Add Images

1. Save your card design images as `physical-card.png` and `virtual-card.png`
2. Place them in this `assets/images/` directory
3. The app will automatically load and display them
4. Remove the fallback placeholder code from `card.tsx` once images are added

## Current Status

- ❌ physical-card.png (missing - showing fallback)  
- ❌ virtual-card.png (missing - showing fallback)

Once you add these images, the app will display your actual card designs instead of the colored placeholders!