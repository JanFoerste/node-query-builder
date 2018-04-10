#!/usr/bin/env node

let QueryBuilder = require('./dist/index').QueryBuilder;

let builder = new QueryBuilder('test');
builder.select(['test', 'test2'])
    .where('test', '!=', 'test2');

console.log(builder.getQuery());