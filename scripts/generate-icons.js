#!/usr/bin/env node
/**
 * Generate PWA icons from an SVG template
 */

import fs from 'fs';
import path from 'path';
import { createCanvas } from 'canvas';

// Icon sizes needed for PWA
const sizes = [16, 32, 72, 96, 128, 144, 152, 180, 192, 384, 512];

// Colors matching the app theme
const colors = {
  bg: '#150f05',
  primary: '#c8a84b',
  accent: '#f5e09a'
};

// Function to draw a yin-yang symbol on canvas
function drawYinYang(ctx, size) {
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.4;

  // Draw background
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, size, size);

  // Draw outer circle (Yang - light)
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = colors.primary;
  ctx.fill();

  // Draw Yin half (dark)
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, Math.PI / 2, Math.PI * 1.5);
  ctx.fillStyle = colors.bg;
  ctx.fill();

  // Draw small Yang circle (dark background with light center)
  const smallRadius = radius * 0.3;
  ctx.beginPath();
  ctx.arc(centerX, centerY - smallRadius, smallRadius, 0, Math.PI * 2);
  ctx.fillStyle = colors.primary;
  ctx.fill();

  // Draw small Yin circle (light background with dark center)
  ctx.beginPath();
  ctx.arc(centerX, centerY + smallRadius, smallRadius, 0, Math.PI * 2);
  ctx.fillStyle = colors.bg;
  ctx.fill();

  // Draw dots
  const dotRadius = smallRadius * 0.2;
  ctx.beginPath();
  ctx.arc(centerX, centerY - smallRadius, dotRadius, 0, Math.PI * 2);
  ctx.fillStyle = colors.bg;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(centerX, centerY + smallRadius, dotRadius, 0, Math.PI * 2);
  ctx.fillStyle = colors.primary;
  ctx.fill();
}

// Function to draw "易" character for larger icons
function drawYiCharacter(ctx, size) {
  const centerX = size / 2;
  const centerY = size / 2;

  // Draw background
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, size, size);

  // Draw border
  ctx.strokeStyle = colors.primary;
  ctx.lineWidth = Math.max(2, size / 50);
  const padding = size * 0.05;
  ctx.strokeRect(padding, padding, size - padding * 2, size - padding * 2);

  // Draw text - 易
  ctx.fillStyle = colors.accent;
  ctx.font = `bold ${size * 0.45}px "Noto Serif SC", serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('易', centerX, centerY);
}

// Create icons directory
const publicDir = path.join(new URL('.', import.meta.url).pathname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate icons
sizes.forEach(size => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  if (size >= 96) {
    drawYiCharacter(ctx, size);
  } else {
    drawYinYang(ctx, size);
  }

  const buffer = canvas.toBuffer('image/png');
  const filename = `icon-${size}.png`;
  const filepath = path.join(publicDir, filename);

  fs.writeFileSync(filepath, buffer);
  console.log(`Generated ${filename}`);
});

// Generate favicon.ico equivalent (16x16 and 32x32 already generated)
console.log('\nAll icons generated successfully!');
console.log('Remember to add the following to your package.json scripts:');
console.log('  "generate-icons": "node scripts/generate-icons.js"');
