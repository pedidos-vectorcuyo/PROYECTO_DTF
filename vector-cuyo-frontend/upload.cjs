const client = require('scp2');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const uploadPath = '/home/u501128802/domains/vectorcuyo.com/public_html';
const sourcePath = path.join(__dirname, 'dist');
const host = '167.88.35.13';
const port = 65002;
const username = 'u501128802';

console.log('--- 🚀 Iniciando Despliegue Local Seguro ---');
console.log(`Origen: ${sourcePath}`);
console.log(`Destino: ${username}@${host}:${uploadPath}`);
console.log(`Puerto: ${port}`);
console.log('----------------------------------------------');

rl.question('➤ Introduce la contraseña SSH (la misma que en Hostinger) para continuar: ', (password) => {
    rl.close();

    if (!password) {
        console.error('❌ Error: La contraseña no puede estar vacía.');
        process.exit(1);
    }

    console.log('\n⏳ Conectando y subiendo archivos. Esto puede demorar unos minutos según tu conexión a internet...');

    client.scp(sourcePath + '/', {
        host: host,
        port: port,
        username: username,
        password: password,
        path: uploadPath
    }, function (err) {
        if (err) {
            console.error('❌ ¡Error durante la subida!');
            console.error(err);
            process.exit(1);
        } else {
            console.log('✅ ¡Despliegue completado exitosamente!');
            console.log('🌐 La web ya debería estar actualizada en produccion.');
            process.exit(0);
        }
    });
});
