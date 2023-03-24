const path = require('path');
const fs = require('fs');
const { response } = require('express');
const { actualizarImagen } = require('../helpers/actualizar-imagen');

const fileUpload = (req, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = ['users', 'tutorials'];
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es un users, tutorials (tipo)'
        });
    }
    // validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msn: 'No hay ningun archivo'
        });
    }

    // procesar la imagen
    const file = req.files.image;

    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //validar extension
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            msn: 'No es una extension permitida'
        });
    }

    //generar el nombre del archivo
    const nombreArchivo = `${Date.now()}-${file.name}`;

    //path para guardar la imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    //mover la imagen
    file.mv(path, (err) => {
        if (err) {
            console.log(err)
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
        }

        //actualizar bd
        actualizarImagen(tipo, id, nombreArchivo);

        res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
        });

    });

};

const retornaImagen = (req, res) => {
    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

    //imagen por defecto
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);

    } else {
        const pathImg = path.join(__dirname, `../uploads/${tipo}/no-image.jpg`);
        res.sendFile(pathImg);
    }


};


module.exports = {
    fileUpload,
    retornaImagen
}