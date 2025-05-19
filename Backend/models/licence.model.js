    import mongoose from "mongoose";

    const licenceSchema = mongoose.Schema(
    {
        licenceId: {
        type: String,
        required: true,
        },
        licenceHolder: {
        type: String,
        required: true,
        },
        licenceFor: {
        type: String,
        required: true,
        },
        licenceRenewalDate: {
        type: Date,
        required: true,
        },
        licencePublishDate: {
        type: Date,
        required: true,
        },
    },
    { timestamps: true }
    );

    const Licence = mongoose.model("licence", licenceSchema);

    export default Licence;
