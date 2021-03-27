console.clear();

let filename = "linux_os_system_bullet_black_30908_1920x1200.jpg";
filename = filename.split('.');
let ext = filename[filename.length - 1];
filename = filename.slice(0, -1).join('.')

console.log(filename);
console.log(ext);

