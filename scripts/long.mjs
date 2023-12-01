#!/usr/bin/env node

// this is an example of a long running script for demo purposes

const duration = 5;
await new Promise((resolve) => setTimeout(resolve, duration * 1000));
console.log(`ran for ${duration}s`);
