const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");

exports.getOne = (Model, popOptions) => {
  return catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if(popOptions) query.populate(popOptions)
    const doc = await query;
    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });
};

exports.getAll = (Model)=>{
  return async (req, res) => {
    try {
      const features = new APIFeatures(Model.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
  
      const doc = await features.query;
      res.status(200).json({
        status: "success",
        length: doc.length,
        data: {
          data: doc,
        },
      });
    } catch (error) {
      res.status(404).json({
        status: "fail",
        message: error,
      });
    }
  };
}

exports.createOne = (Model)=>{
  return catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
  
    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });
}

exports.deleteOne = (Model)=>{
  return catchAsync(async (req, res, next) => {
    await Model.findByIdAndDelete(req.params.id);
  
    res.status(204).json({
      status: "success",
    });
  });
}

exports.updateOne = (Model)=>{
  return catchAsync(async (req, res, next) => {
    const updatedDoc = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
  
    res.status(200).json({
      status: "success",
      data: {
        data: updatedDoc,
      },
    });
  });
}