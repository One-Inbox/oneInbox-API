const {
  updateAutomaticResponse,
} = require("../../../controllers/SocialMedia/SocialMediaActive/updateAutomaticResponse");

const updateAutomaticResponseHandler = async (req, res) => {
  const { automaticResponse } = req.body;
  const { id } = req.params;
  try {
    if (!id || !automaticResponse) throw new Error("Missing Data");
    if (!Array.isArray(automaticResponse))
      throw new Error("Invalid detail format");
    const result = await updateAutomaticResponse(id, automaticResponse);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = { updateAutomaticResponseHandler };
