import { Dropzone } from 'dropzone'

Dropzone.options.img = {
    dictDefaultMessage: 'Sube tus imagenes aquí',
    acceptedFiles: '.png, .jpg, .jpeg',
    maxFilesize: 5,
    maxFiles: 1,
    paralleUploads: 1,
    autoProcessQueue: false,
    addRemoveLinks: true,
    dictRemoveFile: 'Borrar archivo',
    dictMaxFilesExceeded: 'El límite es 1 archivo'
}
