const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const lambdaDir = path.join(__dirname, '../dist/lambda');
const distDir = path.join(__dirname, '../dist/lambda-bundled');

// Create dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Get all .js files in the dist/lambda directory (compiled TypeScript files)
const lambdaFiles = fs.readdirSync(lambdaDir)
  .filter(file => file.endsWith('.js') && !file.endsWith('.d.js'))
  .map(file => path.join(lambdaDir, file));

// Common configuration for esbuild
const buildConfig = {
  entryPoints: lambdaFiles,
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'cjs',
  outdir: distDir,
  external: ['aws-sdk'], // Exclude aws-sdk since it's available in the Lambda runtime
  minify: false,
  sourcemap: false,
};

// Build all Lambda functions
async function build() {
  try {
    console.log('Building Lambda functions...');
    await esbuild.build(buildConfig);
    console.log('✅ Lambda functions built successfully in dist/lambda-bundled/');
  } catch (error) {
    console.error('❌ Error building Lambda functions:', error);
    process.exit(1);
  }
}

build();
