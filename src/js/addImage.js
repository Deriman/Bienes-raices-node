import { Dropzone } from 'dropzone'

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

Dropzone.options.img = {
    dictDefaultMessage: 'Sube tus imagenes aquí',
    acceptedFiles: '.png, .jpg, .jpeg',
    maxFilesize: 5,
    maxFiles: 3,
    paralleUploads: 3,
    autoProcessQueue: true, // Si true sube imagen automaticamente
    addRemoveLinks: true,
    dictRemoveFile: 'Borrar archivo',
    dictMaxFilesExceeded: 'El límite es 1 archivo',
    headers: {
        'CSRF-Token': token
    }, 
    paramName: 'image'
}
