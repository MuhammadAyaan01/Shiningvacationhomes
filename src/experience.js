export function staySummary(arrival,departure,guests){
  const count=/^(?:[1-9]|1[0-2])$/.test(String(guests))?Number(guests):1;
  let dates='Dates flexible';
  if(arrival&&departure){
    const nights=(Date.parse(departure+'T00:00:00Z')-Date.parse(arrival+'T00:00:00Z'))/86400000;
    dates=Number.isInteger(nights)&&nights>0?`${nights} night${nights===1?'':'s'}`:'Check your dates';
  }else if(arrival)dates='Choose your check-out';
  else if(departure)dates='Choose your check-in';
  return `${dates} · ${count} guest${count===1?'':'s'}`;
}

export function backToTopVisible(scrollPosition,footerTop,viewportHeight,viewportWidth){
  return scrollPosition>550&&(viewportWidth<=1000||footerTop>=viewportHeight);
}
