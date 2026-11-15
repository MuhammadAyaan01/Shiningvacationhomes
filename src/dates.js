export function dateErrors(arrival,departure,today){
  let start='',end='';
  if(arrival&&arrival<today)start='Choose today or a future check-in date.';
  if(departure&&!arrival)start='Choose a check-in date first.';
  if(arrival&&departure&&departure<=arrival)end='Check-out must be after check-in.';
  return {start,end};
}
