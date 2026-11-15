import test from 'node:test';
import assert from 'node:assert/strict';
import {createElement as h} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {AnimatedHeading} from '../components/animated-heading.js';

test('server-rendered title masks preserve emphasis, line breaks and one accessible heading name',()=>{
 const html=renderToStaticMarkup(h(AnimatedHeading,null,'Your Dubai',h('br'),h('em',null,'chapter.')));
 assert.match(html,/<h1 aria-label="Your Dubai chapter\.">/);
 assert.equal((html.match(/class="motion-word"/g)||[]).length,3);
 assert.match(html,/<br\/>/);assert.match(html,/<em>/);
 for(const delay of [0,85,170])assert.ok(html.includes(`animation-delay:${delay}ms`));
 assert.equal((html.match(/aria-hidden="true"/g)||[]).length,3);
});
