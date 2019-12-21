import { primitives3d } from '@jscad/scad-api';
// console.log("WORKER", primitives3d);

// onmessage = function(e) {
//   console.log('Worker: Message received from main script');
//   let result = e.data[0] * e.data[1];
//   if (isNaN(result)) {
//     postMessage('Please write two numbers');
//   } else {
//     let workerResult = 'Result: ' + result;
//     console.log('Worker: Posting message back to main script');
//     postMessage(workerResult);
//   }
// }

onmessage = function(e) {
  // let result = e.data[0] * e.data[1];
  postMessage(primitives3d.cube({ size: e.data[0] }));
}


export default onmessage;