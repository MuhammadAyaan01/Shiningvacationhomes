import test from 'node:test';
import assert from 'node:assert/strict';
import {dateErrors} from '../src/dates.js';
test('stay dates accept flexibility and future ranges; reject past, reversed, same-day and orphan departures',()=>{
 const today='2026-11-13';
 assert.deepEqual(dateErrors('','',today),{start:'',end:''});
 assert.deepEqual(dateErrors(today,'2026-11-14',today),{start:'',end:''});
 assert.deepEqual(dateErrors('2026-12-31','2027-01-02',today),{start:'',end:''});
 assert.ok(dateErrors('2026-11-12','2026-11-15',today).start);
 assert.ok(dateErrors('','2026-12-20',today).start);
 assert.ok(dateErrors('2026-12-20','2026-12-19',today).end);
 assert.ok(dateErrors('2026-12-20','2026-12-20',today).end);
 assert.deepEqual(dateErrors('2026-12-20','',today),{start:'',end:''});
});
