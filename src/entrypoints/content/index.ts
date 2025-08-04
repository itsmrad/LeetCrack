export default defineContentScript({
  matches: ['https://leetcode.com/*'],
  
  main: function() {
    console.log('Content script running on LeetCode!');
  }
  
})