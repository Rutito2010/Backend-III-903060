import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  originalName: { type: String, required: true},
  fileName: { type: String, required: true},
  path: { type: String, required:true},//"uploads/documents/{fileName}",
  mimeType: { type: String, required: true /**enum:podemos definir mimetypes para que mongo tmb lo valide*/},
  size: { type: Number, required: true },
  type: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
}, {_id: false})

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'El apellido es obligatorio'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria']
  },
  role: {
    type: String,
    enum: ['admin', 'customer', 'driver', 'store'],
    default: 'customer'
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  documents: {
    type: [documentSchema],
    default: []
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;
