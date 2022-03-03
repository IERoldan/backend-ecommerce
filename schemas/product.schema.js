var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Categories = [
    'VERDURAS',
    'FRUTAS',
    'CARNES',
    'LACTEOS',
    'SNACKS',
    'BEBIDAS',
    'GRANEL',
    'LIMPIEZA',
    'PERFUMERIA',
    'GENERAL',
];
var ivaOptions = [
    21,
    10.5,
    0,
];

var ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50
    },
    description: {
        type: String,
        maxlength: 200
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Boolean,
        required: true,
        default:false,
    },
    category_id: {
        type: String,
        required: true,
        default: 'GENERAL',
        enum: Categories,
    },
    cod: {
        type: String,
        maxlength: 4,
        minlength: 4
    },
    iva: {
        type: String,
        required: true,
        default: 21,
        enum: ivaOptions,
    },
    createdAt:{
        type: Date,
        default: Date.now,
        required : true ,
    },
    updatedAt:{
        type: Date,
    },
})

module.exports = mongoose.model('Product', ProductSchema)