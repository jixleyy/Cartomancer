# Cartomancer - Fantasy Map Generator

Cartomancer is a web-based fantasy map generator that allows users to create detailed, customizable fantasy world maps. Built primarily with JavaScript and D3.js, it generates terrain, biomes, rivers, political entities, and cultural features procedurally.

## Features

- **Procedural Generation**: Automatically generates realistic continents, islands, mountain ranges, rivers, and climate zones
- **Customizable**: Extensive options for adjusting map parameters, styles, and generation rules
- **Political Systems**: Creates states, provinces, burgs (cities/towns), and cultural regions
- **Visual Styling**: Multiple style presets and extensive customization options
- **Export Options**: Export maps as SVG, PNG, GeoJSON, and other formats
- **Edit Tools**: Modify terrain, move burgs, adjust borders, and customize features

## Prerequisites

- Modern web browser (Chrome, Firefox, Edge recommended)
- Local web server (required due to browser security restrictions)

## Quick Start

### Method 1: Using Python (Recommended)

```bash
# Clone or download the repository
git clone https://github.com/Azgaar/cartomancer.git

# Navigate to the project directory
cd cartomancer

# Start a local web server
python -m http.server 8000

# Open your browser and navigate to:
# http://localhost:8000
```

### Method 2: Using Node.js

```bash
# Install http-server globally (if not already installed)
npm install -g http-server

# Navigate to the project directory
cd cartomancer

# Start the server
http-server -p 8000

# Open your browser and navigate to:
# http://localhost:8000
```

### Method 3: Using PHP

```bash
# Navigate to the project directory
cd cartomancer

# Start PHP built-in server
php -S localhost:8000

# Open your browser and navigate to:
# http://localhost:8000
```

## Usage

1. **Generate a New Map**: 
   - Click "New Map" to generate a random map
   - Adjust parameters in the options panel before generation

2. **Customize the Map**:
   - Use the tools panel to modify terrain, add/remove features
   - Edit political entities, cultures, and religions
   - Adjust styling in the style editor

3. **Export Your Map**:
   - Use the "Save" menu to download the map in various formats
   - Export as image files (PNG, SVG) or data files (GeoJSON, JSON)

## Project Structure

```
cartomancer/
├── index.html              # Main HTML file
├── main.js                 # Core application logic
├── modules/                # Feature modules
│   ├── ui/                 # User interface components
│   ├── renderers/          # Drawing functions
│   ├── io/                 # Input/output operations
│   └── *.js                # Generation modules
├── styles/                 # Style configuration files
├── images/                 # Texture and icon images
├── libs/                   # External libraries
├── heightmaps/             # Predefined heightmap templates
└── ...
```

## Development

### Code Organization

- **Main Controller**: `main.js` handles initialization and coordination
- **Generation Modules**: Individual files in `/modules/` handle specific features (biomes, rivers, states, etc.)
- **UI Modules**: Files in `/modules/ui/` manage different editor panels
- **Renderers**: Files in `/modules/renderers/` handle visual representation
- **Styles**: JSON files in `/styles/` define visual appearance presets

### Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Technical Details

### Generation Pipeline

1. **Heightmap Creation**: Terrain elevation using Voronoi diagrams
2. **Feature Detection**: Identification of oceans, islands, lakes
3. **Climate Modeling**: Temperature and precipitation simulation
4. **Biome Assignment**: Based on climate data
5. **Hydrology**: River and lake generation
6. **Political Entities**: States, provinces, and burgs (settlements)
7. **Cultural Features**: Cultures, religions, emblems

### Data Storage

- Uses IndexedDB for local storage
- Maps saved in `.map` format (custom text-based format)
- Style presets stored in JSON format
- Supports cloud storage integration (Dropbox)

## Troubleshooting

### Common Issues

1. **"Cannot run serverless" Error**:
   - Make sure you're running a local web server
   - Opening `index.html` directly in a browser won't work due to CORS restrictions

2. **Performance Issues**:
   - Reduce the number of map cells in the options
   - Close unnecessary browser tabs
   - Use a modern browser with good JavaScript performance

3. **Map Not Loading**:
   - Clear browser cache and try again
   - Check browser console for error messages
   - Ensure all files are present in the project directory

### Browser Support

- Chrome 60+
- Firefox 55+
- Edge 79+
- Safari 12+

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Based on the original work by Azgaar
- Uses D3.js for data visualization
- Inspired by various fantasy map creation techniques