import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to validate URL to prevent SSRF attacks
const isValidUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    
    // Only allow HTTP and HTTPS protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return false;
    }
    
    // Block localhost and private IP ranges
    const hostname = parsedUrl.hostname.toLowerCase();
    
    // Block localhost variations
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
      return false;
    }
    
    // Block private IP ranges (RFC 1918)
    const ip = hostname.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
    if (ip) {
      const [, a, b, c, d] = ip.map(Number);
      // 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
      if ((a === 10) || 
          (a === 172 && b >= 16 && b <= 31) || 
          (a === 192 && b === 168) ||
          (a === 169 && b === 254)) { // Link-local
        return false;
      }
    }
    
    // Block common cloud metadata endpoints
    if (hostname === '169.254.169.254' || hostname === 'metadata.google.internal') {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
};

// Function to load the complete article data from JSON file
const loadArticleData = () => {
  try {
    // Path to the JSON file containing the complete article data
    const jsonFilePath = path.join(__dirname, '../../yankee_bet_dynamic_api.json');
    const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.error('Error loading article data from JSON file:', error);
    return null;
  }
};

// Function to handle article data request
export const getArticleData = async (req, res) => {
  try {
    // Load the complete article data from the JSON file
    const articleData = loadArticleData();
    
    if (articleData) {
      return res.json(articleData); // Return the complete data
    }
    
    // Fallback error response
    res.status(500).send("Failed to load the article data");
  } catch (error) {
    console.error('Error in getArticleData:', error);
    res.status(500).send("Internal server error");
  }
};
