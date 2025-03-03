const mongoose = require('mongoose');

const QuoteModel = mongoose.model('Quote');
const InvoiceModel = mongoose.model('Invoice');
const People = mongoose.model('People');
const Company = mongoose.model('Company');

const remove = async (Model, req, res) => {
  const { id } = req.params;

  // Check if client has any quotes or invoices
  const resultQuotes = QuoteModel.findOne({
    client: id,
    removed: false,
  }).exec();
  const resultInvoice = InvoiceModel.findOne({
    client: id,
    removed: false,
  }).exec();

  // Run both queries concurrently
  const results = await Promise.all([resultQuotes, resultInvoice]);
  const [quotes, invoice] = results;
  
  // Check if any quotes or invoices exist for this client
  if (quotes) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Cannot delete client if client has any quote or invoice',
    });
  }
  
  if (invoice) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Cannot delete client if client has any quote or invoice',
    });
  }

  // If no quotes or invoices, proceed with deletion
  let result = await Model.findOneAndDelete({
    _id: id,
    removed: false,
  }).exec();

  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No client found by this id: ' + id,
    });
  }

  // Update related models based on client type
  if (result.type === 'people') {
    await People.findOneAndUpdate(
      {
        _id: result.people._id,
        removed: false,
      },
      { isClient: false },
      {
        new: true, // return the new result instead of the old one
        runValidators: true,
      }
    ).exec();
  } else {
    await Company.findOneAndUpdate(
      {
        _id: result.company._id,
        removed: false,
      },
      { isClient: false },
      {
        new: true, // return the new result instead of the old one
        runValidators: true,
      }
    ).exec();
  }

  return res.status(200).json({
    success: true,
    result: null,
    message: 'Successfully Deleted the client by id: ' + id,
  });
};

module.exports = remove;