const mongooose = require("mongoose");

const connectionRequestSchema = new mongooose.Schema({
    fromUserId : {
        type: mongooose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    toUserId : {
        type: mongooose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status : {
        type: String,
        enum: {
            values: [ "ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type.`
        }
    }
},
{ timestamps: true});

connectionRequestSchema.index({fromUserId: 1, toUserId: 1});

const connectionRequestModel = new mongooose.model("connectionRequestModel", connectionRequestSchema);

module.exports = connectionRequestModel;