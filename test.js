#!/usr/bin/env node

let QueryBuilder = require('./dist/index').QueryBuilder;

let builder = new QueryBuilder('test');
builder.select(['test', 'test2'])
    .where('test', 'test2')
    .orWhere('123', '456')
    .where('abc', '!=', 'def')
    .orWhereColumn('123', '=', 'a.123');

console.log(builder.getQuery());