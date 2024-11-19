import mongoose, { Schema } from "mongoose";

const EventSchema = new Schema(
  {
    titulo: {
      type: String,
      trim: true,
      required: [true, "O título é obrigatório"],
    },
    descricao: {
      type: String,
    },
    data: {
      type: Date,
      trim: true,
      required: [true, "A data é obrigatória"],
    },
    local: {
      type: String,
      trim: true,
      required: [true, "O local é obrigatório"],
    },
  },
  {
    toJSON: {
      transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const EventModel = mongoose.model("Event", EventSchema, "events");

export default EventModel;
