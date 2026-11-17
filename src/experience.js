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

export function backToTopVisible(scrollPosition){
  return scrollPosition>550;
}

export function backToTopLift(button,footerLabel,footerRowTop,gap=16){
  if(!button||!footerLabel)return 0;
  if(button.right<=footerLabel.left||button.left>=footerLabel.right)return 0;
  if(button.bottom+gap<=footerRowTop||button.top>=footerLabel.bottom+gap)return 0;
  return Math.max(0,button.bottom-footerRowTop+gap);
}
