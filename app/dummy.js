const sizeData = 'Size 348.89 MiB'; //Size 348.89 MiB

// let res = sizeData.substr(sizeData.indexOf(' ') + 1);
// console.log(res);
let size = extractSizeData(sizeData);
console.log(size);
let decimalPart = 0;
if(size.indexOf('.') > -1){
    decimalPart = size.substr(size.indexOf('.') + 1);
    size = size.substr(0, size.indexOf('.'));
}
const sizeIn = extractSizeIn(sizeData);

if(decimalPart > 0 && sizeIn.startsWith('G')){
    size = size * 1000;
    let multiplyBy = 1;
    if(decimalPart.length === 1){
        multiplyBy = 100;
    }
    if(decimalPart.length === 2){
        multiplyBy = 10;        
    }
    size = size + (decimalPart * multiplyBy);    
}
console.log(`Size is ${size} MB`);

function extractSizeIn(data){
    const a = data.split(' ');
    console.log(a);
    return a[a.length - 1];
}

function extractSizeData(data) {
    let res = data.substr(data.indexOf(' ') + 1);
    let output = '';
    for (var i = 0; i < res.length; i++) {
        if (res.charAt(i).match(/^[0-9\.]+$/)) {
            output += res.charAt(i);
            continue;
        }
        break;
    }
    output = output.trim();
    console.log(`>${output}<`);
    return output;
}