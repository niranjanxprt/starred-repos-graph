#!/usr/bin/env node

/**
 * Data Cleanup Script for GitHub Stars Graph
 * Fixes corrupted descriptions in the repositories.json file
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/repositories.json');

// Common patterns that indicate corruption
const CORRUPTION_PATTERNS = [
  /\s{2,}/g, // Multiple spaces
  /\b[a-z] [a-z] [a-z]/g, // Single characters separated by spaces (like "f o r")
  /\b[a-z] {2,}[a-z]/g, // Characters with multiple spaces between them
];

// Known corrupted words and their corrections
const WORD_CORRECTIONS = {
  'E gi ee i g': 'Engineering',
  'f ee': 'free',
  'i e-week': 'nine-week',
  'cou se': 'course',
  'cove s': 'covers',
  'fu dame tals': 'fundamentals',
  'data e gi ee i g': 'data engineering',
  'Ready-to- u ': 'Ready-to-run',
  'fo ': 'for',
  'pipeli es': 'pipelines',
  'a d': 'and',
  'e te p ise': 'enterprise',
  'sea ch': 'search',
  'Sha epoi t': 'SharePoint',
  'D ive': 'Drive',
  'Postg eSQL': 'PostgreSQL',
  'eal-time': 'real-time',
  'mo e': 'more',
  'Te so Flow': 'TensorFlow',
  'Tuto ial': 'Tutorial',
  'Examples': 'Examples',
  'Begi  e s': 'Beginners',
  'suppo t': 'support',
  'Impleme t': 'Implement',
  'PyTo ch': 'PyTorch',
  'f om': 'from',
  'sc atch': 'scratch',
  'Pytho ': 'Python',
  'Scie ce': 'Science',
  'Ha dbook': 'Handbook',
  'Jupyte ': 'Jupyter',
  'Notebooks': 'Notebooks',
  'Scaled': 'Scaled',
  'Ze o': 'Zero',
  'Millio ': 'Million',
  'Sto e': 'Store',
  'Dukaa ': 'Dukaani',
  'Without': 'Without',
  'Deg ee': 'Degree',
  'Ha dbook': 'Handbook',
  'Choudha y': 'Choudhary',
  'esou ces': 'resources',
  'eed': 'need',
  'Se io ': 'Senior',
  'E gi ee ': 'Engineer',
  'beyo d': 'beyond'
};

// Comprehensive word fixes based on common patterns
const PATTERN_FIXES = [
  // Fix 'n' replacements
  { pattern: /\bn\b/g, replacement: 'and' },
  { pattern: /\bi n\b/g, replacement: 'in' },
  { pattern: /\bo n\b/g, replacement: 'on' },
  { pattern: /\ba n\b/g, replacement: 'an' },
  
  // Fix 'r' replacements  
  { pattern: /\b(\w+) (\w+)\b/g, replacement: (match, word1, word2) => {
    // Try to reconstruct words where 'r' was replaced with space
    const combined = word1 + 'r' + word2;
    const commonWords = ['for', 'their', 'from', 'are', 'more', 'your', 'our', 'or', 'every', 'other'];
    if (commonWords.includes(combined.toLowerCase())) {
      return combined;
    }
    return match; // Keep original if not a known word
  }}
];

function cleanDescription(description) {
  if (!description || typeof description !== 'string') {
    return description;
  }

  let cleaned = description;

  // Apply word-by-word corrections
  for (const [corrupted, correct] of Object.entries(WORD_CORRECTIONS)) {
    const regex = new RegExp(corrupted.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    cleaned = cleaned.replace(regex, correct);
  }

  // Apply pattern fixes
  for (const fix of PATTERN_FIXES) {
    cleaned = cleaned.replace(fix.pattern, fix.replacement);
  }

  // Clean up multiple spaces
  cleaned = cleaned.replace(/\s{2,}/g, ' ').trim();

  return cleaned;
}

function detectCorruption(description) {
  if (!description || typeof description !== 'string') {
    return false;
  }

  // Check for common corruption patterns
  for (const pattern of CORRUPTION_PATTERNS) {
    if (pattern.test(description)) {
      return true;
    }
  }

  // Check for known corrupted words
  for (const corrupted of Object.keys(WORD_CORRECTIONS)) {
    if (description.toLowerCase().includes(corrupted.toLowerCase())) {
      return true;
    }
  }

  return false;
}

async function main() {
  try {
    console.log('🧹 Starting data cleanup...');
    
    // Read the data file
    if (!fs.existsSync(DATA_FILE)) {
      console.error('❌ Data file not found:', DATA_FILE);
      process.exit(1);
    }

    const rawData = fs.readFileSync(DATA_FILE, 'utf8');
    const data = JSON.parse(rawData);

    if (!data.repositories || !Array.isArray(data.repositories)) {
      console.error('❌ Invalid data format');
      process.exit(1);
    }

    let corruptedCount = 0;
    let cleanedCount = 0;

    // Process each repository
    data.repositories.forEach((repo, index) => {
      const originalDescription = repo.description;
      
      if (detectCorruption(originalDescription)) {
        corruptedCount++;
        const cleanedDescription = cleanDescription(originalDescription);
        
        if (cleanedDescription !== originalDescription) {
          cleanedCount++;
          repo.description = cleanedDescription;
          console.log(`📝 Cleaned #${index + 1} (${repo.fullName}):`);
          console.log(`   Before: "${originalDescription}"`);
          console.log(`   After:  "${cleanedDescription}"`);
          console.log('');
        }
      }
    });

    // Update metadata
    data.lastCleaned = new Date().toISOString();
    data.cleanupStats = {
      totalRepositories: data.repositories.length,
      corruptedFound: corruptedCount,
      descriptionsFixed: cleanedCount,
      cleanupDate: new Date().toISOString()
    };

    // Write the cleaned data back to file
    const backupFile = DATA_FILE.replace('.json', '.backup.json');
    fs.writeFileSync(backupFile, rawData);
    console.log(`💾 Backup created: ${backupFile}`);

    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    console.log(`✅ Data cleaned successfully!`);
    console.log(`📊 Summary:`);
    console.log(`   - Total repositories: ${data.repositories.length}`);
    console.log(`   - Corrupted descriptions found: ${corruptedCount}`);
    console.log(`   - Descriptions fixed: ${cleanedCount}`);
    console.log(`   - Backup saved to: ${backupFile}`);

  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { cleanDescription, detectCorruption };