import axios from 'axios';
import { parse } from 'node-html-parser';
import fs from 'fs';
import path from 'path';

// Wikipedia page URL
const WIKI_URL = 'https://en.wikipedia.org/wiki/List_of_national_parks_of_India';

async function fetchWikiPage(): Promise<string> {
  try {
    const response = await axios.get(WIKI_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching Wikipedia page:', error);
    throw error;
  }
}

async function getWikimediaImageUrl(imageName: string): Promise<string> {
  try {
    // Replace spaces with underscores and handle URL encoding
    const formattedName = encodeURIComponent(imageName.replace(/ /g, '_'));
    
    // First, get the image info from the Wikimedia API
    const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${formattedName}&prop=imageinfo&iiprop=url&format=json&origin=*`;
    
    const response = await axios.get(infoUrl);
    const pages = response.data.query.pages;
    const pageId = Object.keys(pages)[0];
    
    // If page ID is -1, the image doesn't exist
    if (pageId === '-1') {
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png';
    }
    
    const imageInfo = pages[pageId].imageinfo;
    if (imageInfo && imageInfo.length > 0) {
      return imageInfo[0].url;
    } else {
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png';
    }
  } catch (error) {
    console.error(`Error fetching image URL for ${imageName}:`, error);
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png';
  }
}

async function parseParksData(html: string): Promise<any[]> {
  const root = parse(html);
  
  // Find all tables with national parks data
  const tables = root.querySelectorAll('table.wikitable.sortable');
  
  if (tables.length === 0) {
    throw new Error('Could not find any national parks tables on the Wikipedia page');
  }
  
  console.log(`Found ${tables.length} tables on the page`);
  
  const parks = [];
  
  // Generate a placeholder image for parks without images
  const defaultImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png';
  
  // Process each table
  for (const table of tables) {
    // Extract rows from the table (skip the header row)
    const rows = table.querySelectorAll('tr');
    
    console.log(`Processing table with ${rows.length} rows`);
    
    // Skip tables with only header rows
    if (rows.length <= 1) continue;
    
    // Check if this is a table containing national parks
    const headerRow = rows[0];
    const headerCells = headerRow.querySelectorAll('th');
    const headerTexts = Array.from(headerCells).map(cell => cell.textContent.trim().toLowerCase());
    
    console.log('Table headers:', headerTexts.join(', '));
    
    // Skip tables that don't have appropriate headers for national parks
    if (!headerTexts.includes('name') && !headerTexts.includes('national park')) {
      console.log('Skipping table - does not appear to be a national parks table');
      continue;
    }
    
    // Start from index 1 to skip the header row
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      
      // If the row has "th" cells, it might be a subheader, skip it
      if (row.querySelector('th')) {
        continue;
      }
      
      const cells = row.querySelectorAll('td');
      
      // Skip rows with insufficient data
      if (cells.length < 3) {
        console.log(`Skipping row ${i} - insufficient cells (${cells.length})`);
        continue;
      }
      
      // Determine the column indices based on the header
      let nameIndex = headerTexts.indexOf('name');
      if (nameIndex === -1) nameIndex = headerTexts.indexOf('national park');
      if (nameIndex === -1) nameIndex = 0;
      
      let imageIndex = headerTexts.indexOf('image');
      if (imageIndex === -1) imageIndex = 1;
      
      let locationIndex = headerTexts.indexOf('location');
      if (locationIndex === -1) locationIndex = headerTexts.indexOf('state');
      if (locationIndex === -1) locationIndex = 2;
      
      let areaIndex = headerTexts.indexOf('area');
      if (areaIndex === -1) areaIndex = 3;
      
      let establishedIndex = headerTexts.indexOf('established');
      if (establishedIndex === -1) establishedIndex = headerTexts.indexOf('date of notification');
      if (establishedIndex === -1) establishedIndex = 4;
      
      let notableFeaturesIndex = headerTexts.indexOf('features');
      if (notableFeaturesIndex === -1) notableFeaturesIndex = headerTexts.indexOf('notable wildlife');
      if (notableFeaturesIndex === -1) notableFeaturesIndex = 5;
      
      // Ensure indices are within bounds
      nameIndex = Math.min(nameIndex, cells.length - 1);
      imageIndex = Math.min(imageIndex, cells.length - 1);
      locationIndex = Math.min(locationIndex, cells.length - 1);
      areaIndex = Math.min(areaIndex, cells.length - 1);
      establishedIndex = Math.min(establishedIndex, cells.length - 1);
      notableFeaturesIndex = notableFeaturesIndex < cells.length ? notableFeaturesIndex : -1;
      
      // Extract name - look for an anchor tag first, as it often contains the proper name
      const nameCell = cells[nameIndex];
      const nameAnchor = nameCell.querySelector('a');
      let name = nameAnchor ? nameAnchor.textContent.trim() : nameCell.textContent.trim();
      
      // Sometimes the name has reference numbers, remove them
      name = name.replace(/\[\d+\]/g, '').trim();
      
      // Skip if name is empty or just a number
      if (!name || /^\d+$/.test(name)) {
        console.log(`Skipping row ${i} - invalid name: "${name}"`);
        continue;
      }
      
      // Extract image URL if available
      let imageUrl = defaultImageUrl;
      const imageCell = cells[imageIndex];
      const imageElement = imageCell.querySelector('img');
      // Try to get the image file name from different sources
      let imageFileName = null;
      
      // First try to get from an anchor tag title
      const imageAnchor = imageCell.querySelector('a');
      if (imageAnchor && imageAnchor.getAttribute('title')) {
        imageFileName = imageAnchor.getAttribute('title');
      }
      // If that fails, try to get from the image src
      else if (imageElement && imageElement.getAttribute('src')) {
        const srcParts = imageElement.getAttribute('src').split('/');
        const filename = srcParts[srcParts.length - 1];
        imageFileName = 'File:' + decodeURIComponent(filename);
      }
      
      if (imageFileName) {
        // Use placeholder for now, we'll fetch actual URLs in a separate step
        imageUrl = 'placeholder';
      }
      
      // Extract location
      const locationCell = cells[locationIndex];
      const location = locationCell.textContent.trim().replace(/\[\d+\]/g, '');
      
      // Extract area
      const areaCell = cells[areaIndex];
      const area = areaCell ? areaCell.textContent.trim().replace(/\[\d+\]/g, '') : 'Unknown';
      
      // Extract establishment date
      const establishedCell = cells[establishedIndex];
      const formed = establishedCell ? establishedCell.textContent.trim().replace(/\[\d+\]/g, '') : 'Unknown';
      
      // Extract notable features if available
      const features = notableFeaturesIndex >= 0 ? cells[notableFeaturesIndex].textContent.trim().replace(/\[\d+\]/g, '') : '';
      
      // Log the park we're adding
      console.log(`Adding park: ${name} (${location})`);
      
      parks.push({
        name,
        imageUrl,
        imageFileName: imageFileName ? imageFileName.replace('File:', '') : null,
        location,
        area,
        formed,
        notableFeatures: features,
        floraAndFauna: 'Various native species',  // Default value
        elo: 1500,  // Default ELO rating
        wins: 0,
        losses: 0,
      });
    }
  }
  
  // Log a summary of the parks we found
  console.log(`Found ${parks.length} national parks.`);
  
  return parks;
}

async function getImageUrls(parks: any[]): Promise<any[]> {
  console.log(`Fetching image URLs for ${parks.length} parks...`);
  
  const parksWithImages = [];
  
  for (const park of parks) {
    if (park.imageFileName) {
      try {
        // Try to get Wikimedia image URL
        const imageUrl = await getWikimediaImageUrl(park.imageFileName);
        park.imageUrl = imageUrl;
      } catch (error) {
        console.error(`Error getting image for ${park.name}:`, error);
        // Keep placeholder if there's an error
      }
    }
    
    // Remove the imageFileName property as we no longer need it
    delete park.imageFileName;
    parksWithImages.push(park);
  }
  
  return parksWithImages;
}

// Fetch random images from Unsplash for parks without images
async function fetchDefaultParkImages(parks: any[]): Promise<any[]> {
  const unsplashAccessKey = 'your-unsplash-access-key';  // Not using this now
  
  // We'll use a list of nature/park images from Wikimedia Commons instead
  const defaultImageUrls = [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Bandipur_National_Park_Tiger.jpg/640px-Bandipur_National_Park_Tiger.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Madhavpur_mangrove_forest.jpg/640px-Madhavpur_mangrove_forest.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Satpura_Range.jpg/640px-Satpura_Range.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Tiger_in_Bandhavgarh_National_Park.jpg/640px-Tiger_in_Bandhavgarh_National_Park.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Ghats_at_Lakshman_Jhula.jpg/640px-Ghats_at_Lakshman_Jhula.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Deer_at_Bharatpur_Bird_Sanctuary.jpg/640px-Deer_at_Bharatpur_Bird_Sanctuary.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Leopard_spotted_at_Bandipur_National_Park.jpg/640px-Leopard_spotted_at_Bandipur_National_Park.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Srivilliputhur_Grizzled_Squirrel_Wildlife_Sanctuary.jpg/640px-Srivilliputhur_Grizzled_Squirrel_Wildlife_Sanctuary.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Asiatic_lion_in_Gir_Forest.jpg/640px-Asiatic_lion_in_Gir_Forest.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Sundarban_Tiger.jpg/640px-Sundarban_Tiger.jpg'
  ];
  
  for (const park of parks) {
    // Use placeholder URL as an indicator for parks without actual images
    if (park.imageUrl === 'placeholder' || park.imageUrl.includes('No_image_available')) {
      const randomIndex = Math.floor(Math.random() * defaultImageUrls.length);
      park.imageUrl = defaultImageUrls[randomIndex];
    }
  }
  
  return parks;
}

async function generateParksData() {
  try {
    console.log('Fetching Wikipedia page...');
    const html = await fetchWikiPage();
    
    console.log('Parsing parks data...');
    let parks = await parseParksData(html);
    
    console.log(`Found ${parks.length} national parks.`);
    
    console.log('Fetching image URLs...');
    parks = await getImageUrls(parks);
    
    console.log('Adding default images for parks without images...');
    parks = await fetchDefaultParkImages(parks);
    
    // Add IDs to parks
    parks = parks.map((park, index) => ({
      id: index + 1,
      ...park
    }));
    
    // Write the result to a file
    const outputPath = path.resolve('server', 'data', 'parks.json');
    
    // Create directory if it doesn't exist
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(parks, null, 2));
    console.log(`Parks data has been written to ${outputPath}`);
    
    // Also output the data in a format ready for our storage
    console.log('Parks Total:', parks.length);
    
    // Return the data
    return parks;
  } catch (error) {
    console.error('Error generating parks data:', error);
    throw error;
  }
}

// Run the script
generateParksData().catch(console.error);