/**
 * Merge overlapping watched intervals into a unique list.
 * @param {Array<Array<number>>} intervals - List of [start, end] ranges
 * @returns {Array<Array<number>>} - Merged intervals
 */
function mergeIntervals(intervals) {
    intervals.sort((a, b) => a[0] - b[0]); 
    const merged = [];
  
    for (const interval of intervals) {
      if (!merged.length || merged[merged.length - 1][1] < interval[0]) {
        merged.push(interval); 
      } else {
        merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], interval[1]);
      }
    }
  
    return merged;
  }
  
export default mergeIntervals;