// backend/controller/dealer.js
const {dealer} = require("../model/dealer");

async function handleDealerDetail(req, res) {
    try {
        const { email, phone } = req.body;

        const newDealer = await dealer.create({ email, phone });

        res.status(201).json({
            message: "Dealer created successfully",
            dealer: newDealer,
        });
    } catch (err) {
        res.status(500).json({
            error: "Failed to create dealer",
            details: err.message,
        });
    }
}
async function handleDealerDetailForAdmin(req, res){
  const alluser = await dealer.find({});
  return res.end(`
    <html>
    <head></head>
    <body>
      <ol>
        ${alluser.map(dealer => `<li>${dealer.email} - ${dealer.phone}</li>`).join('')};
      </ol>
    </body>
    </html>
  `)
}
module.exports = { 
    handleDealerDetail,
    handleDealerDetailForAdmin,
};
