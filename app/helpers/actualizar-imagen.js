const fs = require('fs');
const Tutorial = require('../models/tutorial.model');
const User = require('../models/user.model');

const actualizarImagen = async(tipo, id, path, nombreArchivo) => {
    try {
        const mapTipo = {
            'tutorials': await Tutorial.findById(id),
            'users': await User.findById(id),
        }
        const resultadoColeccion = mapTipo[tipo];
        if (resultadoColeccion.length == 0) {
            return false;
        }

        const pathViejo = `./uploads/${tipo}/${resultadoColeccion.img}`
        if (fs.existsSync(pathViejo)) {
            //borrar la imagen si existe
            fs.unlinkSync(pathViejo)
        }
        resultadoColeccion.img = nombreArchivo;
        await resultadoColeccion.save();
        return true;


    } catch (error) {
        return false;
    }
}



module.exports = {
    actualizarImagen
};