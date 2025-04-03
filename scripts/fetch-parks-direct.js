import axios from 'axios';
import { parse } from 'node-html-parser';
import fs from 'fs';
import path from 'path';

// Wikipedia page URL
const WIKI_URL = 'https://en.wikipedia.org/wiki/List_of_national_parks_of_India';

async function fetchWikiPage() {
  try {
    const response = await axios.get(WIKI_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching Wikipedia page:', error);
    throw error;
  }
}

async function parseWikiPage() {
  try {
    console.log('Fetching Wikipedia page...');
    const html = await fetchWikiPage();
    const root = parse(html);
    
    console.log('Parsing parks data...');
    // Find all h3 sections with state names
    const stateSections = root.querySelectorAll('h3');
    
    const parks = [];
    
    for (const section of stateSections) {
      // Get the state name
      const stateNameElement = section.querySelector('.mw-headline');
      if (!stateNameElement) continue;
      
      const stateName = stateNameElement.textContent.trim();
      console.log(`Processing state: ${stateName}`);
      
      // Find the table after this h3
      let nextElement = section.nextElementSibling;
      
      // Skip any paragraphs and look for the table
      while (nextElement && nextElement.tagName !== 'TABLE') {
        nextElement = nextElement.nextElementSibling;
      }
      
      if (!nextElement || nextElement.tagName !== 'TABLE') {
        console.log(`No table found for state: ${stateName}`);
        continue;
      }
      
      const table = nextElement;
      // Process the rows of the table
      const rows = table.querySelectorAll('tr');
      
      if (rows.length <= 1) {
        console.log(`Table for state ${stateName} has no data rows`);
        continue;
      }
      
      // Get the header row to determine column indices
      const headerRow = rows[0];
      const headerCells = headerRow.querySelectorAll('th');
      
      if (headerCells.length === 0) {
        console.log(`Table for state ${stateName} has no header cells`);
        continue;
      }
      
      const headerTexts = Array.from(headerCells).map(cell => cell.textContent.trim().toLowerCase());
      console.log(`Headers for ${stateName}: ${headerTexts.join(', ')}`);
      
      // Find column indices
      const nameIndex = headerTexts.indexOf('name');
      const imageIndex = headerTexts.indexOf('image');
      const areaIndex = headerTexts.indexOf('area');
      
      // Skip tables without a name column
      if (nameIndex === -1) {
        console.log(`Table for state ${stateName} has no name column`);
        continue;
      }
      
      // Process data rows
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.querySelectorAll('td');
        
        if (cells.length <= nameIndex) {
          console.log(`Row ${i} in state ${stateName} has insufficient cells`);
          continue;
        }
        
        // Get the park name
        const nameCell = cells[nameIndex];
        const nameLink = nameCell.querySelector('a');
        let parkName = nameLink ? nameLink.textContent.trim() : nameCell.textContent.trim();
        
        // Clean up name by removing citations
        parkName = parkName.replace(/\[\d+\]/g, '').trim();
        
        if (!parkName) {
          console.log(`Row ${i} in state ${stateName} has empty park name`);
          continue;
        }
        
        console.log(`Found park: ${parkName} in ${stateName}`);
        
        // Get image if available
        let imageUrl = '';
        if (imageIndex !== -1 && cells.length > imageIndex) {
          const imageCell = cells[imageIndex];
          const img = imageCell.querySelector('img');
          if (img) {
            const src = img.getAttribute('src');
            if (src) {
              // Convert to full URL if needed
              if (src.startsWith('//')) {
                imageUrl = 'https:' + src;
              } else if (src.startsWith('/')) {
                imageUrl = 'https://en.wikipedia.org' + src;
              } else {
                imageUrl = src;
              }
            }
          }
        }
        
        // Get area if available
        let area = 'Unknown';
        if (areaIndex !== -1 && cells.length > areaIndex) {
          area = cells[areaIndex].textContent.trim().replace(/\[\d+\]/g, '');
        }
        
        parks.push({
          id: parks.length + 1,
          name: parkName,
          imageUrl: imageUrl || 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png',
          location: stateName,
          area,
          formed: 'Unknown',
          notableFeatures: '',
          floraAndFauna: 'Various native species',
          elo: 1500,
          wins: 0,
          losses: 0
        });
      }
    }
    
    console.log(`Total parks found: ${parks.length}`);
    
    // Use default images for parks without images
    const defaultImages = [
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
    
    for (let i = 0; i < parks.length; i++) {
      if (!parks[i].imageUrl || parks[i].imageUrl === 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png') {
        parks[i].imageUrl = defaultImages[i % defaultImages.length];
      }
    }
    
    // Write the result to a file
    const outputPath = path.resolve('server', 'data', 'parks.json');
    fs.writeFileSync(outputPath, JSON.stringify(parks, null, 2));
    console.log(`Parks data has been written to ${outputPath}`);
    
    return parks;
  } catch (error) {
    console.error('Error parsing Wiki page:', error);
    throw error;
  }
}

// Run the script
parseWikiPage()
  .then(() => console.log('Done!'))
  .catch(err => console.error('Error:', err));