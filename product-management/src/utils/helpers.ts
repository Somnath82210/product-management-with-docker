import momentTimeZone from 'moment-timezone';
export function stringToBool(data:string){
    if(data==='true' || data ==='available' && typeof data==='string'){
        console.log("true data")
        return true
    } else if(data==='false' || data==='not available' && typeof data==='string'){
        console.log("elseif false")
        return false
    } else {
        console.log("false data")
        false
    }
} 

export function findSimilarValues(data:any) {
    if (data.length === 0) {
      return [];
    }
    let newArr:string[] = []
   data.map((value:any)=>{
    for (let i in value.parentId){
        if(value.parentId[i]!==undefined){
            newArr.push(value.parentId[i])
        }
    }
   })
   let newSet = [... new Set(newArr)]
   return newSet
  }

  export function localDateChanger(date: any) {
    if (typeof date === 'undefined') {
      return date;
    }
const currentTimeZone = momentTimeZone.tz(date, 'Asia/Kolkata')
return currentTimeZone.format('YYYY-MM-DD HH:mm:ss');
}