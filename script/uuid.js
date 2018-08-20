#! /usr/bin/env node

const uuid = require('uuid');
const MAX = 500;
const count = process.argv[2] ? parseInt(process.argv[2], 10) : 1;
for (let i = 0; i < Math.min(count, MAX); i++) {
  process.stdout.write(uuid() + '\n');
}
if (count > MAX) {
  process.stderr.write(`Truncated from ${count} to ${MAX}\n`);
}
