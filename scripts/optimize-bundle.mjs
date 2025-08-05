#!/usr/bin/env node

/**
 * Bundle Size Optimization Script
 * Removes unused dependencies and optimizes package.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🎯 BUNDLE SIZE OPTIMIZATION');
console.log('===========================\n');

// List of potentially unused dependencies to check and remove
const potentiallyUnused = [
  'framer-motion',
  'html2canvas',
  'jspdf',
  'leaflet',
  'react-leaflet',
  'workbox-precaching',
  'workbox-routing',
  'workbox-strategies',
  '@modelcontextprotocol/server-sequential-thinking',
  '@million/lint',
];

// Read package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

console.log('🔍 Analyzing dependencies for removal...\n');

const dependenciesToRemove = [];
const currentDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };

potentiallyUnused.forEach((dep) => {
  if (currentDeps[dep]) {
    console.log(`📦 Found potentially unused: ${dep}`);
    dependenciesToRemove.push(dep);
  }
});

if (dependenciesToRemove.length === 0) {
  console.log('✅ No unused dependencies found!');
} else {
  console.log(`\n🚀 Removing ${dependenciesToRemove.length} unused dependencies...\n`);

  // Remove dependencies
  dependenciesToRemove.forEach((dep) => {
    if (packageJson.dependencies[dep]) {
      delete packageJson.dependencies[dep];
      console.log(`   ❌ Removed from dependencies: ${dep}`);
    }
    if (packageJson.devDependencies[dep]) {
      delete packageJson.devDependencies[dep];
      console.log(`   ❌ Removed from devDependencies: ${dep}`);
    }
  });

  // Write updated package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

  console.log('\n📝 Updated package.json');
  console.log('⚡ Run "npm install" to update node_modules');
}

// Analyze current bundle sizes
console.log('\n📊 CURRENT BUNDLE ANALYSIS:');
try {
  const buildDir = path.join(__dirname, '..', '.next', 'static', 'chunks');
  if (fs.existsSync(buildDir)) {
    const chunks = fs
      .readdirSync(buildDir)
      .filter((file) => file.endsWith('.js'))
      .map((file) => {
        const filePath = path.join(buildDir, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          sizeKB: Math.round(stats.size / 1024),
        };
      })
      .sort((a, b) => b.sizeKB - a.sizeKB);

    console.log('   Largest chunks:');
    chunks.slice(0, 5).forEach((chunk) => {
      console.log(`   📦 ${chunk.name}: ${chunk.sizeKB}KB`);
    });
  }
} catch (_error) {
  console.log('   ⚠️  Could not analyze build chunks:', _error.message);
}
console.log('\n💡 OPTIMIZATION RECOMMENDATIONS:');
console.log('   1. Run "npm install" to remove unused packages');
console.log('   2. Run "npm run build" to see bundle size improvements');
console.log('   3. Run "npm run build:analyze" to analyze remaining bundle');
console.log('   4. Consider lazy loading for remaining large dependencies');

console.log('\n✅ Bundle optimization analysis complete!');
