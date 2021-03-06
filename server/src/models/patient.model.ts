'use strict';
const model = 'Patient';

import * as mongoose from 'mongoose';
let ObjectId = mongoose.Schema.Types.ObjectId;

const patientSchema = new mongoose.Schema({
  _id: {type: ObjectId, auto: true}, // auto generate new ObjectId
  name: {type: String, required: true},
  tierart: {type: String, required: true},
  rasse: String,
  eigentuemerVorname: String,
  eigentuemerNachname: {type: String, required: true}
}, {collection: model});

const Patient = mongoose.model(model, patientSchema);
module.exports = Patient;
