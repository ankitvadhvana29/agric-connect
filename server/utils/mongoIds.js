import mongoose from 'mongoose';

const HEX_24 = /^[a-fA-F0-9]{24}$/;

export const isMongoId = (value) => {
  if (value == null) return false;
  if (value instanceof mongoose.Types.ObjectId) return true;
  const id = typeof value === 'object' ? value._id || value.id : value;
  return typeof id === 'string' && HEX_24.test(id);
};

export const extractMongoId = (value) => {
  if (!isMongoId(value)) return null;
  if (value instanceof mongoose.Types.ObjectId) return value;
  if (typeof value === 'object') return value._id || value.id;
  return value;
};
