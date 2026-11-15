import {collectionGuidance} from '../src/collection-guidance.mjs';
export function CollectionGuide({slug}){const item=collectionGuidance[slug];return <section className="collection-guide"><h2>{item.title}</h2><p>{item.intro}</p><ul className="check-list">{item.questions.map(question=><li key={question}>{question}</li>)}</ul></section>}
